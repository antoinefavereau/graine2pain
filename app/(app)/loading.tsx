export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-grey-darkest">
      <output
        className="h-10 w-10 animate-spin rounded-full border-4 border-grey-light border-t-primary-base"
        aria-label="Chargement du site"
      />
    </div>
  );
}
