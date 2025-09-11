"use client";

import React, { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import Button from "@/components/Button";
import ProgressBar from "@/components/TaskProgressBar";
import TaskSort from "@/components/TaskSort";
import TaskModalForm from "@/components/TaskModal";
import ErrorModal from "@/components/ErrorModal";

type Task = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const router = useRouter();

  const [dateSort, setDateSort] = useState<"oldest" | "newest">("oldest");
  const [doneSort, setDoneSort] = useState<"all" | "done_first" | "not_done_first">("all");
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);

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

useEffect(() => {
  const sortedTasks = [...tasks].sort((a, b) => {

    if (doneSort === "done_first") {
      const diff = Number(b.is_done) - Number(a.is_done);
      if (diff !== 0) return diff;
    } else if (doneSort === "not_done_first") {
      const diff = Number(a.is_done) - Number(b.is_done);
      if (diff !== 0) return diff;
    }

    return dateSort === "newest"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  setDisplayTasks(sortedTasks);
}, [tasks, dateSort, doneSort]);





  async function createTask(title: string) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .insert([{ title }])
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
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, is_done: !currentState } : task
      )
    );
  
    const { error } = await supabaseClient
      .from("tasks")
      .update({ is_done: !currentState })
      .eq("id", taskId);

    if (error) {
      setError(error.message);
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, is_done: currentState } : task
        )
      );
    }
  }

  const loading = userLoading || tasksLoading;

  if (loading) return ( 
    <main className="flex items-center justify-center h-screen bg-gray-900">
      <p className="text-lg font-medium">Loading tasks...</p>
    </main> 
  ) 


  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900">
      {error && <ErrorModal message={error} />}
      <header className="w-full bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500">Tasks</h1>
        <Link href="/logout">
          <Button variant="danger">Logout</Button>
        </Link>
      </header>
      <section className="w-full max-w-[85%]">
        <article className="flex flex-row items-center justify-self-end mt-4 gap-4">

            <div className=" bg-gray-800 p-4 rounded-xl shadow-md">
              <TaskSort
                dateSort={dateSort}
                doneSort={doneSort}
                onDateSortChange={setDateSort}
                onDoneSortChange={setDoneSort}
              />
            </div>
            <div className="self-center bg-gray-800 p-4 rounded-xl shadow-md">
              <TaskModalForm onCreate={createTask} />
            </div>

        </article>
        <article className="flex flex-row gap-10">
          <div className="sticky top-4 self-start mt-4">

            <div className="bg-gray-800 p-4 rounded-xl shadow-md w-24 mx-auto">
              <ProgressBar tasks={tasks} />
            </div>

          </div>
        
          <div className="w-full mt-4">
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-md">
              <TaskList
                tasks={displayTasks}
                onToggleDone={toggleDone}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            </div>

          </div>
        </article>
      </section>
    </main>
  );
}
