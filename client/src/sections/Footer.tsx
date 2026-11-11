{
  /* Footer Section */
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} My Developer Portfolio. Built with React,
      TypeScript and Tailwind CSS.
    </footer>
  );

}

export default Footer;