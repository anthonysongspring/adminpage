import Head from 'next/head'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { MOCK_CHATS, ChatSession } from '@/data/mockChats'
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
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${mm}/${dd} ${hh}:${min}`
}

function formatTime(dt: string) {
  const d = new Date(dt)
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${min}`
}

export default function AdminChats() {
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null)
  const [search, setSearch] = useState('')

  const filtered = MOCK_CHATS.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.userId.toLowerCase().includes(q) ||
      getJobTitle(c.jobId).toLowerCase().includes(q) ||
      (getMentor(c.mentorId)?.name ?? '').toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q))
    )
  }).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

  return (
    <>
      <Head>
        <title>KT 관리자 - 채팅 내역</title>
      </Head>
      <AdminLayout>
        <div className="flex h-screen">
          {/* 목록 패널 */}
          <div className="w-80 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-base font-bold text-gray-900 mb-3">채팅 내역</h1>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                placeholder="사용자, 공고, 멘토, 내용 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-12">검색 결과가 없습니다.</p>
              )}
              {filtered.map((chat) => {
                const mentor = getMentor(chat.mentorId)
                const lastMsg = chat.messages[chat.messages.length - 1]
                const isSelected = selectedChat?.id === chat.id
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors ${
                      isSelected ? 'bg-red-50 border-l-2 border-l-kt-red' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{chat.userId}</span>
                      <span className="text-xs text-gray-400">{formatDate(chat.startedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {getJobTitle(chat.jobId)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        {mentor?.emoji && <img src={mentor.emoji} alt={mentor?.name} className="w-4 h-4 rounded-full object-cover inline" />}
                        {mentor?.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{lastMsg?.content}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 채팅 상세 */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* 채팅 헤더 */}
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-gray-900">{selectedChat.userId}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-600">{getJobTitle(selectedChat.jobId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {(() => {
                        const m = getMentor(selectedChat.mentorId)
                        return <span className="flex items-center gap-1">{m?.emoji && <img src={m.emoji} alt={m?.name} className="w-4 h-4 rounded-full object-cover" />}{m?.name} ({m?.role})</span>
                      })()}
                      <span>·</span>
                      <span>{formatDate(selectedChat.startedAt)} 시작</span>
                      <span>·</span>
                      <span>메시지 {selectedChat.messages.length}개</span>
                    </div>
                  </div>
                </div>

                {/* 메시지 목록 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-kt-gray">
                  {selectedChat.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 bg-kt-dark rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                          {getMentor(selectedChat.mentorId)?.emoji && (
                            <img src={getMentor(selectedChat.mentorId)!.emoji} alt="" className="w-full h-full object-cover rounded-full" />
                          )}
                        </div>
                      )}
                      <div className={`max-w-sm ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-kt-red text-white rounded-tr-sm'
                              : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="text-sm">채팅 세션을 선택해주세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
