import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/router";
import { Calendar, BookOpen, TrendingUp, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  /* ---------------- AUTH + FETCH ALL PLANS ---------------- */
  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/");
        return;
      }

      setUser(currentUser);

      try {
        // Fetch all plans for this user
        const plansRef = collection(db, "users", currentUser.uid, "plans");
        const q = query(plansRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const userPlans = [];
        snapshot.forEach((doc) => {
          userPlans.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setPlans(userPlans);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      }
    });

    return () => unsub();
  }

  /* ---------------- DELETE PLAN ---------------- */
  async function handleDeletePlan(e, planId, subjectName) {
    e.preventDefault(); // Prevent navigation when clicking delete
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete the study plan for "${subjectName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "plans", planId));
      
      // Remove from local state
      setPlans(plans.filter(p => p.id !== planId));
      
      console.log("Plan deleted successfully");
    } catch (err) {
      console.error("Delete plan error:", err);
      alert("Failed to delete plan. Please try again.");
    }
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <p className="pt-40 text-center text-gray-400">
          Loading your study plans...
        </p>
      </div>
    );
  }

  /* ---------------- NO PLANS ---------------- */
  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="max-w-xl mx-auto px-6 pt-40 text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-semibold">No Study Plans Yet</h1>
          <p className="text-gray-400">
            Create your first personalized study plan to get started with Nexora.
          </p>
          <button
            onClick={() => router.push("/planner")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition font-medium text-lg"
          >
            <Plus className="w-5 h-5" />
            Create Study Plan
          </button>
        </main>
      </div>
    );
  }

  /* ---------------- DASHBOARD WITH PLANS ---------------- */
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 space-y-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Study Plans</h1>
            <p className="text-gray-400 mt-1">
              Manage all your exam preparations in one place
            </p>
          </div>
          <button
            onClick={() => router.push("/planner")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            New Plan
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const progress = plan.progress || 0;
            const totalTasks = plan.totalTasks || 0;
            const completedTasks = plan.completedTasks || 0;

            // Calculate days until exam
            const examDate = new Date(plan.examDate);
            const today = new Date();
            const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

            return (
              <Link
                key={plan.id}
                href={`/plan/${plan.planId || plan.id}`}
                className="group block relative"
              >
                <div className="h-full border border-white/10 rounded-2xl p-6 bg-gradient-to-br from-white/5 to-white/0 hover:border-indigo-500/40 hover:from-indigo-500/10 hover:to-purple-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeletePlan(e, plan.planId || plan.id, plan.subjectName)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {/* Subject Name */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {plan.subjectName}
                    </h3>
                  </div>

                  {/* Exam Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Exam: {plan.examDate}</span>
                  </div>

                  {/* Days Until Exam */}
                  <div className="flex items-center gap-2 text-sm mb-4">
                    {daysUntilExam > 0 ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        daysUntilExam <= 7
                          ? "bg-red-500/20 text-red-400"
                          : daysUntilExam <= 14
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                      }`}>
                        {daysUntilExam} days left
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                        Exam passed
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-semibold text-indigo-400">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {completedTasks} of {totalTasks} tasks completed
                    </p>
                  </div>

                  {/* Study Hours */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{plan.dailyHours} hrs/day</span>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{plans.length}</p>
                <p className="text-sm text-gray-400">Active Plans</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(plans.reduce((sum, p) => sum + (p.progress || 0), 0) / plans.length) || 0}%
                </p>
                <p className="text-sm text-gray-400">Avg Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {plans.reduce((sum, p) => sum + (p.completedTasks || 0), 0)}
                </p>
                <p className="text-sm text-gray-400">Tasks Completed</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
