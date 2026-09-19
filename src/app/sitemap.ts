import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";

const ORIGIN = "https://lezoo.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/login", "/register"];
  return LOCALES.flatMap((locale) =>
    pages.map((page) => ({
      url: `${ORIGIN}/${locale}${page}`,
      lastModified: new Date(),
    })),
  );
}
