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
  if (tasks.length === 0) return <p>No tasks found!</p>;

  return (
    <ul className="space-y-2">
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
