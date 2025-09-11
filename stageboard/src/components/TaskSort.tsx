import React from "react";

type TaskSortProps = {
  dateSort: "oldest" | "newest";
  doneSort: "all" | "done_first" | "not_done_first";
  onDateSortChange: (value: "newest" | "oldest") => void;
  onDoneSortChange: (value: "all" | "done_first" | "not_done_first") => void;
};

export default function TaskSort({
  dateSort,
  doneSort,
  onDateSortChange,
  onDoneSortChange,
}: TaskSortProps) {
  return (
    <div className="flex items-center w-full gap-2">
      <select
        value={dateSort}
        onChange={(event) => onDateSortChange(event.target.value as "oldest" | "newest")}
        className="px-3 py-2 rounded-xl bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer shadow-sm w-40"
        aria-label="SortOnDate"
      >
        <option value="oldest">Oldest First</option>
        <option value="newest">Newest First</option>
      </select>

      <select
        value={doneSort}
        onChange={(event) =>
          onDoneSortChange(event.target.value as "all" | "done_first" | "not_done_first")
        }
        className="px-3 py-2 rounded-xl bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer shadow-sm w-40"
        aria-label="SortOnDone"
      >
        <option value="all">No Sort</option>
        <option value="done_first">Done First</option>
        <option value="not_done_first">Not Done First</option>
      </select>
    </div>
  );
}
