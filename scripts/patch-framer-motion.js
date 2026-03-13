// Small patch to fix missing internal module in framer-motion 12.x
// Next.js 16 imports calcChildStagger from
// node_modules/framer-motion/dist/es/animation/utils/calc-child-stagger.mjs
// but some published builds don't include this file.
//
// This script creates a lightweight fallback implementation so builds
// don't fail. It runs on postinstall locally and on Vercel.

const fs = require("fs");
const path = require("path");

const targetPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "framer-motion",
  "dist",
  "es",
  "animation",
  "utils",
  "calc-child-stagger.mjs",
);

try {
  if (fs.existsSync(targetPath)) {
    // File already exists (fixed upstream or previously patched)
    return;
  }

  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = `// Auto-generated fallback by scripts/patch-framer-motion.js
// Minimal implementation of calcChildStagger used by animation-state.mjs.
// It applies a simple staggerChildren delay across children.

export function calcChildStagger(transition, children, defaultDelay = 0) {
  if (!children || !children.length) return [];

  const stagger =
    (transition && (transition.staggerChildren || transition.stagger)) || 0;
  const direction =
    transition && transition.staggerDirection === -1 ? -1 : 1;

  return children.map((_, index) => {
    const i = direction === 1 ? index : children.length - 1 - index;
    return defaultDelay + i * stagger;
  });
}

export default calcChildStagger;
`;

  fs.writeFileSync(targetPath, content, "utf8");
} catch {
  // If patching fails, don't crash install; builds may still fail,
  // but we don't want to block npm install.
}

