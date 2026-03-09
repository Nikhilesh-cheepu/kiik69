import HeroNavbar from "./components/HeroNavbar";
import HeroOfferBanner from "./components/HeroOfferBanner";
import HeroSection from "./components/HeroSection";
import ExperienceSection from "./components/ExperienceSection";
import HeroActionBar from "./components/HeroActionBar";
import MenuTeaserSection from "./components/MenuTeaserSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden pb-24 md:pb-28">
      <HeroNavbar />
      <HeroOfferBanner />
      <HeroSection />
      <ExperienceSection />
      <MenuTeaserSection />
      <HeroActionBar />
    </div>
  );
}
