import { Link} from "react-router-dom";
import RevealFade from "../components/RevealFade";

type RegisterSectionProps = {
    title?: string;
    description?: string;
};

export default function RegisterSection({
    title = "Register",
    description,
}: RegisterSectionProps) {
    return (
        <>
            <RevealFade>
                <h2>
                    {title}
                </h2>
            </RevealFade>
            
            {description && (
                <RevealFade>
                    <p className="text-lg md:text-xl mb-8">
                        {description}
                    </p>
                </RevealFade>
            )}  

            <RevealFade>
                <Link to="/signup" className="bg-white text-black font-semibold px-10 py-3 rounded-full hover:text-[#00e676] transition duration-300 shadow-lg" aria-label="Go to PlayStats Register Page"> Register </Link>
            </RevealFade>
        </>
                
    );
}