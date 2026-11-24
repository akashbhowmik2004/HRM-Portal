const LoadingPage = ({
  title = "Loading HRM Portal",
  subtitle = "Preparing your workspace...",
  fullScreen = true,
}) => {
  return (
    <div
      className={`${fullScreen ? "fixed inset-0 z-[9999]" : "min-h-[400px]"} flex items-center justify-center bg-[#F6F7FB] px-6 dark:bg-[#0f172a]`}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className="flex flex-col items-center text-center">
        <div className="loading-logo mb-5">
          <span>H</span>
          <span className="loading-logo-ring" />
        </div>

        <h1 className="text-lg font-bold tracking-tight text-[#172033] dark:text-white">
          HRM Portal
        </h1>
        <p className="mt-1 text-xs font-medium text-[#667085] dark:text-slate-400">
          {subtitle}
        </p>

        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-[#E4E7EC] dark:bg-slate-700">
          <div className="loading-progress h-full rounded-full bg-[#2563EB]" />
        </div>

        <p className="mt-3 text-[11px] font-medium text-[#667085] dark:text-slate-500">
          {title}
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
