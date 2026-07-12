import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => (await client.get("/tasks")).data,
  });

  const createTask = useMutation({
    mutationFn: (newTitle) => client.post("/tasks", { title: newTitle }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }) => client.put(`/tasks/${id}`, { completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: (id) => client.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(title);
    setTitle("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Tasks — {user?.username}</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => navigate("/chat")}>AI Chat</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: "8px", margin: "16px 0" }}>
        <input
          type="text"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit">Add</button>
      </form>

      {isLoading && <p>Loading tasks...</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks?.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              marginBottom: "8px",
            }}
          >
            <span
              onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
                flex: 1,
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask.mutate(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}