"use client";
import React from "react";
import Button from "./Button";

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
      className="flex gap-2"
    >
      <input
        type="text"
        name="title"
        placeholder="New task..."
        className="flex-1 border border-gray-600 rounded-md p-2 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={120}
        minLength={3}
      />
      <Button type="submit" variant="primary">Add</Button>
    </form>
  );
}
