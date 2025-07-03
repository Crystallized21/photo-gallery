"use client"

import {useRef, useState} from "react";
import Link from "next/link";
import {ExternalLink} from "lucide-react";
import {useBackgroundDetection} from "@/hooks/useBackgroundDetection";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  // @ts-ignore this can be null on the first render, but will be set later
  const isDarkBackground = useBackgroundDetection(headerRef);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const textColor = isDarkBackground ? "text-white" : "text-black";
  const hoverColor = isDarkBackground ? "hover:text-gray-300" : "hover:text-gray-600";
  const borderColor = isDarkBackground ? "border-gray-600" : "border-gray-300";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full backdrop-blur-sm"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <Link href="/" className={`text-xl font-medium tracking-tight ${textColor}`}>
            Crystal's Gallery
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-6">
          <div className="hidden md:flex space-x-8">
            <NavLink href="/about" text="ABOUT" textColor={textColor} hoverColor={hoverColor}/>
            <NavLink href="/gallery" text="GALLERY" textColor={textColor} hoverColor={hoverColor}/>
          </div>

          <div className={`hidden md:block h-6 border-l ${borderColor}`}/>

          <div className="flex-shrink-0">
            <Link
              href="https://crystallized.sh"
              className={`flex items-center text-sm font-bold ${textColor} ${hoverColor} transition-colors`}
            >
              DEV WEBSITE
              <ExternalLink className="ml-1 h-3 w-3"/>
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className={`${textColor} ${hoverColor}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>{isMenuOpen ? 'Close menu' : 'Open menu'}</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* TODO: mobile menu (to be implemented) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 py-2">
        </div>
      )}
    </header>
  );
}

function NavLink({href, text, textColor, hoverColor}: {
  href: string;
  text: string;
  textColor: string;
  hoverColor: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center text-sm font-bold ${textColor} ${hoverColor} transition-colors`}
    >
      <span className="mr-2">•</span>
      {text}
    </Link>
  );
}