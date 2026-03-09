import Link from "next/link";
import FullMenuClient from "../components/FullMenuClient";
import { buildMenuItemsForUI } from "@/SKYHY_MENU_DATA";

export const dynamic = "force-static";

export default function MenuPage() {
  const items = buildMenuItemsForUI();

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 sm:px-5">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-4 inline-block text-emerald-300 hover:text-emerald-200"
        >
          ← Back to home
        </Link>
        <FullMenuClient items={items} />
      </div>
    </div>
  );
}
