import { Link, useNavigate } from "react-router-dom";
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

    const destination = isAuthenticated ? "/app/dashboard" : "/login";

    const handleClick = () => {
        if (isAuthenticated) {
            setSport(sportId);
        } else {
            localStorage.setItem("ps_intended_sport", sportId);
        }
    };

    return (
        <Link
            to={destination}
            onClick={handleClick}
            className="relative h-72 rounded-2xl overflow-hidden shadow-lg w-full group cursor-pointer block"
        >
            <div ref={ref} className="h-full w-full">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover transition-transform duration-1000 ease-out 
                        ${visible ? "scale-100" : "scale-110"} 
                        group-hover:scale-105`}
                />
            </div>

            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center gap-2">
                <h3 className="sm:text-2xl font-bold text-white tracking-wide">
                    {name}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm text-white/80 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-300 group-hover:border-white group-hover:text-white">
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                    </span>
                </span>
            </div>
        </Link>
    );
}