import { motion } from "framer-motion";

export default function ProblemSolution() {
  return (
    <section className="bg-black text-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center"
        >
          Why students struggle — and how{" "}
          <span className="text-indigo-400">Nexora</span> fixes it
        </motion.h2>

        {/* PROBLEM */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-lg md:text-xl font-semibold text-red-400 mb-6 text-center">
            The Problem
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Generic Study Plans",
                desc: "Every student follows the same timetable, ignoring individual strengths and weaknesses."
              },
              {
                title: "No Topic Prioritization",
                desc: "Students spend time on easy topics and neglect the ones they actually struggle with."
              },
              {
                title: "Last-Minute Exam Stress",
                desc: "Poor planning causes panic, burnout, and ineffective learning before exams."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-5 md:p-6"
              >
                <h4 className="text-base md:text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-300 text-sm md:text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SOLUTION */}
        <div className="mt-16 md:mt-20">
          <h3 className="text-lg md:text-xl font-semibold text-green-400 mb-6 text-center">
            The Nexora Solution
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Rule-Based Planning",
                desc: "Study plans generated using confidence levels, time availability, and exam deadlines with proven algorithms."
              },
              {
                title: "Smart Topic Prioritization",
                desc: "Algorithm prioritizes difficult topics first and schedules spaced revisions for better retention."
              },
              {
                title: "AI Learning Insights",
                desc: "Get explanations for why your schedule works and how to study each topic effectively."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl md:rounded-2xl p-5 md:p-6"
              >
                <h4 className="text-base md:text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-300 text-sm md:text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
