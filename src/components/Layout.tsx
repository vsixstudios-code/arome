import { Outlet, NavLink } from 'react-router-dom';
import { Home, Library, Scan, MessageSquare, User } from 'lucide-react';

export default function Layout() {
  return (
    <div
      className="flex flex-col h-screen font-sans antialiased"
      style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
    >
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 w-full backdrop-blur-md border-t px-6 py-4 flex justify-between items-center z-50 pb-[max(env(safe-area-inset-bottom),1rem)]"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 85%, transparent)',
          borderColor: 'color-mix(in srgb, var(--color-border) 30%, transparent)',
        }}
      >
        <NavItem to="/" icon={<Home size={22} strokeWidth={1.5} />} label="Home" />
        <NavItem to="/catalog" icon={<Library size={22} strokeWidth={1.5} />} label="Wardrobe" />
        <NavItem to="/scanner" icon={<Scan size={22} strokeWidth={1.5} />} label="Scan" />
        <NavItem to="/chat" icon={<MessageSquare size={22} strokeWidth={1.5} />} label="Ask AI" />
        <NavItem to="/profile" icon={<User size={22} strokeWidth={1.5} />} label="Profile" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1.5 transition-all duration-300 ${
          isActive ? 'nav-item-active' : 'nav-item-inactive'
        }`
      }
    >
      <div className="transition-transform duration-300 active:scale-90">
        {icon}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-[0.1em]">{label}</span>
    </NavLink>
  );
}
