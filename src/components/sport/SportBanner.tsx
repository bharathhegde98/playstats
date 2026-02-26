type SportBannerProps = {
	headline: string;
	image: string;
};

export default function SportBanner({ headline, image }: SportBannerProps) {
	return (
		<div className="relative h-[500px] overflow-hidden flex items-center">
			
			{/* Background Image */}
			<img
				src={image}
				alt="Sport banner"
				className="absolute inset-0 w-full h-full object-cover animate-zoomOut"
			/>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-green-400/60 to-cyan-400/60"></div>

			{/* Content */}
			<div className="relative max-w-7xl mx-auto px-6 text-white z-10">
				<h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
					{headline}
				</h1>
			</div>
		</div>
	);
}