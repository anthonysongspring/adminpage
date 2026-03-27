import Head from 'next/head'
import AdminLayout from '@/components/admin/AdminLayout'
import { SURVEY_RESULTS } from '@/data/mockChats'
import { JOBS } from '@/data/jobs'
import { MENTORS } from '@/data/mentors'

function getJobTitle(jobId: string) {
  return JOBS.find((j) => j.id === jobId)?.title ?? jobId
}

function getMentor(mentorId: string) {
  return MENTORS.find((m) => m.id === mentorId)
}

function formatDate(dt: string) {
  const d = new Date(dt)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}/${dd}`
}

const totalCount = 230
const helpfulCount = 225
const avgRating = 4.7
const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
  star,
  count: SURVEY_RESULTS.filter((r) => r.rating === star).length,
}))

const MENTOR_AVG = [
  { name: '빅', emoji: '/vic.png', avg: 4.8, count: 115 },
  { name: '또리', emoji: '/dory.png', avg: 4.5, count: 115 },
]

const RATING_COLOR: Record<number, string> = {
  5: 'bg-emerald-500',
  4: 'bg-blue-400',
  3: 'bg-amber-400',
  2: 'bg-orange-400',
  1: 'bg-red-500',
}

export default function AdminSurvey() {
  return (
    <>
      <Head>
        <title>KT 관리자 - 설문 만족도</title>
      </Head>
      <AdminLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">설문 만족도 조사 결과</h1>
          <p className="text-sm text-gray-500 mb-8">채팅 종료 후 수집된 사용자 만족도 데이터</p>

          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-4xl font-bold text-kt-red">{avgRating.toFixed(1)}</p>
              <div className="flex justify-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              <p className="text-sm text-gray-500">평균 별점 ({totalCount}건)</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-4xl font-bold text-emerald-500">{helpfulCount}</p>
              <p className="text-sm text-gray-500 mt-2">도움됐다고 응답</p>
              <p className="text-xs text-gray-400 mt-0.5">{Math.round((helpfulCount / totalCount) * 100)}% 긍정 응답</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-4xl font-bold text-gray-900">{totalCount}</p>
              <p className="text-sm text-gray-500 mt-2">총 응답 수</p>
              <p className="text-xs text-gray-400 mt-0.5">전체 채팅 대비 100%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 별점 분포 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">별점 분포</h2>
              <div className="space-y-3">
                {ratingDist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium text-gray-700">{star}</span>
                      <span className="text-yellow-400 text-sm">★</span>
                    </div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${RATING_COLOR[star]}`}
                        style={{ width: `${totalCount ? (count / totalCount) * 100 : 0}%`, minWidth: count ? '1.5rem' : 0 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}건</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 멘토별 평균 별점 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">멘토별 평균 별점</h2>
              <div className="space-y-4">
                {MENTOR_AVG.map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                      <img src={m.emoji} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{m.name}</span>
                        <span className="text-sm font-bold text-gray-700">{m.avg > 0 ? m.avg.toFixed(1) : '-'} ★</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${(m.avg / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{m.count}건 응답</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상세 응답 목록 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">개별 응답 내역</h2>
            <div className="space-y-4">
              {SURVEY_RESULTS.map((r) => {
                const mentor = getMentor(r.mentorId)
                return (
                  <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{r.userId}</span>
                        <span className="text-gray-400 text-xs">·</span>
                        <span className="text-xs text-gray-500">{getJobTitle(r.jobId)}</span>
                        <span className="text-gray-400 text-xs">·</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          {mentor?.emoji && <img src={mentor.emoji} alt={mentor?.name} className="w-4 h-4 rounded-full object-cover" />}
                          {mentor?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            r.helpful ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {r.helpful ? '도움됨' : '도움안됨'}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(r.submittedAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`text-base ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                    {r.comment && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{r.comment}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
