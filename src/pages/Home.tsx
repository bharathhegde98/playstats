import RevealFade from "../components/RevealFade";
import SportCard from "../components/SportCard";
import FeatureCard from "../components/FeatureCard";
import StatCard from "../components/StatCard";
import TestimonialSlider from "../components/TestimonialSlider";
import RegisterSection from "../components/RegisterSection";

/* ================= Types ================= */

interface Feature {
    title: string;
    desc: string;
}

/* ================= Home ================= */

export default function Home() {
    const features: Feature[] = [
        { title: "Live Match Tracking", desc: "Real-time scores and player stats instantly." },
        { title: "Advanced Analytics", desc: "Deep performance breakdowns for teams and players." },
        { title: "Smart Leaderboards", desc: "Dynamic ranking systems for competitions." },
        { title: "Tournament Management", desc: "Organize and manage tournaments easily." },
        { title: "Match Highlights", desc: "Relive key moments from every game." },
        { title: "Community Network", desc: "Connect with fans and players worldwide." }
    ];

    return (
        <>
            {/* ================= Sport Selection ================= */}
            <section className="py-24 section-base">
                <div className="max-w-7xl mx-auto px-6">
                    <RevealFade>
                        <h1 className="text-center mb-16 text-gray-900 dark:text-white">
                            Choose Your Sport
                        </h1>
                    </RevealFade>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <SportCard name="Cricket" image="/images/card-cricket.jpg" sportId="cricket"/>
                        <SportCard name="Football" image="/images/card-soccer.jpg" sportId="football"/>
                        <SportCard name="Volleyball" image="/images/card-vollyball.jpg" sportId="volleyball"/>
                    </div>
                </div>
            </section>

            {/* ================= Why PlayStats ================= */}
            <section className="section-alt border-t border-gray-200 dark:border-gray-700 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <RevealFade>
                        <h2 className="text-center mb-16 text-gray-900 dark:text-white">
                            Why <span className="bg-brand-gradient bg-clip-text text-transparent">PlayStats</span>?
                        </h2>
                    </RevealFade>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} number={index + 1} title={feature.title} desc={feature.desc}/>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= Stats ================= */}
            <section className="py-24 section-base">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <RevealFade>
                        <h2 className="mb-16 text-gray-900 dark:text-white">
                            PlayStats in <span className="bg-brand-gradient bg-clip-text text-transparent">Numbers</span>
                        </h2>
                    </RevealFade>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <StatCard target={10000} label="Matches Tracked" />
                        <StatCard target={5000} label="Players Registered" />
                        <StatCard target={250} label="Tournaments Managed" />
                        <StatCard target={1000000} label="Stats Recorded" />
                    </div>
                </div>
            </section>

            {/* ================= Register ================= */}
            <section className="py-20 text-center section-gradient">
                <div className="max-w-4xl mx-auto px-6 text-white">
                    <RegisterSection title="Be Part of the Action" description="Join today and start your journey with us."/>
                </div>
            </section>

            {/* ================= Testimonials ================= */}
            <section className="section-alt border-t border-gray-200 dark:border-gray-700 py-24">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <RevealFade>
                        <h2 className="mb-16 text-gray-900 dark:text-white">
                            What Users Say
                        </h2>
                    </RevealFade>

                    <RevealFade>
                        <TestimonialSlider />
                    </RevealFade>
                </div>
            </section>
        </>
    );
}