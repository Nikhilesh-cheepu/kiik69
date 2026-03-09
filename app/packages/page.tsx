import Link from "next/link";
import { query } from "@/lib/db";
import type { PartyPackageRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const { rows } = await query<PartyPackageRow>(
    "SELECT id, name, description, price, includes, image_url, is_available FROM party_packages WHERE is_available = true ORDER BY price::numeric NULLS LAST, name ASC"
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-[#ff003c] hover:underline"
        >
          ← Home
        </Link>
        <h1 className="mb-8 text-4xl font-bold">Party Packages</h1>
        <div className="grid gap-6 sm:grid-cols-2">
          {rows.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-lg border border-zinc-800 p-6"
            >
              <h2 className="text-xl font-bold">{pkg.name}</h2>
              {pkg.price && (
                <p className="mt-2 text-2xl text-[#ff003c]">₹{pkg.price}</p>
              )}
              {pkg.description && (
                <p className="mt-2 text-zinc-400">{pkg.description}</p>
              )}
              {pkg.includes && (
                <p className="mt-2 text-sm text-zinc-500 whitespace-pre-line">
                  {pkg.includes}
                </p>
              )}
              <a
                href={`https://wa.me/919274696969?text=Hi! I'm interested in the ${encodeURIComponent(
                  pkg.name
                )} package at SkyHy Live Sports Brewery (formerly KIIK 69 Sports Bar).`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-[#25D366] px-6 py-2 font-semibold text-white transition hover:bg-[#20bd5a]"
              >
                Book via WhatsApp
              </a>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-sm text-zinc-500">
              No packages configured yet. Use the admin to add party packages.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
