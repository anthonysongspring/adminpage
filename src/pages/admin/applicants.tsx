import Head from 'next/head'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { APPLICANT_RECORDS } from '@/data/mockChats'
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

const totalChatters = 230
const appliedCount = 190
const conversionRate = Math.round((appliedCount / totalChatters) * 100)

const JOB_STATS = JOBS.map((job) => {
  const records = APPLICANT_RECORDS.filter((r) => r.jobId === job.id)
  const applied = records.filter((r) => r.applied).length
  return {
    title: job.title,
    total: records.length,
    applied,
    rate: records.length ? Math.round((applied / records.length) * 100) : 0,
  }
}).sort((a, b) => b.rate - a.rate)

const RESULT_COLOR: Record<string, string> = {
  서류통과: 'bg-blue-100 text-blue-700',
  최종합격: 'bg-emerald-100 text-emerald-700',
  불합격: 'bg-red-100 text-red-600',
  검토중: 'bg-amber-100 text-amber-700',
}

type Filter = '전체' | '지원' | '미지원'

export default function AdminApplicants() {
  const [filter, setFilter] = useState<Filter>('전체')

  const filtered = APPLICANT_RECORDS.filter((r) => {
    if (filter === '지원') return r.applied
    if (filter === '미지원') return !r.applied
    return true
  })

  return (
    <>
      <Head>
        <title>KT 관리자 - 실제 지원자</title>
      </Head>
      <AdminLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">채팅자 중 실제 지원자 수</h1>
          <p className="text-sm text-gray-500 mb-8">멘토 채팅 후 실제 채용공고에 지원한 사용자 현황</p>

          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-4xl font-bold text-gray-900">{totalChatters}</p>
              <p className="text-sm text-gray-500 mt-2">총 채팅 사용자</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-4xl font-bold text-kt-red">{appliedCount}</p>
              <p className="text-sm text-gray-500 mt-2">실제 지원자</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-4xl font-bold text-emerald-500">{conversionRate}%</p>
              <p className="text-sm text-gray-500 mt-2">채팅 → 지원 전환율</p>
            </div>
          </div>

          {/* 공고별 지원 현황 */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">공고별 지원 전환율</h2>
            <div className="space-y-4">
              {JOB_STATS.map((job) => (
                <div key={job.title}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{job.title}</span>
                    <div className="flex items-center gap-3 text-gray-500">
                      <span>채팅 {job.total}명 → 지원 {job.applied}명</span>
                      <span className="font-bold text-gray-900">{job.rate}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-kt-red rounded-full transition-all"
                      style={{ width: `${job.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 사용자 목록 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">사용자별 상세 현황</h2>
              <div className="flex gap-2">
                {(['전체', '지원', '미지원'] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      filter === f
                        ? 'bg-kt-red text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">사용자</th>
                  <th className="px-4 py-3 font-medium">채용공고</th>
                  <th className="px-4 py-3 font-medium">멘토</th>
                  <th className="px-4 py-3 font-medium">채팅일</th>
                  <th className="px-4 py-3 font-medium">지원 여부</th>
                  <th className="px-4 py-3 font-medium">지원일</th>
                  <th className="px-4 py-3 font-medium">결과</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const mentor = getMentor(r.mentorId)
                  return (
                    <tr key={r.userId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3.5 font-medium text-gray-900">{r.userId}</td>
                      <td className="px-4 py-3.5 text-gray-600">{getJobTitle(r.jobId)}</td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {mentor?.emoji} {mentor?.name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{formatDate(r.chatDate)}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            r.applied
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {r.applied ? '지원함' : '미지원'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {r.appliedAt ? formatDate(r.appliedAt) : '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        {r.result ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RESULT_COLOR[r.result]}`}>
                            {r.result}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
