import { notFound } from "next/navigation";
import HeroSectionEditor from "./HeroSectionEditor";
import OfferBannerSectionEditor from "./OfferBannerSectionEditor";
import ExperienceSectionEditor from "./ExperienceSectionEditor";

const SECTION_KEYS = ["hero", "offer_banner", "experience"] as const;

export default async function SectionEditPage({
  params,
}: {
  params: Promise<{ sectionKey: string }>;
}) {
  const { sectionKey } = await params;
  if (!SECTION_KEYS.includes(sectionKey as (typeof SECTION_KEYS)[number])) {
    notFound();
  }
  return (
    <div>
      {sectionKey === "hero" && <HeroSectionEditor />}
      {sectionKey === "offer_banner" && <OfferBannerSectionEditor />}
      {sectionKey === "experience" && <ExperienceSectionEditor />}
    </div>
  );
}
