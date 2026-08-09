export const SITE_URL = "https://sugamadhikari.com.np";
export const SITE_NAME = "Sugam Adhikari — SA Portfolio";

export const SITE_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/references", label: "References" },
] as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
