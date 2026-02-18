import useRevealOnScroll from "../hooks/useRevealOnScroll";

/* ================= Sport Card (Zoom Only) ================= */

interface SportCardProps {
  name: string;
  image: string;
}

export default function SportCard({ name, image }: SportCardProps) {
  const { ref, visible } = useRevealOnScroll();

  return (
    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
      <div ref={ref} className="h-full w-full">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            visible ? "scale-100" : "scale-110"
          }`}
        />
      </div>

      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {name}
        </h2>
      </div>
    </div>
  );
}