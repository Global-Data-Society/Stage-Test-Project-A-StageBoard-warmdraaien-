"use client";
import React, { useState } from "react";

type Task = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

export default function TaskItem({
  task,
  onToggleDone,
  onDelete,
  onUpdate,
}: {
  task: Task;
  onToggleDone: (id: string, state: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  return (
    <li className="flex justify-between items-center p-3 rounded-md bg-gray-700 shadow-md">
      <div className="flex items-center gap-3">
        <button
          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 cursor-pointer transition-all duration-200 ease-in-out 
            ${task.is_done 
              ? "bg-green-500 border-green-600 scale-110" 
              : "bg-gray-800 border-gray-500 hover:border-blue-400 hover:scale-110"
            }`}
          onClick={() => onToggleDone(task.id, task.is_done)}
          aria-label="Toggle"
        ></button>
        {isEditing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (editTitle.trim()) onUpdate(task.id, editTitle);
              setIsEditing(false);
            }}
            className="flex gap-2"
          >
            <input
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              className="border rounded p-1"
              aria-label="text_field"
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md cursor-pointer">
              Save
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <span className={task.is_done ? "line-through" : ""}>{task.title}</span>
            <span className="ml-2 text-gray-400 text-sm">
              {new Date(task.created_at).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      {!isEditing && (
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md cursor-pointer" 
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md cursor-pointer"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
