import { useEffect, useState } from "react";

interface UseScrollToTopReturn {
  visible: boolean;
  scrollToTop: () => void;
}

export default function useScrollToTop(): UseScrollToTopReturn {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return { visible, scrollToTop };
}
