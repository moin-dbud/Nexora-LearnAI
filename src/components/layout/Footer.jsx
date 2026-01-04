import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">
              Nexora<span className="text-indigo-400">LearnAI</span>
            </h3>
            <p className="mt-4 text-sm text-gray-400 max-w-sm">
              An AI-powered learning decision system that helps students
              study with clarity, focus, and confidence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>
                <Link href="#how-it-works" className="hover:text-white transition">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#why-nexora" className="hover:text-white transition">
                  Why Nexora
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition">
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Context */}
          <div>
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
              Project
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>Built for TechSprint Hackathon</li>
              <li>Powered by Gemini & Firebase</li>
              <li>Designed for students</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Nexora LearnAI · Built with purpose
          </p>
        </div>

      </div>
    </footer>
  );
}