export async function getAnswer(mode) {
  const ALLOWED = ["Reviewer", "Researcher", "Novice", "Related Paper"];
  if (!ALLOWED.includes(mode)) return [];

  const FILE_MAP = {
    Reviewer: "answers1.txt",
    "Related Paper": "answers2.txt",
    Novice: "",
    Researcher: "",
  };

  const base =
    (import.meta && import.meta.env && import.meta.env.BASE_URL) || "/";
  const url = new URL(
    `${base}${FILE_MAP[mode]}`,
    window.location.origin
  ).toString();

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) return [];

    const ct = res.headers.get("content-type") || "";
    const text = await res.text();

    if (
      ct.includes("text/html") ||
      text.trim().toLowerCase().startsWith("<!doctype")
    ) {
      console.error(`Got HTML instead of JSON/text. URL: ${url}`);
      return [];
    }

    try {
      return JSON.parse(text);
    } catch {
      // Trả raw text trong mảng để UI vẫn hiển thị được
      return [{ raw: text }];
    }
  } catch (e) {
    console.error("Request error:", e);
    return [];
  }
}
