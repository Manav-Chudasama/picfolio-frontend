import { CheckCircle } from "lucide-react";

export default function DateSection({ 
  date, 
  children, 
  onSelectAll, 
  isAllSelected, 
  selectionCount 
}) {
  return (
    <div className="mb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-gray-50 dark:bg-gray-900 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {date}
          </h2>
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <CheckCircle 
              className={`w-5 h-5 ${
                isAllSelected 
                  ? "text-blue-500" 
                  : selectionCount > 0 
                    ? "text-blue-500/50" 
                    : "text-gray-400"
              }`} 
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {selectionCount > 0 ? `Selected ${selectionCount}` : "Select All"}
            </span>
          </button>
        </div>
        <div className="mt-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent" />
      </div>
      {children}
    </div>
  );
} 