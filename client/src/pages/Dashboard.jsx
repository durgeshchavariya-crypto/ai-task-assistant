import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'completed'
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

  // Calculate stats in real-time
  const totalCount = tasks?.length || 0;
  const completedCount = tasks?.filter((t) => t.completed).length || 0;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks based on search string and filter button selection
  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "completed") return matchesSearch && task.completed;
    if (filter === "pending") return matchesSearch && !task.completed;
    return matchesSearch;
  });

  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "UX";

  return (
    <div className="dash-wrapper">
      {/* Premium Navbar Header */}
      <header className="dash-nav">
        <div className="dash-nav-logo">
          <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>NEXUS</span>
        </div>

        <div className="dash-nav-actions">
          {/* User profile avatar badge */}
          <div className="dash-profile">
            <div className="dash-avatar">{userInitials}</div>
            <span className="dash-username">{user?.username}</span>
          </div>

          <button className="dash-btn dash-btn-secondary" onClick={() => navigate("/chat")}>
            <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>AI Chat</span>
          </button>
          
          <button className="dash-btn dash-btn-primary" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Stats Widgets Panel */}
      <section className="dash-stats-grid">
        <div className="dash-stat-card purple">
          <span className="dash-stat-label">Total Logs</span>
          <div className="dash-stat-value-row">
            <span className="dash-stat-value">{totalCount}</span>
            <div className="dash-stat-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
          </div>
        </div>

        <div className="dash-stat-card blue">
          <span className="dash-stat-label">Pending Executions</span>
          <div className="dash-stat-value-row">
            <span className="dash-stat-value">{pendingCount}</span>
            <div className="dash-stat-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
        </div>

        <div className="dash-stat-card green">
          <span className="dash-stat-label">System Progress</span>
          <div className="dash-stat-value-row">
            <span className="dash-stat-value">{progressPercent}%</span>
            <div className="dash-stat-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="dash-progress-container">
            <div className="dash-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </section>

      {/* Task Creation Form Card */}
      <section className="dash-form-card">
        <form onSubmit={handleAdd} className="dash-form">
          <div className="dash-input-container">
            <input
              className="dash-input-premium"
              type="text"
              placeholder="Orchestrate a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createTask.isPending}
            />
            <span className="dash-input-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
              </svg>
            </span>
          </div>
          <button className="dash-btn dash-btn-primary" type="submit" disabled={createTask.isPending}>
            {createTask.isPending ? "Adding..." : "Add Task"}
          </button>
        </form>
      </section>

      {/* Task List Search and segmented Filter Toolbar */}
      <section className="dash-nav dash-filters-card">
        <div className="dash-search-container">
          <input
            className="dash-search-input"
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="dash-search-icon">
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        <div className="dash-filter-group">
          <button
            className={`dash-filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`dash-filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`dash-filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </section>

      {/* Task List and Loading/Empty States */}
      <main style={{ minHeight: "150px", position: "relative" }}>
        {isLoading ? (
          <div className="dash-loading">
            <span className="dash-loading-spinner"></span>
            <p>Syncing task database...</p>
          </div>
        ) : filteredTasks && filteredTasks.length > 0 ? (
          <ul className="dash-list">
            {filteredTasks.map((task) => (
              <li key={task.id} className="dash-task-item">
                <div className="dash-task-content">
                  {/* Custom Checkbox */}
                  <label className={`dash-checkbox-wrapper ${task.completed ? "completed" : ""}`}>
                    <input
                      type="checkbox"
                      className="dash-checkbox-hidden"
                      checked={task.completed}
                      onChange={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
                    />
                    <div className="dash-checkbox-custom">
                      <svg viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </label>

                  <span
                    className="dash-task-title"
                    onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="dash-task-actions">
                  {/* Status badge */}
                  <span className={`dash-badge ${task.completed ? "dash-badge-completed" : "dash-badge-pending"}`}>
                    {task.completed ? "Done" : "Pending"}
                  </span>
                  
                  {/* Delete button */}
                  <button
                    className="dash-delete-btn"
                    onClick={() => deleteTask.mutate(task.id)}
                    title="Delete Task"
                  >
                    <svg viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="dash-empty-state">
            <div className="dash-empty-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <h3>No tasks identified</h3>
            <p>
              {search 
                ? "No tasks match your query terms. Refine your search inputs." 
                : filter === "completed" 
                  ? "You have not completed any tasks yet." 
                  : filter === "pending"
                    ? "Great job! All pending tasks are executed."
                    : "Your cognitive schedule is currently empty. Orchestrate a new task to begin."
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}