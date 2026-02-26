type RegisterSectionProps = {
  title?: string;
  description?: string;
};

export default function RegisterSection({
  title = "Register",
  description,
}: RegisterSectionProps) {
  return (
    <section
      className="py-20 text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 230, 118, 0.65), rgba(0, 229, 255, 0.65))",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>

        {description && (
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {description}
          </p>
        )}

        <button
  onClick={() => alert("Registration coming soon 🚀")}
  className="bg-white text-black font-semibold px-10 py-3 rounded-full 
             hover:text-[#00e676] 
             transition duration-300 shadow-lg"
>
  Register
</button>
      </div>
    </section>
  );
}