const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/interviewiq")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const ResultSchema = new mongoose.Schema({
  score: Number,
  answered: Number,
  total: Number,
  date: String,
  role: String,
});

const Result = mongoose.model("Result", ResultSchema);

app.get("/", (req, res) => {
  res.send("InterviewIQ Backend is running");
});
app.post("/save-result", async (req, res) => {
  try {
    console.log("Received:", req.body);

    const newResult = new Result(req.body);
    await newResult.save();

    res.json({ message: "Saved to MongoDB" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/results", async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/latest-result", async (req, res) => {
  try {
    const latest = await Result.findOne().sort({ _id: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/questions", (req, res) => {
  const role = req.query.role;

  let questions = [];

  if (role === "frontend") {
    questions = [
      "What is React and how does it work?",
      "Explain useState and useEffect.",
      "What is virtual DOM?",
      "Difference between props and state.",
      "What is responsive design?",
    ];
  } else if (role === "backend") {
    questions = [
      "What is REST API?",
      "Explain Node.js event loop.",
      "What is middleware in Express?",
      "Difference between SQL and NoSQL.",
      "What is authentication?",
    ];
  } else if (role === "data") {
    questions = [
      "What is normalization?",
      "Explain regression.",
      "Difference between supervised and unsupervised learning.",
      "What is data cleaning?",
      "What is overfitting?",
    ];
  } else {
    questions = [
      "Tell me about yourself",
      "What are your strengths?",
      "What are your weaknesses?",
      "Why should we hire you?",
      "Where do you see yourself in 5 years?",
    ];
  }

  res.json(questions);
});
app.get("/ai-questions", async (req, res) => {
  const role = req.query.role;

  try {
    const prompt = `Generate 5 technical interview questions for a ${role} role. Only return questions as a list.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an interview question generator." },
        { role: "user", content: prompt },
      ],
    });

    const text = response.choices[0].message.content;

    const questions = text
      .split("\n")
      .map(q => q.replace(/^\d+\.\s*/, ""))
      .filter(q => q.trim() !== "");

    res.json(questions);

  } catch (error) {
    console.log("OpenAI error:", error.message);

    const fallbackQuestions = {
  frontend: [
    "What is React?",
    "Explain useState and useEffect.",
    "What is Virtual DOM?",
    "Difference between props and state.",
    "What is responsive design?",
  ],
  backend: [
    "What is REST API?",
    "Explain Node.js event loop.",
    "What is middleware in Express?",
    "Difference between SQL and NoSQL.",
    "What is authentication?",
  ],
  data: [
    "What is normalization?",
    "What is data cleaning?",
    "Explain SQL JOIN.",
    "What is overfitting?",
    "What is data visualization?",
  ],
};

res.json(fallbackQuestions[role] || fallbackQuestions.frontend);
  }
});
app.post("/evaluate", async (req, res) => {
  const { questions, answers } = req.body;

  try {
    const prompt = `
Evaluate the following interview answers.
Give score out of 100 and short feedback.

Questions:
${questions.join("\n")}

Answers:
${answers.join("\n")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an interview evaluator." },
        { role: "user", content: prompt },
      ],
    });

    const result = response.choices[0].message.content;

    res.json({ feedback: result });

  } catch (error) {
    console.log("AI evaluation error:", error.message);

    res.json({
      feedback: "Evaluation not available. Please improve your answers."
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
