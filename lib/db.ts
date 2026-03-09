import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_PUBLIC ||
  process.env.DATABASE_URL_PRIVATE;

const pool =
  connectionString &&
  new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  if (!pool) throw new Error("Database not configured");
  const result = await pool.query(text, params);
  return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
}

export async function getOne<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const { rows } = await query<T>(text, params);
  return rows[0] ?? null;
}

export type AdminUser = {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};

export type SiteSection = {
  id: number;
  section_key: string;
  name: string;
  data: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
};

export type SectionItem = {
  id: number;
  section_key: string;
  sort_order: number;
  data: Record<string, unknown>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type MediaRow = {
  id: number;
  blob_url: string;
  filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  key: string | null;
  created_at: Date;
};

export type MenuItemRow = {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string | null;
  image: string | null;
  menu_type: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
};

export type PartyPackageRow = {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  includes: string | null;
  image_url: string | null;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
};
