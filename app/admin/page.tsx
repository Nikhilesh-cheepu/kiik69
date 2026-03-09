import Link from "next/link";

const CONTENT_CARDS = [
  {
    href: "/admin/sections/hero",
    name: "Hero",
    description: "Landing hero video and top headline.",
  },
  {
    href: "/admin/sections/offer_banner",
    name: "Offer banner",
    description: "Scrolling website-exclusive offer strip.",
  },
  {
    href: "/admin/sections/experience",
    name: "Experience section",
    description: "Experience strip cards and copy.",
  },
];

const DATA_CARDS = [
  {
    href: "/admin/menu",
    name: "Menu items",
    description: "Food and liquor items shown on the menu page.",
  },
  {
    href: "/admin/party-packages",
    name: "Party packages",
    description: "Packages used on the party packages page.",
  },
  {
    href: "/admin/media",
    name: "Media library",
    description: "Uploaded images and videos (Blob URLs).",
  },
  {
    href: "/admin/bookings",
    name: "Bookings",
    description: "Table booking submissions from the website.",
  },
  {
    href: "/admin/analytics",
    name: "Analytics",
    description: "Key click and booking event counts.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">
          Overview
        </h1>
        <p className="text-sm text-zinc-400">
          Start by choosing a section to edit or a data area to manage.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Website sections
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENT_CARDS.map((card) => (
            <DashboardCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Content & operations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DATA_CARDS.map((card) => (
            <DashboardCard key={card.href} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardCard({
  href,
  name,
  description,
}: {
  href: string;
  name: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] hover:border-zinc-700 hover:bg-zinc-900"
    >
      <h3 className="font-medium text-white">{name}</h3>
      <p className="text-sm text-zinc-400 mt-1">{description}</p>
      <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
        Open →
      </span>
    </Link>
  );
}

