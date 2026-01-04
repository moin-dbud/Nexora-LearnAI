import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <section className="bg-black text-white py-12 md:py-16 lg:py-20" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="text-center mb-12 md:mb-16 lg:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            From <span className="text-indigo-400">Student Input</span> to{" "}
            <span className="text-indigo-400">Effective Planning</span>
          </h2>
          <p className="mt-3 md:mt-4 text-gray-300 max-w-2xl mx-auto text-sm md:text-base px-4">
            Nexora uses rule-based algorithms to create personalized study schedules,
            with AI providing insights to enhance your learning.
          </p>
        </div>

        {/* Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-center">

          {/* INPUT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-base md:text-lg font-semibold mb-4 text-indigo-300">
              📥 Student Context
            </h3>

            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-300">
              <li>• Subject syllabus</li>
              <li>• Exam date & urgency</li>
              <li>• Available daily study time</li>
              <li>• Confidence per topic</li>
            </ul>
          </motion.div>

          {/* PLANNING CORE */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center text-center"
          >
            {/* Glow */}
            <div className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full bg-indigo-500/20 blur-3xl" />

            {/* Core */}
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <span className="text-xs md:text-sm font-semibold leading-tight px-4">
                Rule-Based<br />
                Planning Engine
              </span>
            </div>

            <p className="mt-4 md:mt-6 text-sm md:text-base text-gray-300 max-w-xs px-4">
              Algorithm analyzes priorities, time constraints, and confidence levels
              to create your study schedule. AI provides explanations.
            </p>
          </motion.div>

          {/* OUTPUT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl md:rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-base md:text-lg font-semibold mb-4 text-indigo-300">
              📤 Learning Outcomes
            </h3>

            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-300">
              <li>• Personalized daily study plan</li>
              <li>• Smart topic prioritization</li>
              <li>• Spaced repetition scheduling</li>
              <li>• AI-powered learning insights</li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
