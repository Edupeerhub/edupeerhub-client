<<<<<<< HEAD

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
=======
export default function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-3xl font-heading text-primary">Edupeerhub</h1>

        <p className="text-base font-body text-text max-w-md mx-auto">
          Learn Better, Together.
        </p>

        <button className="bg-secondary text-white font-ui px-4 py-2 rounded hover:bg-primary transition">
          Get Started
        </button>
      </div>
    </div>
  );
}
>>>>>>> f9135822e57ffbcfd90bc23f8a5830725118c1d5
