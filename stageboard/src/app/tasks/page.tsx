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

  async function deleteTask(taskId: string) {
    try {
      const { error: deleteError } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", taskId);
  
      if (deleteError) {
        setError(deleteError.message);
      } else {
        setTasks(tasks.filter(function(task) {
          return task.id !== taskId;
        }));
      }
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function toggleDone(taskId: string, currentState: boolean) {
    try {
      const { error } = await supabaseClient
        .from("tasks")
        .update({ is_done: !currentState })
        .eq("id", taskId);
  
      if (error) {
        setError(error.message);
      } else {
        setTasks(tasks.map(function(task) {
          if (task.id === taskId) {
            return { ...task, is_done: !currentState };
          }
          return task;
        }));
      }
    } catch (error: any) {
      setError(error.message);
    }
  }

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
          <li key={task.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <span className={task.is_done ? "line-through" : ""}>
                {task.title}
              </span>
              <span className="ml-2 text-gray-500">
                {new Date(task.created_at).toLocaleString()}
              </span>
            </div>
        <div className="flex gap-2">
          <button
            className={`
              w-6 h-6 rounded-full border-2 cursor-pointer ${task.is_done ? "bg-green-500 border-green-600 hover:border-green-700 hover:scale-110" 
              : "bg-white border-gray-400 hover:border-gray-600 hover:scale-110"} transition-all duration-200
            `}
            onClick={function() { toggleDone(task.id, task.is_done); }}
            aria-label={task.is_done ? "Mark task as not done" : "Mark task as done"}
          >
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={function() { deleteTask(task.id); }}
          >
            Delete
          </button>
        </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
