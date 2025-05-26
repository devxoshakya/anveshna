export const CustomLoader = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <img
        src={"/loader.png"}
        alt={"Logo"}
        className="w-[150px] scale-125"
      />
      <p className="text-sm my-1.5">
        Powered by <span className="font-bold">Dev & Akshita</span>
      </p>
      <div className="w-[250px] h-1 bg-accent rounded-md overflow-hidden relative">
        <div className="w-full h-full bg-foreground dark:bg-list-background animate-slide"></div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-slide {
          animation: slide 1s infinite;
        }
      `}</style>
    </div>
  );
};