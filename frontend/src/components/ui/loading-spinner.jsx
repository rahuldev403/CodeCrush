export const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} animate-spin border-primary border-t-transparent shadow-lg`}
      style={{ imageRendering: "pixelated" }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {spinner}
            <div className="absolute inset-0 animate-ping opacity-20">
              <div
                className={`${sizeClasses[size]} border-primary border-t-transparent`}
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
          <p className="font-mono text-sm font-bold text-primary animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return spinner;
};
