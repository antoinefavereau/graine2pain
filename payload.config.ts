import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { resendAdapter } from "@payloadcms/email-resend";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Tags } from "./collections/Tags";
import { InfoCard } from "./collections/InfoCard";
import { Recommandations } from "./collections/Recommandations";
import { Projects } from "./collections/Projects";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [],
  collections: [Users, Media, Tags, InfoCard, Recommandations, Projects],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [],
  email: resendAdapter({
    defaultFromAddress: "onboarding@resend.dev",
    defaultFromName: "Portfolio Admin graine2pain",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
});
