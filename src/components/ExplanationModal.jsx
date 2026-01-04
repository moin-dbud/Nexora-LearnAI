import { X } from "lucide-react";
import { useEffect } from "react";

export default function ExplanationModal({ 
  isOpen, 
  onClose, 
  topic, 
  explanation, 
  loading, 
  error 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{topic}</h2>
            <p className="text-sm text-gray-400 mt-1">AI Explanation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">Generating explanation...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="text-sm text-yellow-300 mb-2">⚠️ Explanation Unavailable</p>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          )}

          {explanation && !loading && !error && (
            <div className="prose prose-invert max-w-none">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {explanation}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
