type SportBannerProps = {
  headline: string;
  image: string;
};

export default function SportBanner({ headline, image }: SportBannerProps) {
  return (
    <div
      className="relative h-[500px] flex items-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔥 Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,230,118,0.65), rgba(0,229,255,0.65))",
        }}
      ></div>

      {/* 📝 Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
          {headline}
        </h1>
      </div>
    </div>
  );
}