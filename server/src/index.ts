import express from "express";

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Projects and Endpoint
const projects = [
  {
    id: 1,
    title: "Marketing & Advertising Platform",
    description:
      "A full-stack web application built to support over 5,000 users, featuring a React frontend and a Node.js backend.",
    technologies: [
      "React",
      "Node.js",
      "JavaScript",
      "Express",
      "MongoDB",
      "TailwindCSS",
    ],
    category: "Full Stack Development",
    githubUrl: "",
    liveDemoUrl: "",
    imageUrl: "",
  },
  {
    id: 2,
    title: "Tech Blog Application",
    description:
      "An interactive technology blog featuring user registration, authentication, article publishing, comments, and admin functionality.",
    technologies: ["Web Development", "Authentication", "CRUD"],
    category: "Full-Stack Development",
    githubUrl: "https://github.com/SamuelOluyemi/Tech-Blog-World.git",
    liveDemoUrl: "",
    imageUrl: "/images/tech-blog-home.png",
  },
];

app.get("/api/projects", (_req, res) => {
  res.status(200).json({
    success: true,
    data: projects,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
