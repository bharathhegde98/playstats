import useRevealOnScroll from "../hooks/useRevealOnScroll";

export  default function RevealFade({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useRevealOnScroll();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}