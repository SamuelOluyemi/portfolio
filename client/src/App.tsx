import { useEffect, useState } from "react";

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

function App() {
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

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`)
        // }

        // const result = await response.json()
        // setProjects(result.data)
        setProjects(data);
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
