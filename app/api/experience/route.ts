import { NextResponse } from "next/server";
import { getOne, query } from "@/lib/db";
import type { SiteSection, SectionItem } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

export type ExperienceSectionData = {
  label?: string;
  heading?: string;
  supportingText?: string;
};

export type ExperienceCard = {
  id: number;
  sort_order: number;
  data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    ctaText?: string;
    ctaLink?: string;
    accentColor?: string;
  };
};

export type ExperiencePackageGroup = {
  id: number;
  sort_order: number;
  data: { label?: string };
};

export type ExperiencePackageItem = {
  id: number;
  sort_order: number;
  data: {
    groupId?: number;
    name?: string;
    description?: string;
    price?: string;
  };
};

export async function GET() {
  await ensureCoreTables();
  const section = await getOne<SiteSection>(
    "SELECT section_key, name, data FROM site_sections WHERE section_key = $1",
    ["experience"]
  );
  const { rows: cards } = await query<SectionItem>(
    "SELECT id, sort_order, data FROM section_items WHERE section_key = $1 AND is_active = true ORDER BY sort_order ASC, id ASC",
    ["experience_cards"]
  );
  const { rows: packageGroups } = await query<SectionItem>(
    "SELECT id, sort_order, data FROM section_items WHERE section_key = $1 ORDER BY sort_order ASC, id ASC",
    ["experience_package_groups"]
  );
  const { rows: packageItems } = await query<SectionItem>(
    "SELECT id, sort_order, data FROM section_items WHERE section_key = $1 ORDER BY sort_order ASC, id ASC",
    ["experience_package_items"]
  );

  const sectionData = (section?.data as ExperienceSectionData) || {};
  return NextResponse.json({
    section: {
      label: sectionData.label ?? "The Experience",
      heading: sectionData.heading ?? "More Than a Sports Bar",
      supportingText:
        sectionData.supportingText ??
        "Bowling · Live sports · Pool & darts · Food & drinks · Private parties",
    },
    cards: cards.map((c) => ({
      id: c.id,
      sort_order: c.sort_order,
      data: c.data || {},
    })),
    packageGroups: packageGroups.map((g) => ({
      id: g.id,
      sort_order: g.sort_order,
      data: g.data || {},
    })),
    packageItems: packageItems.map((p) => ({
      id: p.id,
      sort_order: p.sort_order,
      data: p.data || {},
    })),
  });
}
