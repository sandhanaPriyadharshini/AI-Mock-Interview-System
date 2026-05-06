import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function History() {
  const [results, setResults] = useState([]);

  const chartData = results.map((item, index) => ({
    name: `Test ${index + 1}`,
    score: item.score,
  }));

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem("results")) || [];
    setResults(savedResults);
  }, []);
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-cyan-400 mb-10">
        Interview History
      </h1>
      <button
        onClick={() => {
          localStorage.setItem("results", JSON.stringify([]));
          setResults([]);
        }}
        className="bg-red-500 px-6 py-3 rounded-xl font-bold mb-8 hover:scale-105 transition duration-300"
      >
        Clear History
      </button>

      {results.length === 0 ? (
        <p className="text-gray-400">No interview history found.</p>
      ) : (
        <>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Performance Chart
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-5">
            {results.map((item, index) => (
              <div
                key={index}
                className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800"
              >
                <p className="text-gray-400">{item.date}</p>
                <h2 className="text-2xl font-bold text-cyan-400">
                  Score: {item.score}%
                </h2>
                <p>
                  Answered {item.answered} out of {item.total}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default History;
