import { useNavigate } from "react-router-dom";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import { useAuth } from "../contexts/AuthContext";
import { useSport } from "../contexts/SportContext";
import type { Sport } from "../lib/api";

interface SportCardProps {
  name: string;
  image: string;
  sportId: Sport;
}

export default function SportCard({ name, image, sportId }: SportCardProps) {
  const { ref, visible } = useRevealOnScroll();
  const { isAuthenticated } = useAuth();
  const { setSport } = useSport();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuthenticated) {
      setSport(sportId);
      navigate("/app/dashboard");
    } else {
      // Store intended sport so SportSelect can pre-highlight it
      localStorage.setItem("ps_intended_sport", sportId);
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative h-72 rounded-2xl overflow-hidden shadow-lg w-full group cursor-pointer"
    >
      <div ref={ref} className="h-full w-full">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${
            visible ? "scale-100" : "scale-110"
          }`}
        />
      </div>

      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">{name}</h2>
        <span className="text-sm text-white/70 border border-white/30 rounded-full px-3 py-0.5 group-hover:border-white/60 transition-colors">
          {isAuthenticated ? "Go to Dashboard →" : "Get Started →"}
        </span>
      </div>
    </button>
  );
}
