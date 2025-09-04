// src/utils/autoFormatAnswer.js
export function autoFormatAnswer(raw) {
  // 1) Ép kiểu an toàn
  const s = typeof raw === "string" ? raw : raw == null ? "" : String(raw);

  if (!s) return "";

  // 2) Thay \( \) / \[ \] → $ / $$
  // (không đụng tới underscore trong môi trường toán ở bản rút gọn này)
  return (
    s
      .replace(/\\\(/g, "$") // \( ... \) → $...$
      .replace(/\\\)/g, "$")
      .replace(/\\\[/g, "$$") // \[ ... \] → $$...$$
      .replace(/\\\]/g, "$$")
      // 3) Escape underscore ngoài toán (đơn giản: escape tất cả, đủ dùng cho nhiều trường hợp)
      .replace(/_/g, "_")
  );
}
