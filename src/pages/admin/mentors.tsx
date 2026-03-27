import Head from 'next/head'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { MENTORS } from '@/data/mentors'
import { Mentor } from '@/types/mentor'

const EMOJIS = ['🖥️', '📋', '🚀', '💡', '🎯', '🌟', '📊', '🔧', '💼', '🏆']

const EMPTY_FORM: Omit<Mentor, 'id'> = {
  name: '',
  role: '',
  career: '',
  tags: [],
  emoji: '🖥️',
}

export default function AdminMentors() {
  const [mentors, setMentors] = useState<Mentor[]>(MENTORS)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Mentor | null>(null)
  const [form, setForm] = useState<Omit<Mentor, 'id'>>(EMPTY_FORM)
  const [tagInput, setTagInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setTagInput('')
    setShowModal(true)
  }

  function openEdit(mentor: Mentor) {
    setEditTarget(mentor)
    setForm({ name: mentor.name, role: mentor.role, career: mentor.career, tags: [...mentor.tags], emoji: mentor.emoji })
    setTagInput('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditTarget(null)
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
  }

  function handleSave() {
    if (!form.name || !form.role) return
    if (editTarget) {
      setMentors((prev) => prev.map((m) => (m.id === editTarget.id ? { ...editTarget, ...form } : m)))
    } else {
      const newId = `mentor-${Date.now()}`
      setMentors((prev) => [...prev, { id: newId, ...form }])
    }
    closeModal()
  }

  function handleDelete(id: string) {
    setMentors((prev) => prev.filter((m) => m.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <>
      <Head>
        <title>KT 관리자 - 멘토 관리</title>
      </Head>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">멘토 관리</h1>
              <p className="text-sm text-gray-500 mt-0.5">총 {mentors.length}명의 멘토</p>
            </div>
            <button
              onClick={openAdd}
              className="bg-kt-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              + 멘토 추가
            </button>
          </div>

          {/* 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {mentor.emoji}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{mentor.name}</p>
                      <p className="text-xs text-gray-500">{mentor.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(mentor)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(mentor.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{mentor.career}</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {mentors.length === 0 && (
            <div className="bg-white rounded-xl p-16 text-center text-gray-400 shadow-sm">
              등록된 멘토가 없습니다.
            </div>
          )}
        </div>
      </AdminLayout>

      {/* 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editTarget ? '멘토 수정' : '멘토 추가'}
            </h2>
            <div className="space-y-4">
              {/* 이모지 선택 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">아바타 이모지</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                      className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        form.emoji === e ? 'bg-kt-red/10 ring-2 ring-kt-red' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">이름 *</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="예: 김선배"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">직책 *</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="예: 인사팀 채용 실무자"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">커리어 소개</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red resize-none"
                  rows={2}
                  value={form.career}
                  onChange={(e) => setForm((f) => ({ ...f, career: e.target.value }))}
                  placeholder="예: KT 클라우드 인프라팀 7년차 · AWS/Azure 마이그레이션 프로젝트 다수"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">태그</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="태그 입력 후 Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {form.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.role}
                className="flex-1 py-2 bg-kt-red text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editTarget ? '저장' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <p className="text-gray-900 font-medium mb-2">멘토를 삭제하시겠어요?</p>
            <p className="text-sm text-gray-500 mb-6">삭제한 데이터는 복구할 수 없습니다.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
