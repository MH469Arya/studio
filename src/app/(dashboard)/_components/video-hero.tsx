export function VideoHero() {
  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border shadow-sm">
      <video
        src="/artisan-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 text-white bg-gradient-to-t from-black/60 to-transparent">
        <h1 className="text-3xl md:text-5xl font-headline font-bold shadow-2xl">
          Welcome to KalConnect
        </h1>
        <p className="mt-2 max-w-lg text-lg text-neutral-200">
          Empowering artisans, connecting cultures. Here are your tools for success.
        </p>
      </div>
    </div>
  );
}
