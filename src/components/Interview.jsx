import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Interview() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    navigate("/");
  }
  const role = localStorage.getItem("role");
  const roleName =
    role === "frontend"
      ? "Frontend Developer"
      : role === "backend"
        ? "Backend Developer"
        : role === "data"
          ? "Data Analyst"
          : "General Interview";

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
  fetch(`https://ai-mock-interview-system-d4xd.onrender.com/ai-questions?role=${role}`)
    .then((res) => res.json())
    .then((data) => {
      setQuestions(data);
      setAnswers(Array(data.length).fill(""));
    });
}, [role]);

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
    } catch (error) {
      alert("Camera access denied or not available.");
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;

      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] =
        updatedAnswers[currentQuestion] + " " + voiceText;

      setAnswers(updatedAnswers);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-cyan-400">Mock Interview</h1>
        <p className="text-gray-400 mt-2">Role: {roleName}</p>

        <div className="bg-red-500 px-6 py-3 rounded-full font-bold text-xl">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      <div className="flex gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-fit">
          <h2 className="text-xl font-bold text-cyan-400 mb-6">Questions</h2>

          <div className="grid grid-cols-2 gap-4">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-14 h-14 rounded-xl font-bold transition duration-300 ${
                  currentQuestion === index
                    ? "bg-cyan-400 text-black"
                    : "bg-zinc-800 hover:bg-cyan-400 hover:text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Webcam Preview
            </h2>

            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full max-w-md rounded-2xl border border-zinc-700"
            ></video>

            <button
              onClick={startCamera}
              className="mt-4 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold"
            >
              Start Camera
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">
              Question {currentQuestion + 1}
            </h2>

            <p className="text-xl leading-relaxed text-gray-300">
              {questions.length > 0 ? questions[currentQuestion] : "Loading questions..."}
            </p>

            <textarea
              value={answers[currentQuestion]}
              onChange={(e) => {
                const updatedAnswers = [...answers];
                updatedAnswers[currentQuestion] = e.target.value;
                setAnswers(updatedAnswers);
              }}
              placeholder="Type your answer here..."
              className="w-full mt-10 h-52 bg-zinc-800 rounded-2xl p-6 outline-none border border-zinc-700 focus:border-cyan-400"
            ></textarea>

            <div className="flex gap-5 mt-8 flex-wrap">
              <button
                onClick={previousQuestion}
                className="border border-cyan-400 px-8 py-4 rounded-xl font-bold hover:bg-cyan-400 hover:text-black transition duration-300"
              >
                Previous Question
              </button>

              <button
                onClick={nextQuestion}
                className="bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition duration-300"
              >
                Next Question
              </button>

              <button
                onClick={startVoiceInput}
                className="bg-purple-500 px-8 py-4 rounded-xl font-bold hover:scale-105 transition duration-300"
              >
                {isListening ? "Listening..." : "Speak Answer"}
              </button>

              <button
                onClick={() =>
                  navigate("/summary", {
                    state: { questions, answers },
                  })
                }
                className="border border-cyan-400 px-8 py-4 rounded-xl font-bold hover:bg-cyan-400 hover:text-black transition duration-300"
              >
                Submit Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
