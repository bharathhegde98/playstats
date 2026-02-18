import useRevealOnScroll from "../hooks/useRevealOnScroll";

interface FeatureCardProps {
  number: number;
  title: string;
  desc: string;
}


/* ================= Feature Card ================= */

export default function FeatureCard({ number, title, desc }: FeatureCardProps) {
  const { ref, visible } = useRevealOnScroll();


  return (
    <div
      ref={ref}
      className={`relative bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <span className="absolute top-6 right-6 text-5xl font-bold text-gray-200 dark:text-white/10">
        {String(number).padStart(2, "0")}
      </span>

      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}