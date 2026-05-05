import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");

  const [latest, setLatest] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/latest-result")
      .then((res) => res.json())
      .then((data) => setLatest(data));
  }, []);

  if (!loggedInUser) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-64 bg-zinc-900 p-6 hidden md:block">
        <h1 className="text-3xl font-bold text-cyan-400 mb-10">
          InterviewIQ
        </h1>

        <ul className="space-y-6 text-lg">
          <li className="hover:text-cyan-400 cursor-pointer">Dashboard</li>

          <li
            onClick={() => navigate("/interview")}
            className="hover:text-cyan-400 cursor-pointer"
          >
            Interviews
          </li>

          <li
            onClick={() => navigate("/history")}
            className="hover:text-cyan-400 cursor-pointer"
          >
            Analytics
          </li>

          <li
            onClick={() => navigate("/profile")}
            className="hover:text-cyan-400 cursor-pointer"
          >
            Profile
          </li>

          <li
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/");
            }}
            className="text-red-400 hover:text-red-300 cursor-pointer"
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-10 break-words">
          Welcome Back, {loggedInUser} 👋
        </h1>

        <button
          onClick={() => navigate("/interview")}
          className="bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold mb-10 hover:scale-105 transition duration-300"
        >
          Start AI Interview 🚀
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-cyan-400 text-xl mb-4">Total Questions</h2>
            <p className="text-5xl font-bold">{latest ? latest.total : 0}</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-cyan-400 text-xl mb-4">Latest Score</h2>
            <p className="text-5xl font-bold">
              {latest ? latest.score + "%" : "0%"}
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-cyan-400 text-xl mb-4">Latest Role</h2>
            <p className="text-3xl font-bold">
              {latest ? latest.role : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;