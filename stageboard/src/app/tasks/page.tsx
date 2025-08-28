"use client";

import React, { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  const router = useRouter()

  useEffect(function () {
    async function fetchUser() {
      try {
        const response = await supabaseClient.auth.getUser();
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          router.push("/login")
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setUserLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  useEffect(function () {
    async function fetchTasks() {
      if (!user) return;

      setTasksLoading(true);
      try {
        const { data, error: fetchError } = await supabaseClient
          .from("tasks")
          .select("id, title, is_done, created_at")
          .order("created_at");

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setTasks(data || []);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setTasksLoading(false);
      }
    }

    fetchTasks();
  }, [user]);

  const loading = userLoading || tasksLoading;

  if (loading) return <p className="p-6">Loading tasks...</p>;
  if (error) return <p className="p-6">Error: {error}</p>;

  return (
    <main className="p-6">
      <article className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/logout">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
            Logout
          </button>
        </Link>
      </article>

      {tasks.length === 0 && <p>Geen tasks!</p>}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 rounded">
            <span className={task.is_done ? "line-through" : ""}>
              {task.title}
            </span>
            <span className="ml-2 text-gray-500">
              {new Date(task.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
