import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type TaskStatus = "pending" | "in_progress" | "completed";
type TaskPriority = "low" | "medium" | "high";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
};

type TaskForm = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
};

export default function TasksPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
      const res = await api.get(`/tasks${query}`);
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      due_date: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, form);
      } else {
        await api.post("/tasks", form);
      }
      resetForm();
      fetchTasks();
    } catch (e) {
      alert("Error saving task");
    }
  };

  const handleEdit = (task: Task) => {
    // IMPORTANT: only map allowed fields (DTO whitelist)
    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? "pending",
      priority: task.priority ?? "medium",
      due_date: task.due_date ?? "",
    });

    setEditingId(task.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("Delete this task?");
    if (!ok) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      alert("Error deleting task");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.appTitle}>Task Manager</div>
            <div style={styles.subtitle}>Manage tasks with status & priority</div>
          </div>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <h2 style={styles.h2}>My Tasks</h2>

            <div style={styles.filters}>
              {(["all", "pending", "in_progress", "completed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s as any)}
                  style={{
                    ...styles.filterBtn,
                    ...(statusFilter === s ? styles.filterBtnActive : {}),
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            style={styles.primaryBtn}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Close" : "+ New Task"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formRow}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                placeholder="e.g. Finish backend setup"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div style={styles.formRow}>
              <label style={styles.label}>Description</label>
              <input
                style={styles.input}
                placeholder="Optional"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formRow}>
                <label style={styles.label}>Priority</label>
                <select
                  style={styles.input}
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as TaskPriority })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.input}
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as TaskStatus })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>Due date</label>
                <input
                  type="date"
                  style={styles.input}
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.formActions}>
              <button style={styles.saveBtn} onClick={handleSave}>
                {editingId ? "Update Task" : "Save Task"}
              </button>
              <button style={styles.secondaryBtn} onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : tasks.length === 0 ? (
          <div style={styles.empty}>No tasks found.</div>
        ) : (
          <div style={styles.grid}>
            {tasks.map((t) => (
              <div key={t.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>{t.title}</div>
                  <span style={priorityBadge(t.priority)}>{t.priority}</span>
                </div>

                {t.description ? (
                  <div style={styles.cardDesc}>{t.description}</div>
                ) : (
                  <div style={styles.cardDescMuted}>No description</div>
                )}

                <div style={styles.cardFooter}>
                  <span style={statusBadge(t.status)}>{t.status}</span>

                  <div style={styles.cardActions}>
                    <button style={styles.editBtn} onClick={() => handleEdit(t)}>
                      Edit
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                {t.due_date && <div style={styles.due}>Due: {t.due_date}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- Styles -------------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "24px 16px",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    padding: "16px 16px",
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    marginBottom: 18,
  },
  appTitle: {
    fontWeight: 800,
    fontSize: 18,
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  logoutBtn: {
    padding: "8px 12px",
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    padding: "16px 16px",
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    marginBottom: 18,
  },
  toolbarLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  h2: {
    margin: 0,
    fontSize: 18,
  },
  filters: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    cursor: "pointer",
    fontWeight: 600,
    color: "#111827",
  },
  filterBtnActive: {
    background: "#2563eb",
    border: "1px solid #2563eb",
    color: "white",
  },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#10b981",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    height: 40,
  },

  formCard: {
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: 16,
    marginBottom: 18,
  },
  formRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#374151",
    fontWeight: 700,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 8,
  },
  formActions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 8,
    flexWrap: "wrap",
  },
  saveBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    cursor: "pointer",
    fontWeight: 700,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
  },
  card: {
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardTitle: {
    fontWeight: 800,
    color: "#111827",
  },
  cardDesc: {
    color: "#374151",
  },
  cardDescMuted: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  cardActions: {
    display: "flex",
    gap: 8,
  },
  editBtn: {
    padding: "6px 10px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
  deleteBtn: {
    padding: "6px 10px",
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
  due: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },

  loading: {
    padding: 16,
    color: "#374151",
  },
  empty: {
    padding: 16,
    color: "#6b7280",
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
};

function statusBadge(status: TaskStatus): React.CSSProperties {
  const colors: Record<TaskStatus, string> = {
    pending: "#f59e0b",
    in_progress: "#3b82f6",
    completed: "#10b981",
  };

  return {
    backgroundColor: colors[status],
    color: "white",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    textTransform: "none",
  };
}

function priorityBadge(priority: TaskPriority): React.CSSProperties {
  const colors: Record<TaskPriority, string> = {
    low: "#6b7280",
    medium: "#2563eb",
    high: "#ef4444",
  };

  return {
    backgroundColor: colors[priority],
    color: "white",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    textTransform: "none",
  };
}