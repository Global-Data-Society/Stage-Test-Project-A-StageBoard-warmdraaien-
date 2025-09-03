"use client";
import React from "react";

export default function TaskForm({ onCreate }: { onCreate: (title: string) => Promise<void> }) {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const input = (event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement;
        if (!input.value.trim()) return;
        await onCreate(input.value.trim());
        input.value = "";
      }}
      className="flex gap-2 mb-4"
    >
      <input
        type="text"
        name="title"
        placeholder="New task..."
        className="flex-1 border rounded p-2"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 cursor-pointer"
      >
        Add
      </button>
    </form>
  );
}
