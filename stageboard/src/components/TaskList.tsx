"use client";
import React from "react";
import TaskItem from "./TaskItem";

type Task = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

export default function TaskList({
  tasks,
  onToggleDone,
  onDelete,
  onUpdate,
}: {
  tasks: Task[];
  onToggleDone: (id: string, state: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
}) {
  if (tasks.length === 0) return <p className="text-white text-center mt-4">No tasks found!</p>;

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleDone={onToggleDone}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
