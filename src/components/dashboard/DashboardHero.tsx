import UserAvatar from "../user/UserAvatar";

export default function DashboardHero() {
  return (
    <div className="relative rounded-2xl overflow-hidden">

      {/* Background */}
      <img
        src="/hero-bg.jpg"
        className="w-full h-44 object-cover opacity-40"
        alt=""
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center gap-5 px-6">

        <UserAvatar image="/user.jpg" />

        <div>
          <h2 className="text-xl font-bold">Bharath</h2>
          <p className="text-sm text-gray-300">Bangalore, India</p>
          <p className="text-xs text-gray-400 mt-1">
            Using PlayStats since Jan 2026
          </p>
        </div>
      </div>
    </div>
  );
}