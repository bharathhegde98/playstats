import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
// import Cricket from "./pages/Cricket";
// import Football from "./pages/Football";
// import Volleyball from "./pages/Volleyball";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 flex flex-col">
      
      <Header />

      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
