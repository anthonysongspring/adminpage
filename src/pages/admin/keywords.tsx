import Head from 'next/head'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { KEYWORD_STATS } from '@/data/mockChats'

const CATEGORIES = ['전체', '기술', '서류', '면접', '준비', '스펙', '채용']

const CATEGORY_COLORS: Record<string, string> = {
  기술: 'bg-blue-100 text-blue-700',
  서류: 'bg-violet-100 text-violet-700',
  면접: 'bg-amber-100 text-amber-700',
  준비: 'bg-emerald-100 text-emerald-700',
  스펙: 'bg-pink-100 text-pink-700',
  채용: 'bg-orange-100 text-orange-700',
}

const CATEGORY_BAR: Record<string, string> = {
  기술: 'bg-blue-400',
  서류: 'bg-violet-400',
  면접: 'bg-amber-400',
  준비: 'bg-emerald-400',
  스펙: 'bg-pink-400',
  채용: 'bg-orange-400',
}

export default function AdminKeywords() {
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [sortBy, setSortBy] = useState<'count' | 'alpha'>('count')

  const filtered = KEYWORD_STATS
    .filter((k) => categoryFilter === '전체' || k.category === categoryFilter)
    .sort((a, b) =>
      sortBy === 'count' ? b.count - a.count : a.keyword.localeCompare(b.keyword, 'ko')
    )

  const maxCount = Math.max(...filtered.map((k) => k.count), 1)
  const totalMentions = filtered.reduce((s, k) => s + k.count, 0)

  return (
    <>
      <Head>
        <title>KT 관리자 - 키워드 분석</title>
      </Head>
      <AdminLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">키워드 분석</h1>
          <p className="text-sm text-gray-500 mb-8">채팅 메시지에서 추출된 키워드 빈도 분석</p>

          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-gray-900">{KEYWORD_STATS.length}</p>
              <p className="text-sm text-gray-500 mt-1">분석된 키워드</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-gray-900">{KEYWORD_STATS.reduce((s, k) => s + k.count, 0)}</p>
              <p className="text-sm text-gray-500 mt-1">총 언급 횟수</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-kt-red">{KEYWORD_STATS[0]?.keyword}</p>
              <p className="text-sm text-gray-500 mt-1">최다 언급 키워드</p>
            </div>
          </div>

          {/* 워드 클라우드 스타일 */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">키워드 맵</h2>
            <div className="flex flex-wrap gap-2 items-end">
              {[...KEYWORD_STATS]
                .sort((a, b) => b.count - a.count)
                .map((k) => {
                  const size = 12 + Math.round((k.count / maxCount) * 16)
                  const opacity = 0.4 + (k.count / maxCount) * 0.6
                  return (
                    <span
                      key={k.keyword}
                      className="px-3 py-1 rounded-full font-medium cursor-default transition-transform hover:scale-110"
                      style={{
                        fontSize: `${size}px`,
                        backgroundColor: `rgba(172, 57, 71, ${opacity * 0.15})`,
                        color: `rgba(172, 57, 71, ${opacity})`,
                        border: `1px solid rgba(172, 57, 71, ${opacity * 0.3})`,
                      }}
                      title={`${k.count}회 언급`}
                    >
                      {k.keyword}
                    </span>
                  )
                })}
            </div>
          </div>

          {/* 필터 & 정렬 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-kt-red text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-kt-red'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'count' | 'alpha')}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:border-kt-red"
            >
              <option value="count">빈도순</option>
              <option value="alpha">가나다순</option>
            </select>
          </div>

          {/* 바 차트 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">키워드 빈도수</h2>
              <span className="text-xs text-gray-400">총 {totalMentions}회 언급</span>
            </div>
            <div className="space-y-3">
              {filtered.map((k, i) => (
                <div key={k.keyword} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                  <div className="w-20 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900">{k.keyword}</span>
                    </div>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[k.category] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {k.category}
                    </span>
                  </div>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center justify-end pr-3 transition-all ${CATEGORY_BAR[k.category] ?? 'bg-gray-400'}`}
                      style={{ width: `${(k.count / maxCount) * 100}%`, minWidth: '2rem' }}
                    >
                      <span className="text-xs font-bold text-white">{k.count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {((k.count / KEYWORD_STATS.reduce((s, kk) => s + kk.count, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12">해당 카테고리의 키워드가 없습니다.</p>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
