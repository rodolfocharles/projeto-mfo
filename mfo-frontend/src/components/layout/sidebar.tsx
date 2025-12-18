    // src/components/layout/sidebar.tsx
    'use client'

    import React from 'react'
    import Link from 'next/link'
    import { usePathname } from 'next/navigation'
    import { LayoutDashboard, DollarSign, History, BarChart2 } from 'lucide-react'
    import { cn } from '@/lib/utils' // Certifique-se de que '@/lib/utils' está correto

    export function Sidebar() {
      const pathname = usePathname()

      const navItems = [
        {
          name: 'Dashboard',
          href: '/',
          icon: LayoutDashboard,
        },
        {
          name: 'Alocações',
          href: '/allocations',
          icon: DollarSign,
        },
        {
          name: 'Projeção',
          href: '/projection',
          icon: BarChart2,
        },
        {
          name: 'Histórico',
          href: '/history',
          icon: History,
        },
      ]

      return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 flex flex-col shadow-md">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-8">MFO App</div>
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-gray-900 dark:hover:text-white',
                      {
                        'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white': pathname === item.href,
                      }
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )
    }
