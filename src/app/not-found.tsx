import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-zinc-100">
      <div className="text-center font-mono">
        <h1 className="mb-4 text-4xl font-bold text-emerald-400">404</h1>
        <p className="mb-4 text-xl text-zinc-400">Page not found</p>
        <Link href="/" className="text-emerald-400 underline hover:text-emerald-300">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
