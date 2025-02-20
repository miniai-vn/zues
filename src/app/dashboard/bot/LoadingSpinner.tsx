const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center gap-2 dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingSpinner;
