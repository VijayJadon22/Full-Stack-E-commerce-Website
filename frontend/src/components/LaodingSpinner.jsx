// LoadingSpinner Component: Displays a centered loading spinner animation
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      {/* Outer container to center the spinner on the screen */}
      <div className="relative">
        {/* Static spinner circle: Acts as the base/background for the spinning effect */}
        <div className="w-10 h-10 border-orange-200 border-2 rounded-full" />

        {/* Spinning circle: Creates the spinning animation overlay */}
        <div className="w-10 h-10 border-orange-500 border-t-2 animate-spin rounded-full absolute left-0 top-0" />

        {/* Screen reader-only text for accessibility */}
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner; // Export the component for use elsewhere
