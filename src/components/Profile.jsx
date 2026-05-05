import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    navigate("/");
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-cyan-400 mb-10">Profile</h1>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 max-w-xl">
        <h2 className="text-3xl font-bold mb-4">Priya</h2>
        <p className="text-gray-400 mb-2">Role: Final Year CSE Student</p>
        <p className="text-gray-400 mb-2">Goal: Software Developer / SDE</p>
        <p className="text-gray-400">Skills: C++, DSA, React, JavaScript</p>
      </div>
    </div>
  );
}

export default Profile;
