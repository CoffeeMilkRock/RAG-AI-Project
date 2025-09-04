import React, { useState, useEffect, use } from "react";
import { getAnswer } from "./services/mockApi";
import { autoFormatAnswer } from "./utils/autoFormatAnswer";
import { AnswerRenderer } from "./components/AnswerRenderer";
import { RenderPaper } from "./components/RenderPaper";
import "./App.css";
import {
  UploadIcon,
  XIcon,
  LightbulbIcon,
  BrainCircuitIcon,
  SearchIcon,
} from "./components/Icons";
import HoverableFormula from "./components/HoverableFormula";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
function App() {
  const [fileName, setFileName] = useState(null);
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState("Novice");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  // Modal States
  const [showContextModal, setShowContextModal] = useState(false);
  const [contextContent, setContextContent] = useState("");
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  const [reasoningContent, setReasoningContent] = useState("");
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [formulaExplanation, setFormulaExplanation] = useState("");

  const [showExplainModal, setShowExplainModal] = useState(false);
  const [explainContent, setExplainContent] = useState("");
  const modeDescriptions = {
    Novice: "Simplified explanations uploaded paper for beginners",
    Researcher: "In-depth analysis for researchers",
    Reviewer: "Critical evaluation for peer reviewers",
    "Related Paper": "Find papers related to the uploaded document",
  };
  useEffect(() => {}, [answer]);

  // --- EVENT HANDLERS ---
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };
  const handleContextClick = () => {
    if (answer && answer.citations && answer.citations.length > 0) {
      setContextContent(
        autoFormatAnswer(answer.citations[0].content.text) || "No context."
      );
      setShowContextModal(true);
    }
  };
  const handleReasoningClick = () => {
    if (answer && answer.citations && answer.citations.length > 0) {
      setReasoningContent(
        autoFormatAnswer(answer.citations[0].reason) || "No reasoning."
      );
      setShowReasoningModal(true);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileName) {
      // Using a custom modal or inline message is better than alert() in a real app
      if ((mode === "Reviewer" || mode === "Reseacher") && !question) {
        console.log("Please enter a question for this mode.");
        return;
      }
      console.log("Please upload a PDF file to proceed.");
      return;
    }
    setIsLoading(true);
    setAnswer(null);
    // Simulate API call
    setTimeout(() => {
      getAnswer(mode).then(setAnswer);
      setIsLoading(false);
    }, 2500);
  };
  const handleModeChange = (m) => {
    if (isLoading) return; // Prevent changing mode while loading
    setMode(m);
    setAnswer(null);
  };

  const handleExplainClick = (tex) => {
    const mockExplanation = `Explanation for the formula "${tex}":\n\nThis formula represents a dynamic learning rate schedule commonly used in training transformer models. It adjusts the learning rate based on the model dimension and training steps, incorporating a warmup phase followed by decay.\n\n- **Warmup Phase**: Increases linearly to prevent early instability.\n- **Decay Phase**: Decreases inversely with the square root of steps for better convergence.`;

    setFormulaExplanation(mockExplanation);
    setShowFormulaModal(true);
  };

  const renderParagraphWithFormulas = (answer, mode) => {
    if (mode === "Related Paper") {
      console.log("Rendering related paper:", answer);
      return <RenderPaper paperJson={answer} />;
    }
    let content = autoFormatAnswer(answer.answer);
    return <AnswerRenderer content={content} />;
  };
  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto p-4 md:p-8">
        <header className="mb-8 md:mb-12 text-center">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl backdrop-blur-sm border border-blue-500/20">
                <BrainCircuitIcon className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                AI Research Assistant
              </h1>
            </div>
            <p className="text-gray-100 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Upload a research paper, ask intelligent questions, and receive
              <span className="text-blue-400 font-semibold">
                {" "}
                AI-powered insights{" "}
              </span>
              with precise citations
            </p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className=" text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Upload Research Paper</span>
                </label>
                <label
                  htmlFor="pdf-upload"
                  className={`group/upload relative w-full flex items-center justify-center px-6 py-6 bg-gray-700/50 backdrop-blur-sm text-gray-100 rounded-2xl cursor-pointer border-2 border-dashed transition-all duration-300 hover:scale-[1.02] ${
                    fileName
                      ? "border-blue-400/50 bg-blue-900/20"
                      : "border-gray-500/50 hover:border-blue-400/50 hover:bg-blue-900/10"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex p-2 bg-blue-400/20 rounded-xl group-hover/upload:bg-blue-400/30 transition-colors">
                      <div className="w-6 h-6 mr-0">
                        <UploadIcon />
                      </div>
                    </div>
                    <span className="font-semibold text-white">
                      {fileName || "Choose PDF file"}
                    </span>
                  </div>
                  {fileName && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full"></div>
                  )}
                </label>
                <input
                  id="pdf-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-4">
                <label className=" text-xl font-bold text-white flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Analysis Mode</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Novice", "Researcher", "Reviewer", "Related Paper"].map(
                    (m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleModeChange(m)}
                        className={`relative overflow-hidden cursor-pointer py-4 px-4 rounded-xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transform hover:scale-105 ${
                          mode === m
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            : "bg-gray-700/50 text-gray-100 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50"
                        } ${
                          isLoading && mode !== m
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isLoading && mode !== m}
                      >
                        <span className="relative z-10">{m}</span>
                      </button>
                    )
                  )}
                  {mode ? (
                    <div className="col-span-2 text-gray-300 text-sm italic px-1">
                      {modeDescriptions[mode]}
                    </div>
                  ) : null}
                </div>
              </div>

              {(mode === "Reviewer" || mode === "Researcher") && (
                <div className="space-y-3">
                  <label
                    htmlFor="question"
                    className="text-xl font-bold text-white flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Your Question</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="question"
                      rows="4"
                      className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-2xl border border-gray-600/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:outline-none transition-all duration-300 text-white placeholder-gray-300 resize-none hover:bg-gray-600/50"
                      placeholder="e.g., 'What is the core mechanism of the transformer architecture and how does it improve upon previous attention mechanisms?'"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {question.length}/500
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="relative w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-blue-500/25"
                disabled={
                  isLoading ||
                  !fileName ||
                  ((mode === "Reviewer" || mode === "Researcher") && !question)
                }
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <div className="flex items-center space-x-5">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mr-2"></div>
                      <span>Analyzing Research...</span>
                    </div>
                  ) : (
                    <>
                      <SearchIcon className="w-5 h-5" />
                      <span>Generate AI Insights</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 flex flex-col min-h-[500px]">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-600/50">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">
                AI Analysis Results
              </h2>
            </div>

            <div className="flex-grow flex  justify-center">
              {isLoading && (
                <div className="flex items-center  text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 mr-5 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-400 font-semibold">
                      Processing research paper...
                    </p>
                    <p className="text-gray-300 text-sm">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && !answer && (
                <div className="flex items-center text-center space-y-4 opacity-60">
                  <div className="space-y-2">
                    <p className="text-gray-100 font-medium">
                      Ready for analysis
                    </p>
                    <p className="text-gray-300 text-sm">
                      Upload a paper and ask a question to begin
                    </p>
                  </div>
                </div>
              )}

              {answer && (
                <div className="w-full space-y-6">
                  <div className=" overflow-y-auto max-h-[500px] custom-scrollbar text-gray-100 leading-relaxed">
                    {renderParagraphWithFormulas(answer, mode)}
                  </div>
                  {answer && (mode === "Researcher" || mode === "Reviewer") ? (
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-600/50">
                      <div className="flex space-x-3">
                        <button
                          onClick={handleContextClick}
                          className="px-4 py-2 text-sm bg-gray-700/50 backdrop-blur-sm rounded-xl hover:bg-gray-600/50 transition-all duration-300 text-gray-100 border border-gray-600/50 hover:border-gray-500/50 transform hover:scale-105"
                        >
                          View Context
                        </button>
                        <button
                          onClick={handleReasoningClick}
                          className="px-4 py-2 text-sm bg-gray-700/50 backdrop-blur-sm rounded-xl hover:bg-gray-600/50 transition-all duration-300 text-gray-100 border border-gray-600/50 hover:border-gray-500/50 transform hover:scale-105"
                        >
                          Show Reasoning
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="mt-8 bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="p-2 bg-blue-400/20 rounded-xl">
                  <LightbulbIcon className="w-6 h-6 text-blue-400" />
                </div>
                <span>Formula Intelligence</span>
              </h3>
              <p className="text-gray-100 leading-relaxed max-w-md">
                Select mathematical formulas in your document to receive
                detailed explanations and contextual insights
              </p>
            </div>
            <button
              onClick={handleExplainClick}
              className="relative overflow-hidden py-3 px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-blue-500/25"
              disabled={!fileName}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Analyze Formulas</span>
                <div className="w-2 h-2 bg-white/80 rounded-full"></div>
              </span>
            </button>
          </div>
        </div>
      </div>

      {showContextModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-4xl border border-gray-600/50 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Source Context</span>
              </h3>
              <button
                onClick={() => setShowContextModal(false)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl max-h-[60vh] overflow-y-auto text-gray-100 border border-gray-600/30">
              <AnswerRenderer content={contextContent} />
            </div>
          </div>
        </div>
      )}

      {showReasoningModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-4xl border border-gray-600/50 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>AI Reasoning Process</span>
              </h3>
              <button
                onClick={() => setShowReasoningModal(false)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl max-h-[60vh] overflow-y-auto text-gray-100 border border-gray-600/30">
              <AnswerRenderer content={reasoningContent} />
            </div>
          </div>
        </div>
      )}

      {showFormulaModal && formulaExplanation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-5xl border border-gray-600/50 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Formula Intelligence</span>
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-700/30 backdrop-blur-sm p-8 rounded-2xl mb-6 text-center border border-gray-600/30">
              <BlockMath math="Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" />
            </div>

            <div className="space-y-6 text-gray-100">
              <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/30">
                <h4 className="font-bold text-blue-400 text-lg mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Description</span>
                </h4>
                <p className="leading-relaxed">
                  {formulaExplanation.description}
                </p>
              </div>
              <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/30">
                <h4 className="font-bold text-blue-400 text-lg mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Role in Pipeline</span>
                </h4>
                <p className="leading-relaxed">{formulaExplanation.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExplainModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-4xl border border-gray-600/50 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Formula Explanation</span>
              </h3>
              <button
                onClick={() => setShowExplainModal(false)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl max-h-[60vh] overflow-y-auto text-gray-100 border border-gray-600/30">
              <p className="whitespace-pre-wrap leading-relaxed">
                {explainContent}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
