import { useEffect, useState } from "react";
import useRevealOnScroll from "../hooks/useRevealOnScroll";


/* ================= Stat Card ================= */
interface StatCardProps {
  target: number;
  label: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(0) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

export default  function StatCard({ target, label }: StatCardProps) {
  const { ref, visible } = useRevealOnScroll();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!visible) return;

    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [visible, target]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl p-8 shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h3 className="text-3xl font-bold text-emerald-500 mb-2">
        {formatNumber(count)}+
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm">
        {label}
      </p>
    </div>
  );
}
