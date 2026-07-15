import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Search, Globe, ChevronDown, Sprout, LogOut, FileText, CheckCircle, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import { ROUTES } from '@/constants/routes'

interface NavbarProps {
  onSearchClick: () => void
  onNotificationsClick: () => void
}

export function Navbar({ onSearchClick, onNotificationsClick }: NavbarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { language: activeLang, setLanguage: setActiveLang } = useLanguage()

  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const languages: { code: 'en' | 'hi' | 'mr'; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ]
  const activeLangLabel = languages.find(l => l.code === activeLang)?.label || 'EN'

  // Proportional, high-end, uncluttered link labels
  const links = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Markets', path: ROUTES.MARKET.ROOT },
    { label: 'Weather', path: ROUTES.WEATHER.ROOT },
    { label: 'Logistics', path: ROUTES.TRANSPORT.ROOT },
    { label: 'Subsidies', path: ROUTES.GOVERNMENT.ROOT },
  ]

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#08120E]/90 backdrop-blur-xl border-white/[0.06] shadow-xl'
            : 'bg-[#08120E]/70 backdrop-blur-md border-white/[0.04]'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between h-[72px]">

          {/* ── Brand Logo ── */}
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] group-hover:bg-[#2ECC71] group-hover:text-[#08120E] transition-all duration-300">
              <Sprout size={17} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold tracking-tight text-[15px] text-white">
                KrishiMitra <span className="text-[#43F59A] font-black">AI</span>
              </span>
              <span className="text-[8px] font-bold tracking-widest uppercase text-zinc-500 mt-0.5 font-mono">Agriculture & AI</span>
            </div>
          </Link>

          {/* ── Desktop Nav Links (Clean, Title-Case, Proportional) ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(link => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-[13.5px] font-medium tracking-wide transition-all duration-150 relative ${
                    active
                      ? 'text-[#43F59A] font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="navActiveLine"
                      className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#43F59A] rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Search */}
            <button
              onClick={onSearchClick}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <Search size={14} />
            </button>

            {/* Notifications */}
            <button
              onClick={onNotificationsClick}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-zinc-400 hover:text-white relative transition-all cursor-pointer"
            >
              <Bell size={14} />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#43F59A] border border-[#08120E]" />
            </button>

            {/* Language dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-[11px] font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer font-mono"
              >
                <Globe size={13} className="text-zinc-500" />
                {activeLangLabel}
                <ChevronDown size={9} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-36 bg-[#08120E]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/[0.08] p-1.5 z-50 font-mono"
                    >
                      {languages.map(l => (
                        <button
                          key={l.code}
                          onClick={() => { setActiveLang(l.code); localStorage.setItem('km_lang', l.code); setLangOpen(false) }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            activeLang === l.code
                              ? 'bg-[#2ECC71]/10 text-[#43F59A] font-bold'
                              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* AI Assistant CTA (Whitespace nowrap, padding balanced) */}
            <Link
              to={ROUTES.AI_ASSISTANT}
              className="hidden sm:flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-[#2ECC71] to-[#43F59A] text-[#08120E] shadow-lg shadow-[#2ECC71]/10 hover:shadow-[#2ECC71]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-mono whitespace-nowrap shrink-0"
            >
              Ask AI
              <ChevronRight size={12} className="stroke-[3]" />
            </Link>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative pl-2.5 border-l border-white/[0.08] flex items-center">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <Avatar name={user.farmer_profile?.full_name ?? user.email} size="sm" className="border border-white/[0.08]" />
                  <ChevronDown size={10} className={`transition-transform text-zinc-500 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-3 w-56 bg-[#08120E]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/[0.08] p-1.5 z-50"
                      >
                        <div className="px-3 py-2.5 border-b border-white/[0.04] mb-1">
                          <p className="font-bold text-[13px] text-white">{user.farmer_profile?.full_name ?? 'Farmer'}</p>
                          <p className="text-[10.5px] text-zinc-500 truncate font-mono mt-0.5">{user.email}</p>
                          <span className="mt-2 inline-flex items-center gap-1 text-[8.5px] px-2.5 py-0.5 bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] rounded-full font-black uppercase tracking-wider font-mono">
                            <CheckCircle size={8} /> KYC OK
                          </span>
                        </div>
                        <Link
                          to={ROUTES.SETTINGS.ROOT}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors font-medium"
                        >
                          <FileText size={13} className="text-zinc-500" /> Settings
                        </Link>
                        <button
                          onClick={() => { setProfileOpen(false); logout() }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer font-medium"
                        >
                          <LogOut size={13} className="text-rose-500" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile navigation menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-[#08120E]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl p-4 flex flex-col gap-1"
          >
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 rounded-xl text-[13px] font-black uppercase tracking-wider transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#2ECC71]/10 text-[#43F59A] border border-[#2ECC71]/10'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
