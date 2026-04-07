import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const { user, signOut } = useAuth() || {
    user: { name: "John Student", email: "student@example.com" },
    signOut: () => {},
  };
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    studentId: "2026123456",
    phone: "",
    dob: "",
    department: "Computer Science",
    year: "3rd Year",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto mt-12 bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="flex flex-col items-center mb-6">
          <button
            onClick={handleSignOut}
            className="absolute right-8 top-8 px-4 py-1 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
            style={{ zIndex: 10 }}
          >
            Sign Out
          </button>
          <div className="relative mb-2">
            <span className="inline-block h-24 w-24 rounded-full bg-gradient-to-tr from-yellow-300 via-emerald-400 to-cyan-400 p-1 shadow-lg">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 text-4xl font-bold text-gray-700 dark:text-gray-200">
                {user.name ? user.name[0] : "S"}
              </span>
            </span>
            <span className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow">
              ✓
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {user.email}
          </p>
        </div>
        <hr className="mb-6 border-gray-200 dark:border-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Profile & Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
          View and update your profile information.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 bg-white/60 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-yellow-400 outline-none focus:ring-2 focus:ring-yellow-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 bg-white/60 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-yellow-400 outline-none focus:ring-2 focus:ring-cyan-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Student ID
              </label>
              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 bg-white/60 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-yellow-400 outline-none focus:ring-2 focus:ring-emerald-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 bg-white/60 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-yellow-400 outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="e.g. 0712345678"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 bg-white/60 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-yellow-400 outline-none focus:ring-2 focus:ring-yellow-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 bg-white/60 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-yellow-400 outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Year of Study
              </label>
              <input
                type="text"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 bg-white/60 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-yellow-400 outline-none focus:ring-2 focus:ring-yellow-200"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] font-bold px-6 py-2 shadow-lg hover:scale-105 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Changes
          </button>
          {saved && (
            <p className="text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Profile updated (demo only)
            </p>
          )}
        </form>
      </div>
    </AppLayout>
  );
};

export default ProfileSettings;




