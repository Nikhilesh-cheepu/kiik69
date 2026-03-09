"use client";

import { useEffect, useState } from "react";

type HeroData = { videoUrl?: string };

export default function HeroSectionEditor() {
  const [data, setData] = useState<HeroData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/sections/hero");
        if (res.ok) {
          const section = await res.json();
          setData((section.data as HeroData) || {});
        }
      } catch {
        setMessage({ type: "err", text: "Failed to load" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/sections/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Hero", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage({ type: "ok", text: "Saved" });
    } catch {
      setMessage({ type: "err", text: "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("key", `hero/video.${file.name.split(".").pop() || "mp4"}`);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setData((prev) => ({ ...prev, videoUrl: json.url }));
      setMessage({ type: "ok", text: "Video uploaded. Click Save to apply." });
    } catch {
      setMessage({ type: "err", text: "Upload failed" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return <p className="text-zinc-400">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Hero</h1>
      <p className="text-zinc-400 mb-6">Hero video (full viewport background).</p>

      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Video URL (Vercel Blob or any URL)
          </label>
          <input
            type="url"
            value={data.videoUrl ?? ""}
            onChange={(e) => setData((prev) => ({ ...prev, videoUrl: e.target.value }))}
            placeholder="https://...blob.vercel-storage.com/..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-[#ff003c] focus:outline-none focus:ring-1 focus:ring-[#ff003c]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Or upload a new video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            disabled={uploading}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#ff003c] file:px-4 file:py-2 file:text-white"
          />
          {uploading && <p className="text-sm text-zinc-500 mt-1">Uploading…</p>}
        </div>
        {message && (
          <p className={message.type === "ok" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-[#ff003c] px-4 py-2 font-medium text-white hover:bg-[#e60035] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
