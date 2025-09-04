"use client";

import React, { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error || !data.user) {
        setError("You must be logged in to access tasks.");
        setUserLoading(false);
      } else {
        setUser(data.user ?? null);
        setUserLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;
      setTasksLoading(true);
      const { data, error } = await supabaseClient
        .from("tasks")
        .select("id, title, is_done, created_at")
        .order("created_at");

      if (error) setError(error.message);
      else setTasks(data || []);
      setTasksLoading(false);
    }
    fetchTasks();
  }, [user]);

  async function createTask(title: string) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .insert([{ title, user_id: user.id }])
      .select()
      .single();

    if (error) setError(error.message);
    else setTasks([...tasks, data]);
  }

  async function updateTask(taskId: string, newTitle: string) {
    const { error } = await supabaseClient
      .from("tasks")
      .update({ title: newTitle })
      .eq("id", taskId);

    if (error) setError(error.message);
    else
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task)));
  }

  async function deleteTask(taskId: string) {
    const { error } = await supabaseClient
    .from("tasks")
    .delete()
    .eq("id", taskId);
    
    if (error) setError(error.message);
    else setTasks(tasks.filter((task) => task.id !== taskId));
  }

  async function toggleDone(taskId: string, currentState: boolean) {
    const { error } = await supabaseClient
      .from("tasks")
      .update({ is_done: !currentState })
      .eq("id", taskId);

    if (error) setError(error.message);
    else
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, is_done: !currentState } : task
        )
      );
  }

  const loading = userLoading || tasksLoading;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-lg font-medium text-red-500">Error: {error}</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 cursor-pointer"
          onClick={async () => {
            router.push("/logout");
          }}
        >
          back to Login
        </button>
      </div>
    );
  }

  if (loading) return ( 
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Loading tasks...</p>
    </div> 
  ) 


  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900">
      <header className="w-full bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500">Tasks</h1>
        <Link
          href="/logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md cursor-pointer"
        >
          Logout
        </Link>
      </header>

      <div className="w-full max-w-[1200px] bg-gray-800 p-6 mt-10 rounded-xl shadow-md flex flex-col gap-4">
        <TaskForm onCreate={createTask} />

        <TaskList
          tasks={tasks}
          onToggleDone={toggleDone}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </main>
  );
}
