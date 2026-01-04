import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";
import { generateStudyPlan } from "@/utils/planGenerator";

export default function Planner() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Exam details
  const [exam, setExam] = useState({
    examName: "",
    examDate: "",
    dailyHours: "",
  });

  // Topic handling
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState([]);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return null;

  /* ---------------- TOPIC LOGIC ---------------- */
  function addTopic() {
    if (!topicInput.trim()) return;

    setTopics([
      ...topics,
      {
        name: topicInput.trim(), // IMPORTANT: name (not title)
        confidence: "medium",
      },
    ]);

    setTopicInput("");
  }

  function updateConfidence(index, level) {
    const updated = [...topics];
    updated[index].confidence = level;
    setTopics(updated);
  }

  function removeTopic(index) {
    setTopics(topics.filter((_, i) => i !== index));
  }

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!exam.examName || !exam.examDate || !exam.dailyHours) {
      alert("Please fill all exam details");
      return;
    }

    if (topics.length === 0) {
      alert("Please add at least one topic");
      return;
    }

    try {
      // ✅ GENERATE PLAN USING ENGINE
      const generatedPlan = generateStudyPlan({
        examDate: exam.examDate,
        dailyStudyHours: Number(exam.dailyHours),
        topics,
      });

      // ✅ GENERATE UNIQUE PLAN ID
      const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // ✅ CALCULATE INITIAL PROGRESS
      const totalTasks = generatedPlan.reduce((sum, day) => sum + day.tasks.length, 0);

      // ✅ SAVE TO NEW FIRESTORE STRUCTURE
      const planRef = doc(db, "users", user.uid, "plans", planId);

      await setDoc(planRef, {
        planId,
        subjectName: exam.examName,
        examDate: exam.examDate,
        dailyHours: Number(exam.dailyHours),
        topics,
        plan: generatedPlan,
        progress: 0,
        totalTasks,
        completedTasks: 0,
        status: "active",
        createdAt: serverTimestamp(),
      });

      // ✅ REDIRECT TO SPECIFIC PLAN PAGE
      router.push(`/plan/${planId}`);
    } catch (err) {
      console.error("Planner save error:", err);
      alert("Failed to generate study plan. Please try again.");
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-10">
        <div>
          <h1 className="text-3xl font-semibold">Create Your Study Plan</h1>
          <p className="text-gray-400 mt-1">
            Tell us about your exam and topics. Nexora will handle the planning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ---------------- EXAM DETAILS ---------------- */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-medium">Exam Details</h2>

            <input
              placeholder="Subject / Exam Name"
              value={exam.examName}
              onChange={(e) =>
                setExam({ ...exam, examName: e.target.value })
              }
              className="input"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={exam.examDate}
                onChange={(e) =>
                  setExam({ ...exam, examDate: e.target.value })
                }
                className="input"
                required
              />

              <input
                type="number"
                min="1"
                placeholder="Daily Study Hours"
                value={exam.dailyHours}
                onChange={(e) =>
                  setExam({ ...exam, dailyHours: e.target.value })
                }
                className="input"
                required
              />
            </div>
          </div>

          {/* ---------------- TOPICS ---------------- */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-medium">Topics to Study</h2>

            <div className="flex gap-3">
              <input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter a topic..."
                className="input flex-1"
              />
              <button
                type="button"
                onClick={addTopic}
                className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition font-medium"
              >
                + Add
              </button>
            </div>

            {topics.length === 0 && (
              <p className="text-gray-400 text-sm">No topics added yet.</p>
            )}

            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-black/40 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{topic.name}</p>
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="text-red-400 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex gap-3 mt-4">
                    {["easy", "medium", "hard"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          updateConfidence(index, level)
                        }
                        className={`px-4 py-1 rounded-full text-sm capitalize transition
                          ${
                            topic.confidence === level
                              ? "bg-indigo-500 text-white"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }
                        `}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition font-semibold text-lg"
          >
            Generate My Study Plan →
          </button>
        </form>
      </main>
    </div>
  );
}
