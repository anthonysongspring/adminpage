import Head from 'next/head'
import AdminLayout from '@/components/admin/AdminLayout'
import { JOBS } from '@/data/jobs'
import { MENTORS } from '@/data/mentors'
import { MOCK_CHATS } from '@/data/mockChats'

const STAT_CARDS = [
  {
    label: '총 채용공고',
    value: JOBS.length,
    sub: '등록된 공고 수',
    color: 'bg-blue-500',
    icon: '📋',
  },
  {
    label: '총 멘토',
    value: MENTORS.length,
    sub: '활성 멘토 수',
    color: 'bg-emerald-500',
    icon: '👥',
  },
  {
    label: '총 채팅 세션',
    value: MOCK_CHATS.length,
    sub: '누적 대화 수',
    color: 'bg-violet-500',
    icon: '💬',
  },
  {
    label: '총 메시지',
    value: MOCK_CHATS.reduce((acc, c) => acc + c.messages.length, 0),
    sub: '누적 메시지 수',
    color: 'bg-kt-red',
    icon: '✉️',
  },
]

const JOB_CHAT_COUNT = JOBS.map((job) => ({
  title: job.title,
  count: MOCK_CHATS.filter((c) => c.jobId === job.id).length,
})).sort((a, b) => b.count - a.count)

const MAX_JOB_COUNT = Math.max(...JOB_CHAT_COUNT.map((j) => j.count), 1)

const MENTOR_CHAT_COUNT = MENTORS.map((m) => ({
  name: m.name,
  emoji: m.emoji,
  count: MOCK_CHATS.filter((c) => c.mentorId === m.id).length,
})).sort((a, b) => b.count - a.count)

const RECENT_CHATS = [...MOCK_CHATS]
  .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
  .slice(0, 5)

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getJobTitle(jobId: string) {
  return JOBS.find((j) => j.id === jobId)?.title ?? jobId
}

function getMentorName(mentorId: string) {
  return MENTORS.find((m) => m.id === mentorId)?.name ?? mentorId
}

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>KT 관리자 - 대시보드</title>
      </Head>
      <AdminLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">대시보드</h1>
          <p className="text-sm text-gray-500 mb-8">KT 채용 어드바이저 현황 요약</p>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className={`${s.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                    {s.sub}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 공고별 채팅 수 */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">공고별 채팅 수</h2>
              <div className="space-y-3">
                {JOB_CHAT_COUNT.map((j) => (
                  <div key={j.title}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{j.title}</span>
                      <span className="font-medium text-gray-900">{j.count}건</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-kt-red rounded-full transition-all"
                        style={{ width: `${(j.count / MAX_JOB_COUNT) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 멘토별 채팅 수 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">멘토별 채팅 수</h2>
              <div className="space-y-4">
                {MENTOR_CHAT_COUNT.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.count}건의 채팅</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        i === 0 ? 'bg-kt-red text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 최근 채팅 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">최근 채팅 세션</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">사용자</th>
                  <th className="pb-3 font-medium">채용공고</th>
                  <th className="pb-3 font-medium">멘토</th>
                  <th className="pb-3 font-medium">메시지 수</th>
                  <th className="pb-3 font-medium">시작 시간</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_CHATS.map((chat) => (
                  <tr key={chat.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-gray-900 font-medium">{chat.userId}</td>
                    <td className="py-3 text-gray-600">{getJobTitle(chat.jobId)}</td>
                    <td className="py-3 text-gray-600">{getMentorName(chat.mentorId)}</td>
                    <td className="py-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {chat.messages.length}개
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{formatDate(chat.startedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
