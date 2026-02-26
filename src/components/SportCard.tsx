import useRevealOnScroll from "../hooks/useRevealOnScroll";
import { Link } from "react-router-dom";

interface SportCardProps {
  name: string;
  image: string;
  to: string;
}

export default function SportCard({ name, image, to }: SportCardProps) {
  const { ref, visible } = useRevealOnScroll();

  return (
    <Link
      to={to}
      className="block relative h-72 rounded-2xl overflow-hidden shadow-lg group"
    >
      <div ref={ref} className="h-full w-full">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            visible ? "scale-100" : "scale-110"
          } group-hover:scale-105`}
        />
      </div>

      <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {name}
        </h2>
      </div>
    </Link>
  );
}
