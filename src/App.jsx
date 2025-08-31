import React, { useState } from "react";
import "./App.css";
import { UploadIcon, XIcon, LightbulbIcon } from "./components/Icons";

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

  // --- MOCK DATA ---
  const mockResponses = {
    Novice: {
      type: "paragraph",
      content:
        "The transformer architecture relies on a mechanism called 'self-attention'. Think of it like this: when reading a sentence, you pay more attention to certain words to understand the context. Self-attention allows the model to weigh the importance of different words in the input when processing a specific word, which helps it understand complex relationships and long-range dependencies in the text.",
      citation: "Page 4, Section 2.1",
      context:
        "From Section 2.1: ...An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key...",
      reasoning:
        "The question asked for a simple explanation of the core concept. The 'Novice' mode was selected, so I retrieved the introductory paragraph from the relevant section (2.1) and rephrased it using an analogy to make it more accessible. The core information is extracted and simplified, avoiding technical jargon.",
    },
    Researcher: {
      type: "table",
      content: [
        ["Component", "Description", "Key Innovation"],
        [
          "Multi-Head Attention",
          "Runs the attention mechanism in parallel multiple times.",
          "Allows the model to jointly attend to information from different representation subspaces at different positions.",
        ],
        [
          "Positional Encoding",
          "Injects information about the relative or absolute position of tokens.",
          "Since the model contains no recurrence, this is crucial for making use of the order of the sequence.",
        ],
        [
          "Feed-Forward Networks",
          "Applied to each position separately and identically.",
          "Consists of two linear transformations with a ReLU activation in between.",
        ],
      ],
      citation: "Page 5-7, Section 3",
      context:
        "From Section 3: ...we employ a residual connection around each of the two sub-layers, followed by layer normalization. That is, the output of each sub-layer is LayerNorm(x + Sublayer(x)), where Sublayer(x) is the function implemented by the sub-layer itself...",
      reasoning:
        "The user is in 'Researcher' mode and asked for key components. A table is the most effective format for a structured, comparative overview. I scanned the paper for section headings and keywords related to architecture components, extracted the primary function of each, and synthesized the information into a concise table format.",
    },
    Reviewer: {
      type: "figure",
      content:
        "https://placehold.co/600x400/1f2937/ffffff?text=Mock+Architecture+Diagram",
      caption: "Figure 1: The Transformer - model architecture.",
      citation: "Page 3, Figure 1",
      context:
        "From Page 3, Figure 1 Caption: The Transformer - model architecture. The left part shows the encoder, and the right part shows the decoder architecture of the Transformer.",
      reasoning:
        "The question asked for a visual overview, and the 'Reviewer' mode implies a need for high-level structural understanding. The most relevant piece of information is the main architecture diagram (Figure 1). I identified this as the key visual element, extracted it, and presented it with its original caption and page number for direct verification.",
    },
  };

  const mockFormulaExplanation = {
    description:
      "This is the scaled dot-product attention formula, which is the core of the multi-head attention mechanism in the Transformer model.",
    variables: [
      {
        name: "Q",
        meaning:
          "Queries matrix, representing the current word/position being processed.",
      },
      {
        name: "K",
        meaning:
          "Keys matrix, representing all other words/positions in the sequence to be scored against.",
      },
      {
        name: "V",
        meaning:
          "Values matrix, containing the actual representations of the words in the sequence.",
      },
      {
        name: "d_k",
        meaning:
          "The dimension of the keys and queries. The scaling factor prevents the dot products from growing too large.",
      },
    ],
    role: "Its role is to calculate the 'attention scores' for each word in the input sequence relative to every other word. By scaling the dot products of queries and keys, and then applying a softmax function, it produces a set of weights. These weights are then used to create a weighted sum of the values (V), effectively allowing the model to focus on the most relevant parts of the input for a given task.",
  };

  // --- EVENT HANDLERS ---
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileName || !question) {
      // Using a custom modal or inline message is better than alert() in a real app
      console.error("Please upload a PDF and enter a question.");
      return;
    }
    setIsLoading(true);
    setAnswer(null);

    // Simulate API call
    setTimeout(() => {
      const response = mockResponses[mode];
      setAnswer(response);
      setContextContent(response.context);
      setReasoningContent(response.reasoning);
      setIsLoading(false);
    }, 2500);
  };

  const handleFormulaInsight = () => {
    // In a real app, this would trigger a UI for cropping a part of the PDF.
    // Here, we'll just simulate the result.
    setFormulaExplanation(mockFormulaExplanation);
    setShowFormulaModal(true);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Responsive container: p-4 for mobile, md:p-8 for larger screens */}
      <div className="container mx-auto p-4 md:p-8">
        {/* Header with responsive margins and font sizes */}
        <header className="text-left mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">
            AI Research Assistant
          </h1>
          <p className="text-gray-400 mt-2">
            Upload a paper, ask a question, and get cited answers.
          </p>
        </header>

        {/* Responsive Grid: Stacks to 1 column on mobile, becomes 2 columns on large screens (lg) */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <form onSubmit={handleSubmit}>
              {/* 1. Upload PDF */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2 text-gray-300">
                  1. Upload Paper
                </label>
                <label
                  htmlFor="pdf-upload"
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                >
                  <UploadIcon />
                  <span>{fileName || "Select a PDF file"}</span>
                </label>
                <input
                  id="pdf-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              {/* 2. Ask Question */}
              <div className="mb-6">
                <label
                  htmlFor="question"
                  className="block text-lg font-semibold mb-2 text-gray-300"
                >
                  2. Ask a Question
                </label>
                <textarea
                  id="question"
                  rows="4"
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                  placeholder="e.g., 'What is the core mechanism of the transformer architecture?'"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                ></textarea>
              </div>

              {/* 3. Choose Mode */}
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-3 text-gray-300">
                  3. Choose Mode
                </label>
                {/* Using flex and flex-1 makes the buttons distribute space evenly and adapt to screen width */}
                <div className="flex flex-wrap gap-2">
                  {["Novice", "Researcher", "Reviewer"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white
                                                ${
                                                  mode === m
                                                    ? "bg-cyan-500 text-white shadow-md"
                                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                disabled={isLoading || !fileName || !question}
              >
                {isLoading ? "Analyzing..." : "Get Answer"}
              </button>
            </form>
          </div>

          {/* Right Column: Output */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4 text-gray-200 border-b border-gray-700 pb-2">
              Answer
            </h2>
            <div className="flex-grow flex items-center justify-center">
              {isLoading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="mt-4 text-gray-400">Generating response...</p>
                </div>
              )}
              {!isLoading && !answer && (
                <div className="text-center text-gray-500">
                  <p>Your answer will appear here.</p>
                </div>
              )}
              {answer && (
                <div className="w-full animate-fade-in">
                  {/* Answer Content */}
                  {answer.type === "paragraph" && (
                    <p className="text-gray-300 leading-relaxed">
                      {answer.content}
                    </p>
                  )}
                  {answer.type === "figure" && (
                    <div className="text-center">
                      <img
                        src={answer.content}
                        alt={answer.caption}
                        className="rounded-lg mx-auto mb-2 max-w-full h-auto shadow-md"
                      />
                      <p className="text-sm text-gray-400 italic">
                        {answer.caption}
                      </p>
                    </div>
                  )}
                  {answer.type === "table" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            {answer.content[0].map((header, i) => (
                              <th
                                key={i}
                                className="p-3 bg-gray-700 border-b-2 border-gray-600 font-semibold"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {answer.content.slice(1).map((row, i) => (
                            <tr
                              key={i}
                              className="bg-gray-800 hover:bg-gray-700/50 transition-colors"
                            >
                              {row.map((cell, j) => (
                                <td
                                  key={j}
                                  className="p-3 border-b border-gray-700 text-gray-300"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Responsive Action Buttons: flex-wrap allows buttons to stack on small screens */}
                  <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-cyan-400 bg-cyan-900/50 px-3 py-1 rounded-full">
                      {answer.citation}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowContextModal(true)}
                        className="px-3 py-1.5 text-sm bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Show context
                      </button>
                      <button
                        onClick={() => setShowReasoningModal(true)}
                        className="px-3 py-1.5 text-sm bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Why this?
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Formula Insight Section: Stacks vertically on mobile (flex-col), row on medium screens (md:flex-row) */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-200 flex items-center">
                <LightbulbIcon /> Formula Insight
              </h3>
              <p className="text-gray-400 mt-1">
                Select a formula in the document to get a detailed explanation.
              </p>
            </div>
            <button
              onClick={handleFormulaInsight}
              className="mt-4 md:mt-0 py-2 px-5 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
              disabled={!fileName}
            >
              Analyze Formula
            </button>
          </div>
        </div>
      </div>

      {/* Modals are responsive by default due to w-full and max-w-* classes */}
      {/* Context Modal */}
      {showContextModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-700 transform animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-200">
                Source Context
              </h3>
              <button
                onClick={() => setShowContextModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon />
              </button>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg max-h-[60vh] overflow-y-auto">
              <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                "{contextContent}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reasoning Modal */}
      {showReasoningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-700 transform animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-200">
                Retrieval & Reasoning
              </h3>
              <button
                onClick={() => setShowReasoningModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon />
              </button>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg max-h-[60vh] overflow-y-auto">
              <p className="text-gray-300 whitespace-pre-wrap">
                {reasoningContent}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formula Insight Modal */}
      {showFormulaModal && formulaExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-3xl border border-gray-700 transform animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-200">
                Formula Insight
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon />
              </button>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg mb-4 text-center">
              <img
                src="https://placehold.co/400x100/111827/ffffff?text=Attention(Q,K,V)=softmax(QKᵀ/√dₖ)V"
                alt="Formula"
                className="mx-auto rounded"
              />
            </div>

            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="font-semibold text-cyan-400">Description</h4>
                <p>{formulaExplanation.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400">
                  Role in Pipeline
                </h4>
                <p>{formulaExplanation.role}</p>
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">Variables</h4>
                <ul className="space-y-2">
                  {formulaExplanation.variables.map((v) => (
                    <li key={v.name} className="p-3 bg-gray-700/50 rounded-md">
                      <strong className="font-mono text-teal-400">
                        {v.name}:
                      </strong>{" "}
                      {v.meaning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
