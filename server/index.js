require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const { PrismaClient } = require("@prisma/client");

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

let refreshTokens = [];

// ---------- Middleware ----------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// ---------- Auth Routes ----------
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ error: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role: role === "admin" ? "admin" : "user" },
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during registration" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid username or password" });

    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
    refreshTokens.push(refreshToken);

    res.status(200).json({ message: "Login successful", accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during login" });
  }
});

app.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired refresh token" });
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken: newAccessToken });
  });
});

app.get("/auth/profile", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Profile fetched successfully", user: req.user });
});

// ---------- Task Routes (protected, user-specific) ----------
app.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching tasks" });
  }
});

app.get("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching the task" });
  }
});

app.post("/tasks", authenticateToken, async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const task = await prisma.task.create({
      data: { title, completed: completed || false, userId: req.user.id },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong creating the task" });
  }
});

app.put("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: "Task not found" });

    const { title, completed } = req.body;
    const task = await prisma.task.update({
      where: { id: existing.id },
      data: {
        title: title !== undefined ? title : existing.title,
        completed: completed !== undefined ? completed : existing.completed,
      },
    });
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong updating the task" });
  }
});

app.delete("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: "Task not found" });

    await prisma.task.delete({ where: { id: existing.id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong deleting the task" });
  }
});

// ---------- AI Chat Route (protected, uses task context) ----------
app.post("/api/chat", authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
    const taskSummary = tasks.length
      ? tasks.map((t) => `- ${t.title} (${t.completed ? "done" : "pending"})`).join("\n")
      : "No tasks yet.";

    const systemPrompt = `You are a helpful task management assistant. Here is the user's current task list:\n${taskSummary}\n\nAnswer questions or give suggestions based on this list.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong generating a response" });
  }
});

app.get("/", (req, res) => {
  res.send("AI Task Assistant backend is running");
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});