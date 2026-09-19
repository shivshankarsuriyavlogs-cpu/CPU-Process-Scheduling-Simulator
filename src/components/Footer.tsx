import { Cpu } from 'lucide-react';

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-white block">
                CPU Process Scheduling Simulator
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                An interactive Operating Systems learning tool.
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a
              href="#simulator"
              onClick={(e) => handleScrollTo(e, '#simulator')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Simulator
            </a>
            <a
              href="#gantt"
              onClick={(e) => handleScrollTo(e, '#gantt')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Gantt Chart
            </a>
            <a
              href="#comparison"
              onClick={(e) => handleScrollTo(e, '#comparison')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Comparison
            </a>
            <a
              href="#algorithms"
              onClick={(e) => handleScrollTo(e, '#algorithms')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Algorithms
            </a>
            <a
              href="#formulas"
              onClick={(e) => handleScrollTo(e, '#formulas')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Formulas
            </a>
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, '#about')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </a>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© 2026 CPU Process Scheduling Simulator. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed for Operating Systems &amp; Computer Science Education
          </p>
        </div>
      </div>
    </footer>
  );
}
