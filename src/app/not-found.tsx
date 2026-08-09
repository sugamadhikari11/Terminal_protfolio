import Link from "next/link";
import { SiteChrome } from "@/components/site/SiteChrome";
import { guiInk as ink } from "@/components/site/guiInk";

export default function NotFound() {
  return (
    <SiteChrome title="404">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className={`mb-3 font-mono text-4xl font-bold ${ink.strong}`}>404</h1>
        <p className={`mb-6 ${ink.soft}`}>Page not found</p>
        <Link href="/" className={ink.btnPrimary}>
          ← Home
        </Link>
      </div>
    </SiteChrome>
  );
}
