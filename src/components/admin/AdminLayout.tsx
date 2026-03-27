import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/jobs', label: '채용공고 관리', icon: '📋' },
  { href: '/admin/mentors', label: '멘토 관리', icon: '👥' },
  { href: '/admin/chats', label: '채팅 내역', icon: '💬' },
  { href: '/admin/keywords', label: '키워드 분석', icon: '🔍' },
  { href: '/admin/survey', label: '설문 만족도', icon: '⭐' },
  { href: '/admin/applicants', label: '실제 지원자', icon: '✅' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-kt-gray flex">
      {/* 사이드바 */}
      <aside className="w-56 bg-kt-dark flex-shrink-0 flex flex-col">
        {/* 로고 */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-kt-red rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">KT</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold">관리자</p>
              <p className="text-white/40 text-xs">Admin Console</p>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const isActive =
              href === '/admin'
                ? router.pathname === '/admin'
                : router.pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-kt-red text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 하단 링크 */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>🏠</span>
            <span>사용자 웹으로</span>
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <Image src="/vicdory.gif" alt="빅또리" width={80} height={80} unoptimized />
        </div>
        {children}
      </main>
    </div>
  )
}
