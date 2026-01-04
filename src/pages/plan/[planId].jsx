import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";
import { explainDayPlan } from "@/services/explainPlan";
import { explainTopic } from "@/services/explainTopic";
import ExplanationModal from "@/components/ExplanationModal";
import { Lightbulb, Calendar, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function PlanDetail() {
  const router = useRouter();
  const { planId } = router.query;

  const [explainLoaded, setExplainLoaded] = useState(false);
  const [explainFallback, setExplainFallback] = useState(false);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [explanation, setExplanation] = useState(null);

  // Topic explanation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicExplanation, setTopicExplanation] = useState(null);
  const [topicLoading, setTopicLoading] = useState(false);
  const [topicError, setTopicError] = useState(null);

  /* ---------------- AUTH + FETCH PLAN ---------------- */
  useEffect(() => {
    if (!planId) return;

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/");
        return;
      }

      setUser(currentUser);

      try {
        const snap = await getDoc(
          doc(db, "users", currentUser.uid, "plans", planId)
        );

        if (snap.exists()) {
          setPlanData(snap.data());
        } else {
          router.replace("/dashboard");
        }

        setLoading(false);
      } catch (err) {
        console.error("Plan fetch error:", err);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [planId]);

  /* ---------------- TOPIC EXPLANATION ---------------- */
  async function handleExplainTopic(task) {
    if (!user) return;

    setSelectedTopic(task.topic);
    setModalOpen(true);
    setTopicLoading(true);
    setTopicError(null);
    setTopicExplanation(null);

    try {
      const result = await explainTopic({
        userId: user.uid,
        topic: task.topic,
        difficulty: task.priority,
        type: task.type
      });

      if (result.error) {
        setTopicError(result.error);
      } else {
        setTopicExplanation(result.explanation);
      }
    } catch (err) {
      console.error("Topic explanation error:", err);
      setTopicError("Failed to load explanation. Please try again.");
    } finally {
      setTopicLoading(false);
    }
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedTopic(null);
    setTopicExplanation(null);
    setTopicError(null);
  }

  /* ---------------- TASK TOGGLE ---------------- */
  async function toggleTaskCompletion(dayIndex, taskIndex) {
    if (!planData || !user || !planId) return;

    const updatedPlan = structuredClone(planData.plan);
    const task = updatedPlan[dayIndex].tasks[taskIndex];

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    // Calculate new progress
    const totalTasks = updatedPlan.reduce((sum, day) => sum + day.tasks.length, 0);
    const completedTasks = updatedPlan.reduce(
      (sum, day) => sum + day.tasks.filter(t => t.completed).length,
      0
    );
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await updateDoc(
      doc(db, "users", user.uid, "plans", planId),
      { 
        plan: updatedPlan,
        progress,
        completedTasks,
        totalTasks
      }
    );

    setPlanData({ ...planData, plan: updatedPlan, progress, completedTasks, totalTasks });
  }

  /* ---------------- DELETE PLAN ---------------- */
  async function handleDeletePlan() {
    const confirmed = window.confirm(
      `Are you sure you want to delete the study plan for "${planData.subjectName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "plans", planId));
      router.push("/dashboard");
    } catch (err) {
      console.error("Delete plan error:", err);
      alert("Failed to delete plan. Please try again.");
    }
  }

  /* ---------------- AI EXPLANATION (TODAY) ---------------- */
  useEffect(() => {
    async function fetchExplanation() {
      try {
        const todayPlan = planData?.plan?.[0];
        if (!todayPlan) return;

        if (todayPlan.explanation) {
          setExplanation(todayPlan.explanation);
          setExplainLoaded(true);
          return;
        }

        const result = await explainDayPlan({
          user,
          dayPlan: todayPlan,
        });

        if (!result) {
          setExplainFallback(true);
          setExplainLoaded(true);
          return;
        }

        if (result.text) {
          setExplanation(result.text);
          setExplainLoaded(true);

          if (!result.cached && !result.fallback) {
            const updatedPlan = structuredClone(planData.plan);
            updatedPlan[0].explanation = result.text;

            await updateDoc(
              doc(db, "users", user.uid, "plans", planId),
              { plan: updatedPlan }
            );

            setPlanData({ ...planData, plan: updatedPlan });
          }
          return;
        }

        if (result.fallback || result.quotaExceeded || result.error) {
          setExplainFallback(true);
          setExplainLoaded(true);
        }

      } catch (err) {
        console.error("Explain fetch failed:", err);
        setExplainFallback(true);
        setExplainLoaded(true);
      }
    }

    if (!explainLoaded && planData?.plan?.length && user && planId) {
      fetchExplanation();
    }
  }, [planData, user, explainLoaded, planId]);

  /* ---------------- PROGRESS CALC ---------------- */
  const totalTasks = planData?.totalTasks || 0;
  const completedTasks = planData?.completedTasks || 0;
  const progressPercent = planData?.progress || 0;

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <p className="pt-40 text-center text-gray-400">
          Loading study plan...
        </p>
      </div>
    );
  }

  /* ---------------- NO PLAN ---------------- */
  if (!planData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="max-w-xl mx-auto px-6 pt-40 text-center space-y-6">
          <h1 className="text-3xl font-semibold">Plan Not Found</h1>
          <p className="text-gray-400">
            This study plan doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition font-medium text-lg"
          >
            ← Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  /* ---------------- PLAN DETAIL ---------------- */
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 space-y-12">

        {/* Back Button & Delete */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Plans</span>
          </Link>

          <button
            onClick={handleDeletePlan}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Plan</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{planData.subjectName}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <p className="text-sm sm:text-base">
                Exam on {planData.examDate} · {planData.dailyHours} hrs/day
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-300">Overall Progress</span>
              <span className="text-2xl font-bold text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </div>

        {/* Study Plan */}
        <div className="space-y-8">
          {planData.plan.map((day, dayIndex) => {
            const isToday = dayIndex === 0;
            const dayTasks = day.tasks || [];
            const completedCount = dayTasks.filter(t => t.completed).length;
            
            return (
              <div
                key={day.day}
                className={`border rounded-2xl p-5 sm:p-6 transition-all ${
                  isToday
                    ? "border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 shadow-lg shadow-indigo-500/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg sm:text-xl font-semibold">
                        Day {day.day}
                      </h2>
                      {isToday && (
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-500 text-white rounded-full">
                          Today's Focus
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{day.date}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {completedCount}/{dayTasks.length} completed
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {dayTasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl transition-all ${
                        task.completed
                          ? "bg-green-500/10 border border-green-500/30 task-completed"
                          : "bg-black/40 hover:bg-black/60"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <button
                          onClick={() => toggleTaskCompletion(dayIndex, taskIndex)}
                          className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? "bg-green-500 border-green-500 check-pop"
                              : "border-white/30 hover:border-indigo-400 hover:scale-110"
                          }`}
                        >
                          {task.completed && (
                            <span className="text-white text-sm font-bold">✓</span>
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm sm:text-base truncate ${
                            task.completed ? "line-through text-gray-400" : "text-white"
                          }`}>
                            {task.topic}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                            {task.type} · {task.duration} mins
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                          onClick={() => handleExplainTopic(task)}
                          className="p-2 rounded-lg hover:bg-indigo-500/20 transition-all text-indigo-400 hover:text-indigo-300 hover:scale-110"
                          title="Explain this topic"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            task.priority === "high"
                              ? "bg-red-500/20 text-red-400"
                              : task.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Insight */}
        {explanation && (
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6">
            <p className="text-sm font-medium text-indigo-300 mb-3 flex items-center gap-2">
              <span className="text-lg">🤖</span>
              Nexora Insight
            </p>
            <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed font-sans">
              {explanation}
            </pre>
          </div>
        )}

        {explainFallback && !explanation && (
          <div className="rounded-2xl border border-gray-500/30 bg-gray-500/10 p-6">
            <p className="text-sm text-gray-400 leading-relaxed">
              AI insights will appear here once available. Your study plan is active and ready to use.
            </p>
          </div>
        )}

      </main>

      {/* Explanation Modal */}
      <ExplanationModal
        isOpen={modalOpen}
        onClose={closeModal}
        topic={selectedTopic}
        explanation={topicExplanation}
        loading={topicLoading}
        error={topicError}
      />
    </div>
  );
}
