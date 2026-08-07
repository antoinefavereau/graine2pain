import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <div className="flex flex-col min-h-dvh gap-5">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <h1 className="text-7xl font-bold">Présentation</h1>
        <p className="text-2xl font-light">Page bientôt disponible...</p>
      </div>
    </div>
  );
}
