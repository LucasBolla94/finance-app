"use client";

interface SidebarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const linkStyle =
  "block rounded px-3 py-2 text-gray-700 hover:bg-blue-100 whitespace-nowrap";

export default function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed z-40 h-full w-64 transform bg-white p-6 shadow-md transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h2 className="mb-6 text-xl font-bold text-blue-600">My Panel</h2>

      <nav className="space-y-4 text-sm">
        <a className={linkStyle} href="/dash">
          📊 Dashboard
        </a>
        <a className={linkStyle} href="/dash/income">
          ➕ Add&nbsp;Income
        </a>
        <a className={linkStyle} href="#">
          💸 Expenses
        </a>
        <a className={linkStyle} href="#">
          📅 Calendar
        </a>
        <a className={linkStyle} href="#">
          ⚙️ Settings
        </a>
      </nav>

      <button
        onClick={() => setOpen(false)}
        className="absolute right-4 top-4 sm:hidden"
      >
        ✕
      </button>
    </aside>
  );
}
