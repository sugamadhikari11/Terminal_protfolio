import Link from "next/link";
import { profile, contacts } from "@/data/portfolio";
import { SITE_NAV } from "@/lib/site";
import HomeLink from "@/components/site/HomeLink";

type SiteChromeProps = {
  children: React.ReactNode;
  /** Optional page label shown next to back control */
  title?: string;
};

/**
 * GUI-sky document shell — same palette as the flight experience.
 * Minimal chrome: back home only (no mega-nav). Footer stays in-flow at the end.
 */
export function SiteChrome({ children, title }: SiteChromeProps) {
  return (
    <div className="site-doc relative flex min-h-screen flex-col font-mono text-[#0d2138]">
      {/* Sky backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(160deg, #c4dff2 0%, #d8eef8 42%, #b8d8ee 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -left-16 top-28 -z-10 h-56 w-56 rounded-full bg-white/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -right-12 top-[48%] -z-10 h-64 w-64 rounded-full bg-[#9ec9e8]/35 blur-3xl"
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#071525] focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Minimal glass bar — back only */}
      <header className="sticky top-0 z-50 border-b border-white/30 bg-white/25 backdrop-blur-xl">
        <div className="mx-auto flex w-full items-center justify-between px-[10%] py-3.5">
          <HomeLink className="rounded-full border border-[#0d2138]/10 bg-white/50 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#071525] transition hover:bg-white/80" />
          {title ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#1a3a5c]/50">
              {title}
            </span>
          ) : null}
        </div>
      </header>

      <div id="main" className="relative z-10 flex-1">
        {children}
      </div>

      <SiteFooter />
    </div>
  );
}

/**
 * In-flow cloudy footer — end of page, matches GUI sky.
 * `plain` drops the panel/gradient chrome (mobile GUI).
 */
export function SiteFooter({
  variant = "default",
}: {
  variant?: "default" | "plain";
}) {
  const year = new Date().getFullYear();
  const plain = variant === "plain";

  return (
    <footer
      className={[
        "relative font-mono",
        plain
          ? "border-t border-[#0d2138]/15 pt-8 pb-2"
          : "site-sky-footer mt-auto overflow-hidden border-t border-[#0d2138]/12",
      ].join(" ")}
    >
      {!plain ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(196,223,242,0.15) 0%, #c4dff2 30%, #d7eef9 70%, #b9d9ee 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-2 h-28 w-48 rounded-full bg-white/55 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 top-0 h-24 w-56 rounded-full bg-white/45 blur-2xl"
          />
        </>
      ) : null}

      <div
        className={[
          "relative z-10 w-full",
          plain ? "px-0 py-0" : "mx-auto px-[10%] py-10 md:py-12",
        ].join(" ")}
      >
        <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#1a3a5c]/55">
          Explore
        </p>
        <ul className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {SITE_NAV.map((item) => (
            <li key={item.href}>
              {item.href === "/" ? (
                <HomeLink className="text-[#0d2138]/90 underline decoration-dotted underline-offset-4 transition-colors hover:text-[#071525]">
                  {item.label}
                </HomeLink>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#0d2138]/90 underline decoration-dotted underline-offset-4 transition-colors hover:text-[#071525]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <Link
              href="/resume.pdf"
              className="text-[#0d2138]/90 underline decoration-dotted underline-offset-4 transition-colors hover:text-[#071525]"
            >
              Resume
            </Link>
          </li>
        </ul>

        <ul className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#16324f]/75">
          {contacts.map((c) => (
            <li key={c.label}>
              <a href={c.href} className="transition-colors hover:text-[#071525]">
                {c.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-[#1a3a5c]/55">
          © {year} {profile.name}
          {" · "}
          <Link
            href="/references"
            className="underline decoration-dotted underline-offset-2 hover:text-[#0d2138]"
          >
            References
          </Link>
        </p>
      </div>
    </footer>
  );
}
