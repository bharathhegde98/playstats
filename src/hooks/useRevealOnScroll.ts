import { useEffect, useRef, useState } from "react";

interface RevealReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
}

export default function useRevealOnScroll(): RevealReturn {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
