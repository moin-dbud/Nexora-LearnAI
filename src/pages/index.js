import { useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/features/Hero";
import ProblemSolution from "@/components/features/ProblemSolution";
import HowItWorks from "@/components/features/HowItWorks";
import WhyNexora from "@/components/features/WhyNexora";
import FinalCTA from "@/components/features/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists() || !snap.data().profileCompleted) {
          router.replace("/profile");
        } else {
          router.replace("/dashboard");
        }
      } catch (err) {
        router.replace("/profile");
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <WhyNexora />
      <FinalCTA />
      <Footer />
    </div>
  );
}
