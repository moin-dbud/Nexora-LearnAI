import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function ProfileSetup() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const [profile, setProfile] = useState({
        fullName: "",
        college: "",
        dob: "",
    });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/");
            } else {
                setUser(currentUser);
            }
        });

        return () => unsub();
    }, []);

    function handleChange(e) {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user) return;

        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
            profileCompleted: true,
            profile: {
                fullName: profile.fullName,
                phone: profile.phone,
                college: profile.college,
                course: profile.course,
                year: profile.year,
                dob: profile.dob,
                email: user.email,
            },
            createdAt: new Date(),
        });


        router.push("/dashboard");
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-gradient-to-br from-white/5 to-white/0 
               border border-white/10 rounded-3xl p-8 space-y-6"
            >
                <div>
                    <h1 className="text-3xl font-semibold">Welcome to Nexora 👋</h1>
                    <p className="text-gray-400 mt-1 text-sm">
                        Let’s set up your student profile
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="fullName"
                        placeholder="Full Name"
                        required
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        value={user.email}
                        disabled
                        className="input opacity-60 cursor-not-allowed"
                    />
                </div>

                <input
                    name="phone"
                    placeholder="Phone Number"
                    required
                    onChange={handleChange}
                    className="input"
                />

                <input
                    name="college"
                    placeholder="College / University"
                    required
                    onChange={handleChange}
                    className="input"
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        name="course"
                        placeholder="Course (e.g. B.Tech)"
                        required
                        onChange={handleChange}
                        className="input"
                    />
                    <input
                        name="year"
                        placeholder="Year (e.g. 2nd)"
                        required
                        onChange={handleChange}
                        className="input"
                    />
                </div>

                <input
                    type="date"
                    name="dob"
                    required
                    onChange={handleChange}
                    className="input"
                />

                <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 
                 transition font-medium text-lg"
                >
                    Continue to Dashboard →
                </button>
            </form>
        </div>

    );
}
