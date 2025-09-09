"use client";

import React from "react";


type Task = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

export default function ProgressBar({ tasks }: { tasks: Task[] }) {
  const Percentage = tasks.length
    ? Math.round((tasks.filter(task => task.is_done).length / tasks.length) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="w-8 h-64 border border-gray-500 rounded-md overflow-hidden bg-gray-800 flex flex-col-reverse">
        <div
          className="bg-green-500 w-full transition-all duration-500"
          style={{ height: `${Percentage}%` }}
        />
      </div>
      <span className="mt-2 text-center text-xs text-gray-400 w-10 inline-block">
        {Percentage}% 
      </span>
      <span className="text-xs text-gray-400">
        completed
      </span>
    </div>
  );
}
