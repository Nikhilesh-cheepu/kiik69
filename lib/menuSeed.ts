import { query } from "./db";
import type { MenuItemRow } from "./db";
import { buildMenuItemsForUI } from "@/SKYHY_MENU_DATA";

let seeded = false;

export async function ensureMenuSeeded(): Promise<MenuItemRow[]> {
  let { rows } = await query<MenuItemRow>(
    "SELECT id, name, price, category, description, image, menu_type, is_available, created_at, updated_at FROM menu_items ORDER BY menu_type, category, name"
  );

  if (rows.length || seeded) {
    return rows;
  }

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

  const after = await query<MenuItemRow>(
    "SELECT id, name, price, category, description, image, menu_type, is_available, created_at, updated_at FROM menu_items ORDER BY menu_type, category, name"
  );
  return after.rows;
}
