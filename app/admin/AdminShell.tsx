"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || pathname === "/admin/login") return;
    fetch("/api/admin/session")
      .then((r) => {
        if (r.status === 401) router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [mounted, pathname, router]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const groups = [
    {
      title: "Main",
      items: [{ href: "/admin", label: "Dashboard" }],
    },
    {
      title: "Content",
      items: [
        { href: "/admin/sections/hero", label: "Hero" },
        { href: "/admin/sections/offer_banner", label: "Offer banner" },
        { href: "/admin/sections/experience", label: "Experience" },
      ],
    },
    {
      title: "Menu & offers",
      items: [
        { href: "/admin/menu", label: "Menu items" },
        { href: "/admin/party-packages", label: "Party packages" },
      ],
    },
    {
      title: "Operations",
      items: [
        { href: "/admin/media", label: "Media library" },
        { href: "/admin/bookings", label: "Bookings" },
        { href: "/admin/bills", label: "Bills" },
        { href: "/admin/analytics", label: "Analytics" },
      ],
    },
  ];

  const [navOpen, setNavOpen] = useState(false);

  // Close nav when route changes
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top app bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {pathname !== "/admin" && pathname !== "/admin/login" && (
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs text-zinc-200"
                aria-label="Back to admin dashboard"
              >
                ←
              </button>
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                SkyHy Live Sports Brewery
              </span>
              <span className="text-sm font-semibold text-zinc-50">
                Admin
                {pathname && pathname !== "/admin" && (
                  <span className="ml-1 text-xs font-normal text-zinc-400">
                    · {pathname.replace("/admin", "").replace(/\//g, " / ") || "Dashboard"}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-500">
                Formerly known as KIIK 69 Sports Bar
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700/70 bg-zinc-900/70 text-zinc-100 shadow-sm active:scale-95"
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <span
                className={`h-0.5 w-4 rounded-full bg-current transition-transform ${
                  navOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-4 rounded-full bg-current transition-opacity ${
                  navOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-4 rounded-full bg-current transition-transform ${
                  navOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 pb-8 pt-4">{children}</main>

      {/* Mobile nav drawer */}
      {navOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
          <nav className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xs border-l border-zinc-800 bg-zinc-950/98 shadow-[-18px_0_40px_rgba(0,0,0,0.85)]">
            <div className="flex h-full flex-col px-4 pb-6 pt-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    SkyHy Live Sports Brewery
                  </div>
                  <div className="text-xs text-zinc-500">
                    Formerly KIIK 69 Sports Bar
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-zinc-50">
                    Admin navigation
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNavOpen(false)}
                  aria-label="Close navigation"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-200"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto">
                {groups.map((group) => (
                  <div key={group.title}>
                    <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {group.title}
                    </div>
                    <div className="space-y-1">
                      {group.items.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                          <Link
                            key={href}
                            href={href}
                            className={`block rounded-xl px-3 py-2 text-sm ${
                              active
                                ? "bg-zinc-100 text-black"
                                : "text-zinc-200 hover:bg-zinc-800 hover:text-white"
                            }`}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-zinc-800 pt-4 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  View site →
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-300 hover:bg-red-900/40 hover:text-red-100"
                >
                  Log out
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

