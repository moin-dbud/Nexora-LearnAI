import { motion } from "framer-motion";
import { useState } from "react";

export default function WhyNexora() {
  const [active, setActive] = useState(null);

  return (
    <section className="bg-black text-white py-12 md:py-16 lg:py-20" id="why-nexora">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            How do you want to <span className="text-indigo-400">study</span>?
          </h2>
          <p className="mt-3 md:mt-4 text-gray-400 text-sm md:text-base">
            Tap or hover over a path to experience the difference.
          </p>
        </div>

        {/* Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">

          {/* Traditional */}
          <motion.div
            onHoverStart={() => setActive("traditional")}
            onHoverEnd={() => setActive(null)}
            onClick={() => setActive(active === "traditional" ? null : "traditional")}
            className="relative rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 bg-white/5 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-300">
              Traditional Study Tools
            </h3>

            <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">
              You plan everything yourself.
            </p>

            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-400">
              <li>• Same timetable for everyone</li>
              <li>• No priority guidance</li>
              <li>• Manual decision making</li>
              <li>• Easy to feel overwhelmed</li>
            </ul>

            {active === "traditional" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl md:rounded-3xl bg-black/60 flex items-center justify-center text-center p-6"
              >
                <p className="text-gray-300 text-sm md:text-base">
                  ❌ You're constantly guessing<br className="hidden sm:block" />
                  what to study next.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Nexora */}
          <motion.div
            onHoverStart={() => setActive("nexora")}
            onHoverEnd={() => setActive(null)}
            onClick={() => setActive(active === "nexora" ? null : "nexora")}
            className="relative rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-indigo-500/40 bg-indigo-500/10 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-indigo-300">
              Nexora LearnAI
            </h3>

            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
              Rule-based planning with AI insights.
            </p>

            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-300">
              <li>• Evidence-based scheduling</li>
              <li>• Transparent planning logic</li>
              <li>• AI-powered explanations</li>
              <li>• Progress tracking</li>
            </ul>

            {active === "nexora" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl md:rounded-3xl bg-indigo-600/80 flex items-center justify-center text-center p-6"
              >
                <p className="text-white text-sm md:text-base font-medium">
                  ✅ You always know<br className="hidden sm:block" />
                  what to study next.
                </p>
              </motion.div>
            )}
          </motion.div>

        </div>

        {/* Bottom Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 md:mt-16 lg:mt-20 text-center"
        >
          <p className="text-base md:text-lg text-gray-200 font-medium">
            Nexora doesn't give plans.
            <br />
            It gives <span className="text-indigo-400">clarity</span>.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
