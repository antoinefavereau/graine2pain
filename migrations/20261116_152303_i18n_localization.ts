import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Create _locales enum
    DO $$ BEGIN
      CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- 2. Create tags_locales and migrate data
    CREATE TABLE IF NOT EXISTS "tags_locales" (
      "name" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "tags_locales_locale_parent_id_unique"
      ON "tags_locales" USING btree ("_locale", "_parent_id");

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'name') THEN
        INSERT INTO "tags_locales" ("_parent_id", "_locale", "name")
        SELECT "id", 'fr', "name" FROM "tags" WHERE "name" IS NOT NULL
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

        ALTER TABLE "tags" DROP COLUMN "name";
      END IF;
    END $$;

    -- 3. Create info_locales and migrate data
    CREATE TABLE IF NOT EXISTS "info_locales" (
      "titre" varchar,
      "valeur" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "info_locales" ADD CONSTRAINT "info_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."info"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "info_locales_locale_parent_id_unique"
      ON "info_locales" USING btree ("_locale", "_parent_id");

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'info' AND column_name = 'titre') THEN
        INSERT INTO "info_locales" ("_parent_id", "_locale", "titre", "valeur")
        SELECT "id", 'fr', "titre", "valeur" FROM "info"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

        ALTER TABLE "info" DROP COLUMN "titre";
        ALTER TABLE "info" DROP COLUMN "valeur";
      END IF;
    END $$;

    -- 4. Create recommandations_locales and migrate data
    CREATE TABLE IF NOT EXISTS "recommandations_locales" (
      "fonction" varchar,
      "message" varchar,
      "contenu" jsonb,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "recommandations_locales" ADD CONSTRAINT "recommandations_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."recommandations"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "recommandations_locales_locale_parent_id_unique"
      ON "recommandations_locales" USING btree ("_locale", "_parent_id");

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommandations' AND column_name = 'fonction') THEN
        INSERT INTO "recommandations_locales" ("_parent_id", "_locale", "fonction", "message", "contenu")
        SELECT "id", 'fr', "fonction", "message", "contenu" FROM "recommandations"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

        ALTER TABLE "recommandations" DROP COLUMN "fonction";
        ALTER TABLE "recommandations" DROP COLUMN "message";
        ALTER TABLE "recommandations" DROP COLUMN "contenu";
      END IF;
    END $$;

    -- 5. Create projects_locales and migrate data
    CREATE TABLE IF NOT EXISTS "projects_locales" (
      "title" varchar NOT NULL,
      "title_highlight" varchar,
      "sub_title" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "projects_locales_locale_parent_id_unique"
      ON "projects_locales" USING btree ("_locale", "_parent_id");

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'title') THEN
        INSERT INTO "projects_locales" ("_parent_id", "_locale", "title", "title_highlight", "sub_title")
        SELECT "id", 'fr', "title", "title_highlight", "sub_title" FROM "projects" WHERE "title" IS NOT NULL
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

        ALTER TABLE "projects" DROP COLUMN "title";
        ALTER TABLE "projects" DROP COLUMN "title_highlight";
        ALTER TABLE "projects" DROP COLUMN "sub_title";
      END IF;
    END $$;

    -- 6. Add _locale column to blocks tables with default 'fr'
    DO $$ BEGIN
      ALTER TABLE "projects_blocks_text_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'fr';
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "projects_blocks_split_stats_block_stats" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'fr';
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "projects_blocks_split_stats_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'fr';
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "projects_blocks_split_media_block_medias" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'fr';
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "projects_blocks_split_media_block" ADD COLUMN "_locale" "_locales" NOT NULL DEFAULT 'fr';
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    -- Indexes on block locales
    CREATE INDEX IF NOT EXISTS "projects_blocks_text_block_locale_idx" ON "projects_blocks_text_block" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "projects_blocks_split_stats_block_stats_locale_idx" ON "projects_blocks_split_stats_block_stats" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "projects_blocks_split_stats_block_locale_idx" ON "projects_blocks_split_stats_block" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "projects_blocks_split_media_block_medias_locale_idx" ON "projects_blocks_split_media_block_medias" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "projects_blocks_split_media_block_locale_idx" ON "projects_blocks_split_media_block" USING btree ("_locale");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "tags_locales" CASCADE;
    DROP TABLE IF EXISTS "info_locales" CASCADE;
    DROP TABLE IF EXISTS "recommandations_locales" CASCADE;
    DROP TABLE IF EXISTS "projects_locales" CASCADE;
  `)
}
