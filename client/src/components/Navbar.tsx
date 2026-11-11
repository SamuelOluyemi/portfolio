{
  /* Navbar */
}


import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight"
          onClick={closeMenu}
        >
          Dev<span className="text-blue-500">Portfolio.</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#about" className="hover:text-blue-400">
            About
          </a>
          <a href="#skills" className="hover:text-blue-400">
            Skills
          </a>
          <a href="#projects" className="hover:text-blue-400">
            Projects
          </a>
          <a href="#journey" className="hover:text-blue-400">
            Journey
          </a>
          <a href="#contact" className="hover:text-blue-400">
            Contact
          </a>
        </div>

        {/* Desktop Contact Button */}
        <a
          href="#contact"
          className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 md:inline-flex"
        >
          Let's Connect
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="text-2xl text-slate-300 hover:text-blue-400 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-800 bg-slate-950 px-6 py-5 md:hidden"
        >
          <div className="flex flex-col gap-5 text-sm text-slate-300">
            <a
              href="#about"
              className="hover:text-blue-400, hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              onClick={closeMenu}
            >
              About
            </a>
            <a
              href="#skills"
              className="hover:text-blue-400, hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              onClick={closeMenu}
            >
              Skills
            </a>
            <a
              href="#projects"
              className="hover:text-blue-400, hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              onClick={closeMenu}
            >
              Projects
            </a>
            <a
              href="#journey"
              className="hover:text-blue-400, hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              onClick={closeMenu}
            >
              Journey
            </a>
            <a
              href="#contact"
              className="hover:text-blue-400, hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              onClick={closeMenu}
            >
              Contact
            </a>

            <a
              href="#contact"
              className="rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
              onClick={closeMenu}
            >
              Let's Connect
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
