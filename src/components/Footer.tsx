import useScrollToTop from "../hooks/useScrollToTop";

export default function Footer() {
  const { visible, scrollToTop } = useScrollToTop();

  return (
    <>
      <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">

            {/* Left */}
            <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">
              © 2026{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                PlayStats
              </span>. All rights reserved.
            </p>

            {/* Center links */}
            <div className="flex items-center gap-6">
              <a
                href="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                About Us
              </a>
              <a
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                Terms & Services
              </a>
              <a
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                Privacy Policy
              </a>
            </div>

            {/* Right */}
            <p className="text-gray-600 dark:text-gray-400 text-center sm:text-right">
              Built with <span className="text-red-500">❤️</span> for sports fans
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300
          bg-emerald-500 text-white hover:bg-emerald-400
          dark:bg-emerald-600 dark:hover:bg-emerald-500
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        `}
        aria-label="Scroll to top"
      >
        {/* Modern Arrow SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </>
  );
}
