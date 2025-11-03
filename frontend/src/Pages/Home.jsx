import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white">

      <h1 className="text-3xl font-mono mb-8">Auth Via JWT Demo</h1>

      <div className="flex gap-6">
        <Link
          to="/signup"
          className="px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
        >
          Sign Up
        </Link>

        <Link
          to="/login"
          className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Log In
        </Link>
      </div>
      <div className="flex gap-6 m-4">
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-orange-300 rounded hover:bg-orange-400 transition"
        >
          Dashboard
        </Link>

      </div>
    </div>
  );
};

export default Home;
