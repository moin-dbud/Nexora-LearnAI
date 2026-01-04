import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/router";
import ExplanationModal from "@/components/ExplanationModal";

// Static demo data
const DEMO_PLAN = {
  exam: {
    name: "Data Structures & Algorithms Exam",
    date: "2024-03-15",
    dailyHours: 3,
  },
  plan: [
    {
      day: 1,
      date: "2024-02-15",
      tasks: [
        {
          topic: "Arrays & Strings Fundamentals",
          type: "study",
          duration: 90,
          priority: "high",
          completed: false,
        },
        {
          topic: "Basic Sorting Algorithms",
          type: "study",
          duration: 60,
          priority: "medium",
          completed: false,
        },
        {
          topic: "Practice Problems - Easy Level",
          type: "buffer",
          duration: 30,
          priority: "low",
          completed: false,
        },
      ],
      explanation: "Today's focus is on building strong fundamentals with arrays and strings, which form the foundation for most DSA problems. We're starting with high-priority topics and including practice time to reinforce concepts immediately.",
    },
    {
      day: 2,
      date: "2024-02-16",
      tasks: [
        {
          topic: "Linked Lists - Implementation",
          type: "study",
          duration: 90,
          priority: "high",
          completed: false,
        },
        {
          topic: "Arrays & Strings - Revision",
          type: "revision",
          duration: 30,
          priority: "medium",
          completed: false,
        },
        {
          topic: "Stack & Queue Basics",
          type: "study",
          duration: 60,
          priority: "medium",
          completed: false,
        },
      ],
      explanation: "Building on yesterday's foundation, we're introducing linked lists while keeping arrays fresh through spaced revision. This balanced approach ensures retention while progressing to new topics.",
    },
    {
      day: 3,
      date: "2024-02-17",
      tasks: [
        {
          topic: "Binary Search & Variations",
          type: "study",
          duration: 90,
          priority: "high",
          completed: false,
        },
        {
          topic: "Linked Lists - Practice",
          type: "revision",
          duration: 30,
          priority: "medium",
          completed: false,
        },
        {
          topic: "Problem Solving Session",
          type: "buffer",
          duration: 60,
          priority: "low",
          completed: false,
        },
      ],
      explanation: "Binary search is a crucial algorithm pattern. Today combines new learning with revision of linked lists, plus dedicated problem-solving time to apply concepts in real scenarios.",
    },
    {
      day: 4,
      date: "2024-02-18",
      tasks: [
        {
          topic: "Trees - Binary Trees Basics",
          type: "study",
          duration: 90,
          priority: "high",
          completed: false,
        },
        {
          topic: "Sorting Algorithms - Revision",
          type: "revision",
          duration: 30,
          priority: "medium",
          completed: false,
        },
        {
          topic: "Stack & Queue Problems",
          type: "study",
          duration: 60,
          priority: "medium",
          completed: false,
        },
      ],
      explanation: "Trees are fundamental data structures. We're introducing them while maintaining spaced repetition of earlier topics. This ensures you're building new knowledge on a solid, retained foundation.",
    },
    {
      day: 5,
      date: "2024-02-19",
      tasks: [
        {
          topic: "Graph Basics - Representation",
          type: "study",
          duration: 90,
          priority: "high",
          completed: false,
        },
        {
          topic: "Binary Search - Revision",
          type: "revision",
          duration: 30,
          priority: "medium",
          completed: false,
        },
        {
          topic: "Tree Traversals Practice",
          type: "study",
          duration: 60,
          priority: "medium",
          completed: false,
        },
      ],
      explanation: "Graphs are complex but essential. Today's plan balances new graph concepts with revision of binary search and practice with tree traversals, maintaining the learning momentum.",
    },
  ],
};

export default function Demo() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentDay = DEMO_PLAN.plan[selectedDay];
  const totalTasks = currentDay.tasks.length;
  const completedTasks = 0; // Demo mode - no completion

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Demo Mode Badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <span className="text-yellow-400 text-sm font-medium">
              🎯 Demo Mode - Read Only
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {DEMO_PLAN.exam.name}
          </h1>
          <p className="text-gray-400">
            Exam Date: {new Date(DEMO_PLAN.exam.date).toLocaleDateString()} • 
            Daily Study: {DEMO_PLAN.exam.dailyHours} hours
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Days</p>
            <p className="text-3xl font-bold">{DEMO_PLAN.plan.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Daily Tasks</p>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Study Hours/Day</p>
            <p className="text-3xl font-bold">{DEMO_PLAN.exam.dailyHours}h</p>
          </div>
        </div>

        {/* Day Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Day</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DEMO_PLAN.plan.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  selectedDay === index
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>
        </div>

        {/* Current Day Plan */}
        <div className="space-y-6">
          {/* Day Header */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Day {currentDay.day}</h2>
                <p className="text-gray-400">
                  {new Date(currentDay.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-2xl font-bold">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Today's Tasks</h3>
            {currentDay.tasks.map((task, taskIndex) => (
              <div
                key={taskIndex}
                className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-white/30 bg-white/5" />
                  <div>
                    <p className="font-medium">{task.topic}</p>
                    <p className="text-sm text-gray-400">
                      {task.type} · {task.duration} mins
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
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
            ))}
          </div>

          {/* AI Insight */}
          {currentDay.explanation && (
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-indigo-300 font-medium">
                  🤖 Nexora AI Insight
                </p>
                <button
                  onClick={() => setShowExplanation(true)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 underline"
                >
                  View Details
                </button>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                {currentDay.explanation}
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-3">
              Ready to Create Your Own Study Plan?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              This is just a demo. Sign up now to create personalized study plans tailored to your exams, 
              track your progress, and get AI-powered insights for your learning journey.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-lg transition"
            >
              Create Your Own Study Plan →
            </button>
          </div>
        </div>
      </main>

      {/* Explanation Modal */}
      {showExplanation && (
        <ExplanationModal
          isOpen={showExplanation}
          onClose={() => setShowExplanation(false)}
          explanation={currentDay.explanation}
          topic={`Day ${currentDay.day} Plan`}
        />
      )}
    </div>
  );
}
