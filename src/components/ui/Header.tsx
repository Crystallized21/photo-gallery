"use client"

import {useRef, useState} from "react"
import Link from "next/link"
import {ExternalLink} from "lucide-react"

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const textColor = "text-white"
  const hoverColor = "hover:text-gray-200"
  const borderColor = "border-white/30"
  const bgColor = "bg-black/10"

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-500 ${bgColor}`}
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <Link
            href="/"
            className={`text-xl font-stretch-125% font-bold tracking-tight transition-all duration-500 ${textColor} opacity-100`}
          >
            CRYSTAL'S GALLERY
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-6">
          <div className="hidden md:flex space-x-8">
            <NavLink href="/about" text="ABOUT" textColor={textColor} hoverColor={hoverColor}/>
            <NavLink href="/gallery" text="GALLERY" textColor={textColor} hoverColor={hoverColor}/>
          </div>

          <div className={`hidden md:block h-6 border-l transition-colors duration-500 ${borderColor}`}/>

          <div className="flex-shrink-0">
            <Link
              href="https://crystallized.sh"
              className={`flex items-center text-sm font-bold transition-all duration-500 ${textColor} ${hoverColor}`}
            >
              DEV WEBSITE
              <ExternalLink className="ml-1 h-3 w-3"/>
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className={`transition-all duration-500 ${textColor} ${hoverColor}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>{isMenuOpen ? "Close menu" : "Open menu"}</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          className="md:hidden px-4 py-2 backdrop-blur-md transition-all duration-500 bg-black/20"
        >
          <div className="space-y-2">
            <div className="block py-2">
              <NavLink href="/about" text="ABOUT" textColor={textColor} hoverColor={hoverColor}/>
            </div>
            <div className="block py-2">
              <NavLink href="/gallery" text="GALLERY" textColor={textColor} hoverColor={hoverColor}/>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  text,
  textColor,
  hoverColor,
}: {
  href: string
  text: string
  textColor: string
  hoverColor: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center text-sm font-bold transition-all duration-500 ${textColor} ${hoverColor}`}
    >
      <span className="mr-2">•</span>
      {text}
    </Link>
  )
}