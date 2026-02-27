type Props = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 
                       bg-gray-950/95 backdrop-blur 
                       border-b border-gray-800 
                       flex items-center justify-between 
                       px-4 z-50">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* HAMBURGER */}
        <button onClick={onMenuClick}>
          <svg
            className="w-6 h-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* LOGO */}
        <img
          src="/playstats.png"
          alt="PlayStats"
          className="h-8"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* SEARCH */}
        <button>
          <svg
            className="w-5 h-5 text-gray-400 hover:text-white transition"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* NOTIFICATION */}
        <button className="relative">
          <svg
            className="w-5 h-5 text-gray-400 hover:text-white transition"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M15 17h5l-1.405-1.405M19 13V8a7 7 0 10-14 0v5l-1.405 1.405M9 21h6" />
          </svg>

          {/* Example badge */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

      </div>
    </header>
  );
}