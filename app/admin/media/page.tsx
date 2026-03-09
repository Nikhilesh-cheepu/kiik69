"use client";

import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

type MediaRow = {
  id: number;
  blob_url: string;
  filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  key: string | null;
  created_at: string;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const json = await res.json();
        setItems(json);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      let toUpload: File | Blob = file;
      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 2.8,
          maxWidthOrHeight: 2400,
          useWebWorker: true,
        };
        toUpload = await imageCompression(file, options);
        if (toUpload.size > 3 * 1024 * 1024) {
          throw new Error("Compressed image is still larger than 3MB.");
        }
      }
      const form = new FormData();
      form.set("file", toUpload);
      form.set("saveToMedia", "true");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      await load();
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this media item? This will also remove the blob.")) return;
    await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Media library</h1>
          <p className="text-sm text-zinc-400">
            Upload and manage images & videos used across the site.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-100 hover:border-cyan-400/70 hover:bg-zinc-900">
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <span>{uploading ? "Uploading…" : "Upload media"}</span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error} (images are compressed to ≤ 3MB automatically)
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isImage = item.mime_type?.startsWith("image/");
          const isVideo = item.mime_type?.startsWith("video/");
          return (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-950/60">
                {isImage && (
                  <img
                    src={item.blob_url}
                    alt={item.filename ?? ""}
                    className="h-full w-full object-cover"
                  />
                )}
                {isVideo && (
                  <video
                    src={item.blob_url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                )}
                {!isImage && !isVideo && (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                    {item.filename ?? "File"}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-3 text-xs text-zinc-300">
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {item.filename ?? "Untitled"}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    {item.mime_type ?? "unknown"} ·{" "}
                    {item.file_size
                      ? `${(item.file_size / 1024 / 1024).toFixed(2)} MB`
                      : "size unknown"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full bg-zinc-900 px-2 py-1 text-[11px] text-red-400 hover:bg-zinc-800"
                >
                  Delete
                </button>
              </div>
              <div className="mt-2 rounded-lg bg-zinc-950/70 p-2 text-[11px] text-zinc-500 break-all">
                {item.blob_url}
              </div>
            </div>
          );
        })}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-500">
            No media yet. Upload images or videos to start building your library.
          </p>
        )}
      </div>
    </div>
  );
}

