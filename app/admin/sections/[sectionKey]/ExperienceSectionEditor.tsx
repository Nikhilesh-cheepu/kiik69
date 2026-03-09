"use client";

import { useEffect, useState } from "react";

type CardItem = {
  id: number;
  section_key: string;
  sort_order: number;
  data: { videoUrl?: string } & Record<string, unknown>;
  is_active: boolean;
};

type Message = { type: "ok" | "err"; text: string };

export default function ExperienceSectionEditor() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/section-items?sectionKey=experience_cards");
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setCards(Array.isArray(json) ? json : []);
    } catch {
      setMessage({ type: "err", text: "Failed to load videos" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage(null);

    try {
      // Upload sequentially to keep things simple.
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const form = new FormData();
        form.set("file", file);
        form.set("key", `experience/card-${Date.now()}-${file.name}`);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.url) {
          throw new Error(uploadJson.error || "Upload failed");
        }

        const createRes = await fetch("/api/admin/section-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section_key: "experience_cards",
            data: { videoUrl: uploadJson.url },
            sort_order: cards.length + i,
          }),
        });
        if (!createRes.ok) {
          throw new Error("Failed to save video card");
        }
      }

      setMessage({ type: "ok", text: "Upload complete" });
      await load();
    } catch {
      setMessage({ type: "err", text: "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function deleteCard(id: number) {
    if (!confirm("Delete this video?")) return;
    try {
      const res = await fetch(`/api/admin/section-items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMessage({ type: "ok", text: "Deleted" });
      await load();
    } catch {
      setMessage({ type: "err", text: "Delete failed" });
    }
  }

  if (loading) {
    return <p className="text-zinc-400">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Experience section</h1>
      <p className="text-zinc-400 mb-6">
        Upload experience videos. We&apos;ll show them as simple cards.
      </p>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.type === "ok" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="mb-8 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 p-4">
        <p className="mb-2 text-sm text-zinc-300">Upload videos</p>
        <p className="mb-4 text-xs text-zinc-500">
          Choose one or more video files. They will appear below as small previews.
        </p>
        <input
          type="file"
          accept="video/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            void handleUpload(e.target.files);
            e.target.value = "";
          }}
          className="block w-full text-sm text-zinc-400 file:mr-2 file:rounded file:border-0 file:bg-[#ff003c] file:px-3 file:py-1.5 file:text-white disabled:opacity-60"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const videoUrl = String((card.data as { videoUrl?: string }).videoUrl ?? "");
          return (
            <div
              key={card.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 flex flex-col gap-2"
            >
              {videoUrl ? (
                <video
                  src={videoUrl}
                  className="w-full rounded-lg aspect-[4/5] object-cover bg-black"
                  controls
                />
              ) : (
                <div className="w-full rounded-lg aspect-[4/5] bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                  No video URL
                </div>
              )}
              <button
                type="button"
                onClick={() => deleteCard(card.id)}
                className="self-end rounded px-3 py-1 text-xs font-medium text-red-400 hover:bg-zinc-800"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {cards.length === 0 && (
        <p className="mt-2 text-sm text-zinc-500">
          No videos yet. Upload some above to get started.
        </p>
      )}
    </div>
  );
}
