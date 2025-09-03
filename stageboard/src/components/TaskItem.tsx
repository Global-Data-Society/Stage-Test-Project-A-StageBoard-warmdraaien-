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
    <li className="border p-2 rounded flex justify-between items-center">
      <div className="flex items-center gap-2">
        <button
          className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
            task.is_done
              ? "bg-green-500 border-green-600"
              : "bg-white border-gray-400"
          }`}
          onClick={() => onToggleDone(task.id, task.is_done)}
          aria-label="Toggle"
        />
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
            <button type="submit" className="px-2 py-1 bg-green-500 text-white rounded cursor-pointer">
              Save
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-gray-400 text-white rounded cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <span className={task.is_done ? "line-through" : ""}>{task.title}</span>
            <span className="ml-2 text-gray-500 text-sm">
              {new Date(task.created_at).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      {!isEditing && (
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
