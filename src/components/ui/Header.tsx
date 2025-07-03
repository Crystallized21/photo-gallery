import Link from "next/link";
import {ExternalLink} from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <Link href="/public" className="text-xl tracking-tight text-black">
            Crystallized Gallery
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-6">
          {/* navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/projects"
              className="flex items-center text-sm font-bold text-black hover:text-gray-600 transition-colors"
            >
              <span className="mr-2">•</span>
              PROJECTS
            </Link>
            <Link
              href="/about"
              className="flex items-center text-sm font-bold text-black hover:text-gray-600 transition-colors"
            >
              <span className="mr-2">•</span>
              ABOUT
            </Link>
            <Link
              href="/contact"
              className="flex items-center text-sm font-bold text-black hover:text-gray-600 transition-colors"
            >
              <span className="mr-2">•</span>
              CONTACT
            </Link>
          </div>

          {/* divider */}
          <div className="hidden md:block h-6 border-l border-gray-300"/>

          <div className="flex-shrink-0">
            <Link
              href="/dev"
              className="flex items-center text-sm font-bold text-black hover:text-gray-600 transition-colors"
            >
              DEV WEBSITE
              <ExternalLink className="ml-1 h-3 w-3"/>
            </Link>
          </div>
        </div>

        {/* expand this later */}
        <div className="md:hidden">
          <button type="button" className="text-black hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>Open menu</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}