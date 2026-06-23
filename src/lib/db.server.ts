import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const dbPath = resolve(process.cwd(), "public/db.json");

export async function readDB() {
  return JSON.parse(await readFile(dbPath, "utf-8"));
}

export async function readLocale(locale: "zh_CN" | "en") {
  const localePath = resolve(process.cwd(), `public/locales/${locale}.json`);
  return JSON.parse(await readFile(localePath, "utf-8"));
}
