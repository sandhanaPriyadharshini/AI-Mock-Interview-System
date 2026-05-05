import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const handleLogin = () => {
  if (!role) {
    alert("Please select a role");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const validUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (validUser || (email === "admin@gmail.com" && password === "1234")) {
    localStorage.setItem("loggedInUser", email);
    localStorage.setItem("role", role);
    navigate("/dashboard");
  } else {
    alert("Invalid email or password");
  }
};
  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      alert("User already exists");
      return;
    }

    users.push({ email, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful. Please login.");
    setIsSignup(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="bg-zinc-900/70 backdrop-blur-lg p-10 rounded-3xl w-full max-w-md border border-zinc-800 shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          InterviewIQ
        </h1>

        <p className="text-cyan-400 text-center mb-2 font-medium">
          Crack your interviews with AI-powered practice 🚀
        </p>

        <p className="text-gray-400 text-center mb-8">
          Login to continue your AI interview practice
        </p>

        <div className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-cyan-400"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-cyan-400"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-cyan-400"
          >
            <option value="">Select Interview Role</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="data">Data Analyst</option>
          </select>

          <button
            onClick={isSignup ? handleSignup : handleLogin}
            className="w-full bg-cyan-400 text-black py-4 rounded-xl font-bold hover:scale-105 transition duration-300"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </div>

        <p className="text-gray-400 text-center mt-6">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}

          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-cyan-400 cursor-pointer ml-2"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
