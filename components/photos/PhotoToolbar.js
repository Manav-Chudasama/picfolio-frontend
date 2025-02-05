import { Grid, List, SlidersHorizontal, Upload } from 'lucide-react';

export default function PhotoToolbar() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
            flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </button>

          <button
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
            hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2
            w-full sm:w-auto justify-center"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Grid className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 