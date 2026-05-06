import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSaved = useRef(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const questions = location.state?.questions || [];
  const answers = location.state?.answers || [];
  const role = localStorage.getItem("role");

  const roleName =
    role === "frontend"
      ? "Frontend Developer"
      : role === "backend"
        ? "Backend Developer"
        : role === "data"
          ? "Data Analyst"
          : "General Interview";

  const total = questions.length;
  const answered = answers.filter((a) => a.trim() !== "").length;
  const score = total === 0 ? 0 : Math.round((answered / total) * 100);

  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    if (questions.length > 0) {
      const result = {
        date: new Date().toLocaleString(),
        score,
        answered,
        total,
        role: roleName,
      };

      localStorage.setItem(
        "results",
        JSON.stringify([
          ...(JSON.parse(localStorage.getItem("results")) || []),
          result,
        ]),
      );

      fetch("https://ai-mock-interview-system-d4xd.onrender.com/save-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      })
        .then((res) => res.json())
        .then((data) => console.log("Saved:", data))
        .catch((err) => console.log("Error:", err));

      fetch("https://ai-mock-interview-system-d4xd.onrender.com/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions, answers }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("AI Feedback:", data.feedback);
          setAiFeedback(data.feedback);
        })
        .catch((err) => console.log("AI Error:", err));
    }
  }, []);

  let feedback = "";

  const goodAnswers = answers.filter((a) => a.length > 50).length;

  if (goodAnswers >= total * 0.7) {
    feedback =
      "Excellent! Your answers are detailed and well explained. Keep it up!";
  } else if (goodAnswers >= total * 0.4) {
    feedback = "Good effort. Try to give more detailed answers with examples.";
  } else {
    feedback =
      "Your answers are too short. Try to explain concepts clearly with examples.";
  }

  const weakAreas = questions
    .map((q, index) => ({
      question: q,
      answer: answers[index],
    }))
    .filter((item) => !item.answer || item.answer.trim() === "");

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-cyan-400 mb-10">
        Interview Summary
      </h1>

      <p className="text-gray-400 mb-8">Role: {roleName}</p>

      {questions.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <p className="text-gray-300 mb-6">
            No interview data found. Please attend the interview first.
          </p>

          <button
            onClick={() => navigate("/interview")}
            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Go to Interview
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <p className="text-gray-400">Total Questions</p>
              <h2 className="text-3xl font-bold">{total}</h2>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <p className="text-gray-400">Answered</p>
              <h2 className="text-3xl font-bold text-green-400">{answered}</h2>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <p className="text-gray-400">Score</p>
              <h2 className="text-3xl font-bold text-cyan-400">{score}%</h2>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              AI Feedback
            </h2>
            <p className="text-gray-300">{aiFeedback || feedback}</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Weak Areas
            </h2>

            {weakAreas.length === 0 ? (
              <p className="text-green-400">
                Great! You attempted all questions.
              </p>
            ) : (
              <ul className="space-y-3 text-gray-300">
                {weakAreas.map((item, index) => (
                  <li key={index}>❌ {item.question}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800"
              >
                <h2 className="text-xl font-bold text-cyan-400 mb-4">
                  Question {index + 1}
                </h2>

                <p className="text-gray-300 mb-4">{q}</p>

                <p className="bg-zinc-800 p-4 rounded-xl">
                  {answers[index] || "No Answer"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-5">
            <button
              onClick={() => navigate("/interview")}
              className="bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition duration-300"
            >
              Retake Interview
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="border border-cyan-400 px-8 py-4 rounded-xl font-bold hover:bg-cyan-400 hover:text-black transition duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Summary;
