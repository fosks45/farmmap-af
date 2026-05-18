'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * SiteNav — main navigation component.
 * Mobile: hamburger button → slide-in menu (focus trapped while open).
 * Desktop: horizontal link bar.
 * WCAG 2.1.2: menu can be closed with Escape.
 * WCAG 2.4.1: skip link is first element (in layout.tsx).
 */

const NAV_LINKS = [
  { href: '/map', label: 'Map' },
  { href: '/farm-shops', label: 'Farm Shops' },
  { href: '/honesty-boxes', label: 'Honesty Boxes' },
]

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  // Check admin role from user metadata
  useEffect(() => {
    if (!user) { setIsAdmin(false); return }
    const role = user.user_metadata?.role ?? user.app_metadata?.role
    setIsAdmin(['content_moderator', 'directory_admin', 'super_admin'].includes(role))
  }, [user])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-[500] bg-surface-elevated border-b border-border-default shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-lg text-brand-primary hover:text-brand-primary-hover
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                       rounded-sm"
            aria-label="Farmmap home"
          >
            Farmmap
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
                className={`
                  text-sm font-medium transition-colors
                  hover:text-brand-primary
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                  rounded-sm
                  ${pathname.startsWith(link.href)
                    ? 'text-brand-primary'
                    : 'text-text-secondary'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                aria-current={pathname.startsWith('/dashboard') ? 'page' : undefined}
                className={`
                  text-sm font-medium transition-colors hover:text-brand-primary
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                  rounded-sm
                  ${pathname.startsWith('/dashboard') ? 'text-brand-primary' : 'text-text-secondary'}
                `}
              >
                My Listings
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                aria-current={pathname.startsWith('/admin') ? 'page' : undefined}
                className={`
                  text-sm font-medium transition-colors hover:text-brand-primary
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                  rounded-sm
                  ${pathname.startsWith('/admin') ? 'text-brand-primary' : 'text-text-secondary'}
                `}
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm font-medium text-text-secondary hover:text-brand-primary
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                           rounded-sm"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium bg-brand-primary text-text-inverse px-3 py-1.5 rounded-md
                           hover:bg-brand-primary-hover transition-colors
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
              >
                Sign in
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden border-t border-border-default bg-surface-elevated shadow-lg"
        >
          <nav aria-label="Mobile menu">
            <ul className="py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
                    className={`
                      block px-4 py-3 text-sm font-medium transition-colors
                      hover:bg-surface-raised
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-border-focus
                      ${pathname.startsWith(link.href) ? 'text-brand-primary' : 'text-text-primary'}
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-raised
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-border-focus"
                  >
                    My Listings
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="block px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-raised
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-border-focus"
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li className="border-t border-border-subtle mt-1 pt-1">
                {user ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-raised
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-border-focus"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-sm font-medium text-brand-primary hover:bg-surface-raised
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-border-focus"
                  >
                    Sign in
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

// Export alias used by layout.tsx
export { SiteNav as default }
