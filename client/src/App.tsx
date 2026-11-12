import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
// Define project interface: import form sevices/projectService.ts
import { getProjects } from "./services/projectService";
import type { Project } from "./types/projects";

// import Sections
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Journey from "./sections/Journey";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

import AdminLogin from "./pages/AdminLogin"; // Import the AdminLogin component
import AdminDashboard from "./pages/AdminDashboard"; // Import the AdminDashboard component

function PublicPortfolio() {
  //const [count, setCount] = useState(0)
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string>("Connecting...");

  useEffect(() => {
    // Fetch projects from the backend API
    // const fetchProjects = async () => {
    const loadProjects = async () => {
      try {
        // const response = await fetch('/api/projects')
        const data = await getProjects();
        console.log("Public portfolio projects:", data);

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`)
        // }

        // const result = await response.json()
        // setProjects(result.data)
        setProjects(data);
        // console.log("Projects received from API:", data);
        // console.log("Number of projects:", data.length);
        setApiStatus("Connected");
      } catch (error) {
        console.error("Failed to fetch projects:", error);

        setApiStatus(
          "Backend API is not reachable. Please ensure the server is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // moved skills array from App.tsx to Skills.tsx

  // debug
  // console.log("Projects state:", projects);
  // console.log("Loading state:", loading);
  // console.log("API status:", apiStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <a
        href="#main-content"
        className="absolute left-4 top-[-100px] z-50 rounded-lg bg-blue-600 px-4 py-3 text-white focus:top-4"
      >
        Skip to main content
      </a>
      {/* Navigation */}
      <header>
        <Navbar />
      </header>

      {/* Main page content */}
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects projects={projects} loading={loading} apiStatus={apiStatus} />
        <Journey />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPortfolio />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;

{
  /* <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button> */
}
