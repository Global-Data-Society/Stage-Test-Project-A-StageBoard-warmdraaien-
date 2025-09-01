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

  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");


  const router = useRouter();

  useEffect(function () {
    async function fetchUser() {
      try {
        const response = await supabaseClient.auth.getUser();
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          router.push("/login");
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


  async function createTask(title: string) {
    try {
      const { data, error: insertError } = await supabaseClient
      .from("tasks")
      .insert([{ title: title, user_id: user.id }])
      .select()
      .single();

      if (insertError) {
        setError(insertError.message);
      } else if (data) {
        setTasks([...tasks, data]);
      }
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function updateTask(taskId: string, newTitle: string) {
  try {
    const { error } = await supabaseClient
      .from("tasks")
      .update({ title: newTitle })
      .eq("id", taskId);

    if (error) {
      setError(error.message);
    } else {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, title: newTitle } : task
      ));
      setEditTaskId(null);
      setEditTaskTitle("");
    }
  } catch (error: any) {
    setError(error.message);
  }
}

  async function deleteTask(taskId: string) {
    try {
      const { error: deleteError } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", taskId);
        
      if (deleteError) {
        setError(deleteError.message);
      } else {
        setTasks(tasks.filter(function (task) {
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
        setTasks(tasks.map(function (task) {
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
    <div className="p-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/logout">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
            Logout
          </button>
        </Link>
      </header>

      <main>

        <article className="mb-4">
          <form
            onSubmit={async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
              event.preventDefault();
              const formElement = event.target as HTMLFormElement;
              const inputElement = formElement.elements.namedItem("title") as HTMLInputElement;
              const newTaskTitle = inputElement.value.trim();
              if (!newTaskTitle) return;

              await createTask(newTaskTitle);
              inputElement.value = "";
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              name="title"
              placeholder="New task..."
              className="flex-1 border rounded p-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </article>


        {tasks.length === 0 && <p>No tasks found!</p>}

        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <button
                  className={`
                    w-6 h-6 rounded-full border-2 cursor-pointer ${
                      task.is_done
                        ? "bg-green-500 border-green-600 hover:border-green-700 hover:scale-110"
                        : "bg-white border-gray-400 hover:border-gray-600 hover:scale-110"
                    } transition-all duration-200
                  `}
                  onClick={() => toggleDone(task.id, task.is_done)}
                  aria-label={task.is_done ? "Mark task as not done" : "Mark task as done"}
                />

                <div>
                  {editTaskId === task.id ? (
                    <form
                      onSubmit={function handleEditFormSubmit(event: React.FormEvent<HTMLFormElement>) {
                        event.preventDefault();
                        updateTask(task.id, editTaskTitle);
                      }}
                      className="flex gap-2"
                    >
                      <label htmlFor={`edit-task-${task.id}`} className="sr-only">
                        Edit task title
                      </label>
                      <input
                        id={`edit-task-${task.id}`}
                        type="text"
                        value={editTaskTitle}
                        onChange={function handleInputChange(event) {
                          setEditTaskTitle((event.target as HTMLInputElement).value);
                        }}
                        className="border rounded p-1"
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        disabled={editTaskTitle.trim() === ""}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        onClick={() => {
                          setEditTaskId(null);
                          setEditTaskTitle("");
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className={task.is_done ? "line-through" : ""}>
                        {task.title}
                      </span>
                      <span className="ml-2 text-gray-500 text-sm">
                        {new Date(task.created_at).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {editTaskId === task.id ? null : (
                  <>
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => {
                        setEditTaskId(task.id);
                        setEditTaskTitle(task.title);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
