import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { query } from "@/lib/db";
import { ensureCoreTables } from "@/lib/dbInit";

type CountRow = { count: string };

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  await ensureCoreTables();

  const [call, wa, bookingCta, bookingSubmit, packages, recent] =
    await Promise.all([
      query<CountRow>(
        "SELECT COUNT(*)::text AS count FROM analytics_events WHERE event_type = 'call_click'"
      ),
      query<CountRow>(
        "SELECT COUNT(*)::text AS count FROM analytics_events WHERE event_type = 'whatsapp_click'"
      ),
      query<CountRow>(
        "SELECT COUNT(*)::text AS count FROM analytics_events WHERE event_type = 'booking_cta_click'"
      ),
      query<CountRow>(
        "SELECT COUNT(*)::text AS count FROM analytics_events WHERE event_type = 'booking_submitted'"
      ),
      query<CountRow>(
        "SELECT COUNT(*)::text AS count FROM analytics_events WHERE event_type = 'packages_explore_click'"
      ),
      query(
        "SELECT id, event_type, page, section, metadata, created_at FROM analytics_events ORDER BY created_at DESC LIMIT 40"
      ),
    ]);

  return NextResponse.json({
    totals: {
      callClicks: Number(call.rows[0]?.count ?? "0"),
      whatsappClicks: Number(wa.rows[0]?.count ?? "0"),
      bookingCtaClicks: Number(bookingCta.rows[0]?.count ?? "0"),
      bookingSubmissions: Number(bookingSubmit.rows[0]?.count ?? "0"),
      packagesExploreClicks: Number(packages.rows[0]?.count ?? "0"),
    },
    recent: recent.rows,
  });
}

