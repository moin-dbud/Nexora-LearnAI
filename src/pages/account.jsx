import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";

export default function Account() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/");
        return;
      }

      setUser(currentUser);

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data().profile);
      }
    });

    return () => unsub();
  }, []);

  async function handleSave() {
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { profile });
    alert("Profile updated");
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 pt-32 space-y-6">
        <h1 className="text-2xl font-semibold">Manage Account</h1>

        {/* Profile Information */}
        <div className="space-y-4">
          <input
            value={profile.fullName}
            onChange={e =>
              setProfile({ ...profile, fullName: e.target.value })
            }
            placeholder="Full Name"
            className="input"
          />

          <input
            value={profile.phone}
            onChange={e =>
              setProfile({ ...profile, phone: e.target.value })
            }
            placeholder="Phone Number"
            className="input"
          />

          <input
            value={profile.college}
            onChange={e =>
              setProfile({ ...profile, college: e.target.value })
            }
            placeholder="College"
            className="input"
          />

          <button
            onClick={handleSave}
            className="w-full py-3 bg-indigo-500 rounded-xl hover:bg-indigo-600 transition"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
