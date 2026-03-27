import Head from 'next/head'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { JOBS } from '@/data/jobs'
import { Job, JobType } from '@/types/job'

const JOB_TYPES: JobType[] = ['신입채용', '경력채용', '인턴']

const EMPTY_FORM: Omit<Job, 'id'> = {
  title: '',
  type: '신입채용',
  department: '',
  deadline: '',
  tags: [],
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>(JOBS)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Job | null>(null)
  const [form, setForm] = useState<Omit<Job, 'id'>>(EMPTY_FORM)
  const [tagInput, setTagInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setTagInput('')
    setShowModal(true)
  }

  function openEdit(job: Job) {
    setEditTarget(job)
    setForm({ title: job.title, type: job.type, department: job.department, deadline: job.deadline, tags: [...job.tags] })
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
    if (!form.title || !form.department) return
    if (editTarget) {
      setJobs((prev) => prev.map((j) => (j.id === editTarget.id ? { ...editTarget, ...form } : j)))
    } else {
      const newId = `job-${Date.now()}`
      setJobs((prev) => [...prev, { id: newId, ...form }])
    }
    closeModal()
  }

  function handleDelete(id: string) {
    setJobs((prev) => prev.filter((j) => j.id !== id))
    setDeleteConfirm(null)
  }

  const typeColor: Record<JobType, string> = {
    신입채용: 'bg-blue-100 text-blue-700',
    경력채용: 'bg-amber-100 text-amber-700',
    인턴: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <>
      <Head>
        <title>KT 관리자 - 채용공고 관리</title>
      </Head>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">채용공고 관리</h1>
              <p className="text-sm text-gray-500 mt-0.5">총 {jobs.length}개의 공고</p>
            </div>
            <button
              onClick={openAdd}
              className="bg-kt-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              + 공고 추가
            </button>
          </div>

          {/* 테이블 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500">
                  <th className="px-5 py-3.5 font-medium">직무명</th>
                  <th className="px-5 py-3.5 font-medium">구분</th>
                  <th className="px-5 py-3.5 font-medium">부서</th>
                  <th className="px-5 py-3.5 font-medium">마감일</th>
                  <th className="px-5 py-3.5 font-medium">태그</th>
                  <th className="px-5 py-3.5 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{job.title}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[job.type]}`}>
                        {job.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{job.department}</td>
                    <td className="px-5 py-4 text-gray-600">{job.deadline}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {job.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{job.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(job)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(job.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && (
              <p className="text-center text-gray-400 py-16">등록된 채용공고가 없습니다.</p>
            )}
          </div>
        </div>
      </AdminLayout>

      {/* 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editTarget ? '채용공고 수정' : '채용공고 추가'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">직무명 *</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="예: Cloud 이행"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">채용 구분 *</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as JobType }))}
                  >
                    {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">부서 *</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    placeholder="예: IT인프라"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">마감일</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kt-red"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  placeholder="예: 2025-05-31 또는 상시채용"
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
                      {tag}
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
                disabled={!form.title || !form.department}
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
            <p className="text-gray-900 font-medium mb-2">채용공고를 삭제하시겠어요?</p>
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
