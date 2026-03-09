"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Menu", href: "/menu", external: false },
  { label: "Packages", href: "/packages", external: false },
  { label: "Call", href: "tel:+919274696969", external: false },
  { label: "WhatsApp", href: "https://wa.me/919274696969", external: true },
  { label: "Instagram", href: "https://www.instagram.com/kiik69sportsbar.gachibowli/", external: true },
];

export default function HeroNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 right-0 top-0 z-50 flex h-12 items-center justify-between px-4 md:h-14 md:px-8"
        style={{
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,0,60,0.15)",
          boxShadow: "0 0 40px rgba(255,0,60,0.06)",
        }}
      >
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/logo.PNG"
              alt="SkyHy Live Sports Brewery"
              width={100}
              height={40}
              className="h-8 w-auto object-contain md:h-10"
              priority
            />
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl transition-colors hover:bg-white/5"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 5 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-0.5 w-6 rounded-full bg-white"
            />
            <motion.span
              animate={{
                opacity: isOpen ? 0 : 1,
                x: isOpen ? -10 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="h-0.5 w-6 rounded-full bg-white"
            />
            <motion.span
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -5 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-0.5 w-6 rounded-full bg-white"
            />
          </button>
        </div>
      </motion.header>

      {/* Menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm"
              style={{
                background: "linear-gradient(135deg, rgba(10,10,10,0.98) 0%, rgba(20,5,10,0.98) 100%)",
                boxShadow: "-10px 0 40px rgba(255,0,60,0.15)",
                borderLeft: "1px solid rgba(255,0,60,0.2)",
              }}
            >
              <div className="flex h-full flex-col pt-24 pb-12 px-8">
                <ul className="space-y-2">
                  {menuItems.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="block rounded-xl px-4 py-3 text-lg font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
