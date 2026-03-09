import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { MenuItemRow } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";
import { buildMenuItemsForUI } from "@/SKYHY_MENU_DATA";

let seeded = false;

async function seedFromFile() {
  if (seeded) return;
  seeded = true;

  const items = buildMenuItemsForUI();
  for (const item of items) {
    await query(
      "INSERT INTO menu_items (name, price, category, description, image, menu_type, is_available) VALUES ($1,$2,$3,$4,$5,$6,true)",
      [
        item.name,
        item.price,
        item.category,
        item.description ?? null,
        item.image ?? null,
        item.menuType,
      ]
    );
  }
}

export async function GET() {
  await ensureCoreTables();
  let { rows } = await query<MenuItemRow>(
    "SELECT id, name, price, category, description, image, menu_type, is_available, created_at, updated_at FROM menu_items ORDER BY menu_type, category, name"
  );

  if (!rows.length) {
    await seedFromFile();
    ({ rows } = await query<MenuItemRow>(
      "SELECT id, name, price, category, description, image, menu_type, is_available, created_at, updated_at FROM menu_items ORDER BY menu_type, category, name"
    ));
  }

  const food = rows.filter((r) => r.menu_type === "food" && r.is_available);
  const liquor = rows.filter((r) => r.menu_type === "liquor" && r.is_available);

  return NextResponse.json({
    food,
    liquor,
  });
}

