export const SITE_URL = "https://sugamadhikari.com.np";
export const SITE_NAME = "Sugam Adhikari — SA Portfolio";

export const SITE_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/references", label: "References" },
] as const;

/** Absolute URL on the canonical host, with no trailing slash (root stays apex). */
export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const u = new URL(path);
    let pathname = u.pathname;
    if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");
    return pathname === "/"
      ? u.origin
      : `${u.origin}${pathname}${u.search}${u.hash}`;
  }

  let p = path.startsWith("/") ? path : `/${path}`;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}
