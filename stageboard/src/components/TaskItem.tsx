"use client";
import React, { useState } from "react";
import Button from "./Button";

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
          className={`w-8 h-8 rounded-sm border-2 flex-shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:border-blue-400 border-gray-500
            ${task.is_done 
              ? "bg-green-500 hover:bg-green-800" 
              : "bg-gray-800 hover:bg-gray-700"
            }`
          }
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
            <Button type="submit" variant="primary">Save</Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
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
          <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
          <Button variant="danger" onClick={() => onDelete(task.id)}>Delete</Button>
        </div>
      )}
    </li>
  );
}
