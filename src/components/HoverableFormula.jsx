import React from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { SearchIcon } from "./Icons";
const HoverableFormula = ({ children, onExplainClick }) => {
  return (
    <span className="relative group inline-block">
      {/* THAY ĐỔI: Thêm font-mono để công thức trông giống code/toán học hơn */}
      <span className="font-mono font-semibold text-teal-300 underline decoration-dotted decoration-teal-300/50 cursor-pointer px-1">
        {children}
      </span>
      <button
        onClick={onExplainClick}
        className="absolute cursor-pointer bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg border border-white/10"
      >
        <SearchIcon /> Explain
      </button>
    </span>
  );
};
export default HoverableFormula;
