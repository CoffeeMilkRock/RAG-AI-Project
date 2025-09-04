// utils/renderPaper.js
import React from "react";

/** ---- Helpers ---- */
const toArray = (x) => (Array.isArray(x) ? x : x ? [x] : []);
const fmtAuthors = (arr) => toArray(arr).join(", ");
const fmtPct = (x) =>
  typeof x === "number" && isFinite(x) ? `${Math.round(x * 100)}%` : "—";
const doiUrl = (doi) =>
  typeof doi === "string" && doi.trim()
    ? `https://doi.org/${doi.trim()}`
    : null;

const Badge = ({ children }) => (
  <span className="inline-block  px-2 py-0.5 rounded-full border border-black/10 dark:border-white/15 text-xs leading-4 mr-1.5 mb-1.5 bg-black/5 dark:bg-white/10">
    {children}
  </span>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-[16px] font-semibold my-3">{children}</h3>
);

const Card = ({ children }) => (
  <div className="border border-black/10 dark:border-white/15 rounded-xl p-4 mb-4 mr-4 text-white bg-white/10 dark:bg-white/5 shadow-sm">
    {children}
  </div>
);

/** ---- Main render function ---- */
export function RenderPaper(paperJson) {
  const data = paperJson.paperJson;
  console.log("RenderPaper received data:", data);
  const title = data.original_paper_title;
  const paperId = data.paper_id;
  console.log("Rendering paper with ID:", paperId);
  const meta = data.suggestion_metadata || {};
  console.log("Paper metadata:", data.related_papers);
  const related = Array.isArray(data.related_papers)
    ? [...data.related_papers]
    : [];
  console.log("Related papers data:", related);

  // sắp xếp theo similarity giảm dần
  related.sort(
    (a, b) => (b?.similarity_score ?? 0) - (a?.similarity_score ?? 0)
  );

  return (
    <section className="max-w-[960px] mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold mb-1">Suggested Related Papers</h2>
        <div className="text-[14px]">
          From: <Badge>{title}</Badge>
          <Badge>paper_id: {paperId}</Badge>
        </div>
      </div>

      {/* Related papers list */}
      {related.map((p, idx) => {
        const year = p?.publication_year ?? "—";
        const url = doiUrl(p?.doi);
        const authors = fmtAuthors(p?.authors);
        const sim = fmtPct(p?.similarity_score);
        const diffs = toArray(p?.key_differences);
        const shared = toArray(p?.shared_concepts);

        return (
          <Card key={`${p?.title || "paper"}-${idx}`}>
            {/* Title + DOI + meta badges */}
            <div>
              <h3 className="text-[18px] font-semibold m-0">
                {p?.title || "Untitled"}
              </h3>
              <div className="flex items-center justify-start mt-2 gap-1.5 flex-wrap">
                <Badge>year: {year}</Badge>
                <Badge>similarity: {sim}</Badge>
                {url ? (
                  <span className="text-sm">
                    URL:{" "}
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline text-sm text-blue-400 hover:underline"
                      title={p?.doi}
                    >
                      {url}
                    </a>
                  </span>
                ) : (
                  <Badge>no DOI</Badge>
                )}
              </div>
            </div>

            {/* Authors */}
            {authors && (
              <>
                <SectionTitle>Authors</SectionTitle>
                <p className="m-0 mb-2 leading-relaxed">{authors}</p>
              </>
            )}

            {/* Abstract */}
            {p?.abstract && (
              <>
                <SectionTitle>Abstract</SectionTitle>
                <p className="m-0 mb-2 leading-relaxed">{p.abstract}</p>
              </>
            )}

            {/* Shared concepts */}
            {shared.length > 0 && (
              <>
                <SectionTitle>Shared Concepts</SectionTitle>
                <ul className="m-0 pl-5 list-disc">
                  {shared.map((s, i) => (
                    <li key={i} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Key differences */}
            {diffs.length > 0 && (
              <>
                <SectionTitle>Key Differences</SectionTitle>
                <ul className="m-0 pl-5 list-disc">
                  {diffs.map((d, i) => (
                    <li key={i} className="leading-relaxed">
                      {d}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        );
      })}

      {/* Empty state */}
      {related.length === 0 && (
        <Card>
          <p className="m-0">No related papers found.</p>
        </Card>
      )}
    </section>
  );
}
