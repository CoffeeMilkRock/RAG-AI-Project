// Updated src/components/HoverableFormula.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";

const HoverableFormula = ({ tex, inline, onExplain }) => {
  const MathComponent = inline ? InlineMath : BlockMath;
  const Wrapper = inline ? "span" : "div";
  const wrapperClass =
    "relative group " + (inline ? "inline-block" : "block mx-auto my-4");
  console.log("Rendering formula:", tex);
  return (
    <Wrapper className={wrapperClass}>
      <MathComponent math={tex} throwOnError={false} />
      <button
        onClick={() => onExplain(tex)}
        className="absolute top-0 right-0 hidden group-hover:block bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg hover:bg-blue-600 transition-all duration-200"
        style={{ transform: "translate(100%, -50%)" }} // Positions button to the right, vertically centered
      >
        Explain
      </button>
    </Wrapper>
  );
};

export default HoverableFormula;
