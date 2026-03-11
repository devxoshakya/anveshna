export const ChatPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Character Image */}
        <div className="relative w-full max-w-md mx-auto">
          <img
            src="/pippo.png"
            alt="Pippo character"
            className="w-full h-54 md:h-64 object-contain"
          />
        </div>
        
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 
            className="text-3xl md:text-5xl font-extralight text-foreground font-(family-name:--font-instrument-serif)"
          >
            Introducing Pippo AI
          </h1>
          <p 
            className="text-base md:text-lg text-muted-foreground max-w-2xl font-extralight mx-auto font-(family-name:--font-inter)"
          >
            Your intelligent anime companion powered by AI. Get personalized recommendations, 
            discover hidden gems across genres, and dive deep into discussions about plot theories, 
            character development, and the anime universe.
          </p>
        </div>


        

        
      </div>
    </div>
  );
};
