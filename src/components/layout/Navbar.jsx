import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { onAuthStateChanged, signInWithPopup, signOut, } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth, googleProvider, db } from "@/lib/firebase";


export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setProfile(snap.data().profile);
      }
    });

    return () => unsub();
  }, []);






  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };




  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-10 lg:px-36 py-5">

      {/* Logo */}
      <Link href="/" className="text-3xl font-bold text-white cursor-pointer  max-sm:text-2xl max-md:flex-1 w-auto h-auto">
        Nexora<span className="text-indigo-400">LearnAI</span>
      </Link>

      {/* Nav Links */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center text-white gap-8 min-md:px-9 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-white overflow-hidden transition-[width] duration-350 ${isOpen ? "max-md:w-full" : "max-md:w-0"
          }`}
      >
        <X
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />

        <Link href="#how-it-works" className="relative hover:text-indigo-400 transition after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-indigo-400 hover:after:w-full after:transition-all">
          How it Works
        </Link>
        <Link href="#why-nexora" className="relative hover:text-indigo-400 transition after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-indigo-400 hover:after:w-full after:transition-all">
          Why Nexora
        </Link>
        <Link href="/contact" className="relative hover:text-indigo-400 transition after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-indigo-400 hover:after:w-full after:transition-all">
          Contact
        </Link>
      </div>

      {/* Auth Section */}
      {/* Auth Section */}
      <div className="flex items-center gap-3">
        {!user ? (
          /* LOGGED OUT */
          <button
            onClick={handleLogin}
            className="px-4 py-2 sm:px-7 sm:py-2 bg-linear-to-r 
                 from-[#1b002f] via-[#2b003f] to-[#5a004f] 
                 text-white shadow-lg shadow-black/40
                 hover:brightness-110 transition rounded-full
                 font-medium text-sm sm:text-base"
          >
            Login 👤
          </button>
        ) : (
          /* LOGGED IN */
          profile && (
            <div className="relative flex items-center gap-3">
              <span className="hidden sm:block text-sm text-white">
                Hi, {profile.fullName}
              </span>

              <img
                src={user.photoURL}
                alt="Profile"
                className="w-9 h-9 rounded-full cursor-pointer 
                     border border-white/20"
                onClick={() => setMenuOpen(!menuOpen)}
              />

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 
                          bg-black border border-white/10 
                          rounded-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/account");
                    }}
                    className="w-full text-left px-4 py-3 
                         text-sm hover:bg-white/10"
                  >
                    Manage Account
                  </button>

                  <button
                    onClick={async () => {
                      await signOut(auth);
                      router.push("/");
                    }}
                    className="w-full text-left px-4 py-3 
                         text-sm text-red-400 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>


      {/* Mobile Menu Icon */}
      <Menu
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-white"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
}
