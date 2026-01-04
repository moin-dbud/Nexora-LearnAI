import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function Hero() {
  const router = useRouter();

  const handleGetStarted = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/profile");
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <section className="pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-20 lg:pb-24 bg-black text-white text-center lg:text-left overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Study smarter with{" "}
            <span className="text-indigo-400">evidence-based</span>
            <br className="hidden sm:block" />
            planning.
          </h1>

          <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
            Rule-based study plans that prioritize what matters most, with AI insights to help you learn effectively.
          </p>

          <motion.div
            className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={handleGetStarted}
              className="px-6 md:px-8 py-3 md:py-3.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl transition font-medium text-base md:text-lg"
            >
              Get Started
            </button>
            <button 
              onClick={() => router.push("/demo")}
              className="px-6 md:px-8 py-3 md:py-3.5 border border-white/20 rounded-xl hover:bg-white/10 transition font-medium text-base md:text-lg"
            >
              View Demo
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            <div className="space-y-4">
              <div className="h-6 w-2/3 bg-white/20 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-5/6 bg-white/10 rounded" />

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="h-20 bg-white/10 rounded-xl" />
                <div className="h-20 bg-white/10 rounded-xl" />
                <div className="h-20 bg-white/10 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-indigo-500 px-4 py-2 rounded-xl text-sm shadow-lg">
            Rule-Based Planning
          </div>

          <div className="absolute -top-6 -right-6 bg-cyan-500 px-4 py-2 rounded-xl text-sm shadow-lg">
            AI Insights
          </div>
        </motion.div>

      </div>
    </section>
  );
}


