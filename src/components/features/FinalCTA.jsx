import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function FinalCTA() {
  const router = useRouter();

  const handleStartPlan = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/profile");
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <section className="bg-black text-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-white/5">

          {/* Subtle Gradient Accent */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 sm:p-8 md:p-12 lg:p-16 items-center">

            {/* LEFT CONTENT */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-snug"
              >
                Stop guessing. <br className="hidden md:block" />
                Start studying with{" "}
                <span className="text-indigo-400">clarity</span>.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mt-4 md:mt-5 text-gray-300 text-sm md:text-base max-w-xl"
              >
                Nexora uses evidence-based algorithms to decide what to study and when,
                with AI explanations to help you understand why.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                <button
                  onClick={handleStartPlan}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition font-medium text-white text-center text-base md:text-lg"
                >
                  Start My Study Plan
                </button>

                <Link
                  href="#how-it-works"
                  className="text-sm md:text-base text-gray-300 hover:text-white transition self-center sm:self-auto"
                >
                  See how it works →
                </Link>
              </motion.div>
            </div>

            {/* RIGHT SIDE – VISUAL CUE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex items-center justify-center"
            >
              <div className="relative w-50 h-50 rounded-full bg-indigo-500/20 blur-2xl" />
              <div className="absolute w-50 h-50 rounded-full bg-indigo-500 flex items-center justify-center text-center shadow-xl">
                <span className="text-lg font-semibold leading-tight">
                  Evidence-based<br />planning
                </span>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}