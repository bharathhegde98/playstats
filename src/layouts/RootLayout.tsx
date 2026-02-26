import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
	return (
		<div className="min-h-screen bg-white text-gray-900 dark:text-gray-100 flex flex-col">
			<Header />
			<main className="flex-grow pt-16">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
