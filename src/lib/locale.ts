export const EN_PREFIX = "/en";
export type Locale = "zh_CN" | "en";

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? "en" : "zh_CN";
}

export function stripLocaleFromPathname(pathname: string) {
  if (pathname === EN_PREFIX) return "/";
  if (pathname.startsWith(`${EN_PREFIX}/`)) return pathname.slice(EN_PREFIX.length);
  return pathname;
}

export function getRouterBasename(pathname = typeof window === "undefined" ? "/" : window.location.pathname) {
  return getLocaleFromPathname(pathname) === "en" ? EN_PREFIX : undefined;
}

export function getLocalizedPath(
  path: string,
  locale = getLocaleFromPathname(typeof window === "undefined" ? "/" : window.location.pathname)
) {
  if (locale !== "en") return stripLocaleFromPathname(path);

  const normalizedPath = stripLocaleFromPathname(path);
  return normalizedPath === "/" ? EN_PREFIX : `${EN_PREFIX}${normalizedPath}`;
}
