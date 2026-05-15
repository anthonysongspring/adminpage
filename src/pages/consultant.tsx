import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import StepIndicator from '../components/aws/StepIndicator';
import type { CustomerInput } from '../types/aws';

const STEPS = [
  { number: 1, title: '기본 정보', icon: '1' },
  { number: 2, title: '서비스 요구사항', icon: '2' },
  { number: 3, title: '규모 & 성능', icon: '3' },
  { number: 4, title: '예산 & 우선순위', icon: '4' },
];

const INDUSTRIES = [
  '이커머스/쇼핑몰', '핀테크/금융', '헬스케어/의료', '미디어/엔터테인먼트',
  'SaaS/B2B', '게임', '교육/EdTech', '제조/IoT', '물류/배송', '기타',
];

const SERVICE_TYPES = [
  '웹 애플리케이션', '모바일 앱 백엔드', 'REST API 서비스', '실시간 스트리밍',
  '데이터 파이프라인', '마이크로서비스', '서버리스 함수', '정적 웹사이트',
];

const MAIN_FEATURES = [
  '회원 인증/소셜 로그인', '결제/정산 시스템', '푸시 알림', '검색 기능',
  '파일/이미지 업로드', '실시간 채팅', 'AI/추천 엔진', '대시보드/분석',
  '이메일/SMS 발송', 'API Gateway/외부 연동',
];

const COMPLIANCE = [
  'ISO 27001', 'PCI DSS (결제)', 'HIPAA (의료)', '금융감독원 규정', 'GDPR', '개인정보보호법',
];

const EXPECTED_USERS = [
  '~ 1,000명 (초기)', '1,000 ~ 10,000명', '10,000 ~ 100,000명',
  '100,000 ~ 1,000,000명', '1,000,000명 이상',
];

const DAILY_TRAFFIC = [
  '~1만 요청/일', '1만~10만 요청/일', '10만~100만 요청/일',
  '100만~1,000만 요청/일', '1,000만+ 요청/일',
];

const DATA_STORAGE = [
  '~10GB', '10GB~100GB', '100GB~1TB', '1TB~10TB', '10TB 이상',
];

const AVAILABILITY = ['99% (약 87시간/년 다운타임 허용)', '99.9% (약 9시간/년)', '99.95% (~4.5시간/년)', '99.99% (~1시간/년)'];

const BUDGET_RANGES = [
  '$100 ~ $500/월', '$500 ~ $2,000/월', '$2,000 ~ $5,000/월',
  '$5,000 ~ $20,000/월', '$20,000/월 이상', '예산 미정',
];

const PRIORITIES = [
  { value: '비용 최적화', desc: '최소 비용으로 운영' },
  { value: '성능/확장성', desc: '고성능, 빠른 확장' },
  { value: '개발 편의성', desc: '빠른 배포, 관리 편의' },
  { value: '보안/컴플라이언스', desc: '최고 수준의 보안' },
];

const INITIAL: CustomerInput = {
  companyName: '',
  projectName: '',
  industry: '',
  contactName: '',
  serviceTypes: [],
  mainFeatures: [],
  compliance: [],
  expectedUsers: '',
  dailyTraffic: '',
  dataStorage: '',
  availability: '',
  multiRegion: false,
  budgetRange: '',
  priority: '',
  additionalRequirements: '',
};

function CheckboxGroup({
  options,
  selected,
  onChange,
  max,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  max?: number;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else if (!max || selected.length < max) {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              isSelected
                ? 'bg-aws-orange text-aws-dark border-aws-orange shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-aws-orange/50'
            }`}
          >
            {isSelected && <span className="mr-1">✓</span>}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function RadioGroup({
  options,
  selected,
  onChange,
}: {
  options: string[] | { value: string; desc: string }[];
  selected: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const desc = typeof opt === 'string' ? null : opt.desc;
        const isSelected = selected === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-left ${
              isSelected
                ? 'bg-aws-orange text-aws-dark border-aws-orange shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-aws-orange/50'
            }`}
          >
            <span className="font-semibold">{val}</span>
            {desc && <span className={`ml-2 text-xs ${isSelected ? 'text-aws-dark/70' : 'text-gray-400'}`}>— {desc}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function ConsultantPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CustomerInput>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof CustomerInput>(key: K, val: CustomerInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validateStep = () => {
    if (step === 1) {
      if (!form.companyName.trim()) return '회사명을 입력해주세요.';
      if (!form.projectName.trim()) return '프로젝트명을 입력해주세요.';
      if (!form.industry) return '산업 분야를 선택해주세요.';
    }
    if (step === 2) {
      if (form.serviceTypes.length === 0) return '서비스 유형을 하나 이상 선택해주세요.';
      if (form.mainFeatures.length === 0) return '주요 기능을 하나 이상 선택해주세요.';
    }
    if (step === 3) {
      if (!form.expectedUsers) return '예상 사용자 수를 선택해주세요.';
      if (!form.dailyTraffic) return '일일 트래픽을 선택해주세요.';
      if (!form.availability) return '가용성 요구사항을 선택해주세요.';
    }
    if (step === 4) {
      if (!form.budgetRange) return '예산 범위를 선택해주세요.';
      if (!form.priority) return '우선순위를 선택해주세요.';
    }
    return '';
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '오류가 발생했습니다.');

      sessionStorage.setItem('aws_result', JSON.stringify(data));
      sessionStorage.setItem('aws_input', JSON.stringify(form));
      router.push('/result');
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AWS 아키텍처 설계 - AWS Consultant Pro</title>
      </Head>
      <div className="min-h-screen bg-aws-gray">
        {/* Header */}
        <header className="bg-aws-dark text-white py-4">
          <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-aws-orange rounded flex items-center justify-center font-extrabold text-aws-dark text-xs">A</div>
              <span className="font-bold">AWS Consultant Pro</span>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold text-aws-dark mb-1">고객 요구사항 입력</h1>
            <p className="text-gray-500 text-sm">정확한 정보를 입력할수록 더 적합한 아키텍처를 추천받을 수 있습니다</p>
          </div>

          <StepIndicator currentStep={step} steps={STEPS} />

          <div className="card animate-slide-up">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="section-title">기본 정보</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">회사명 *</label>
                    <input className="input-field" placeholder="예: 주식회사 테크스타" value={form.companyName}
                      onChange={(e) => set('companyName', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">담당자명</label>
                    <input className="input-field" placeholder="예: 홍길동" value={form.contactName}
                      onChange={(e) => set('contactName', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">프로젝트명 *</label>
                  <input className="input-field" placeholder="예: 쇼핑몰 플랫폼 구축" value={form.projectName}
                    onChange={(e) => set('projectName', e.target.value)} />
                </div>
                <div>
                  <label className="label">산업 분야 *</label>
                  <RadioGroup options={INDUSTRIES} selected={form.industry} onChange={(v) => set('industry', v)} />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="section-title">서비스 요구사항</h2>
                <div>
                  <label className="label">서비스 유형 * (복수 선택 가능)</label>
                  <CheckboxGroup options={SERVICE_TYPES} selected={form.serviceTypes}
                    onChange={(v) => set('serviceTypes', v)} />
                </div>
                <div>
                  <label className="label">주요 기능 * (복수 선택 가능)</label>
                  <CheckboxGroup options={MAIN_FEATURES} selected={form.mainFeatures}
                    onChange={(v) => set('mainFeatures', v)} />
                </div>
                <div>
                  <label className="label">컴플라이언스 요구사항 (해당하는 항목 선택)</label>
                  <CheckboxGroup options={COMPLIANCE} selected={form.compliance}
                    onChange={(v) => set('compliance', v)} />
                  <p className="text-xs text-gray-400 mt-2">선택하지 않으면 일반적인 보안 기준을 적용합니다</p>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="section-title">규모 & 성능</h2>
                <div>
                  <label className="label">예상 동시/총 사용자 수 *</label>
                  <RadioGroup options={EXPECTED_USERS} selected={form.expectedUsers}
                    onChange={(v) => set('expectedUsers', v)} />
                </div>
                <div>
                  <label className="label">일일 API/페이지 요청 수 *</label>
                  <RadioGroup options={DAILY_TRAFFIC} selected={form.dailyTraffic}
                    onChange={(v) => set('dailyTraffic', v)} />
                </div>
                <div>
                  <label className="label">데이터 저장 용량 (DB + 파일)</label>
                  <RadioGroup options={DATA_STORAGE} selected={form.dataStorage}
                    onChange={(v) => set('dataStorage', v)} />
                </div>
                <div>
                  <label className="label">가용성 요구사항 (SLA) *</label>
                  <RadioGroup options={AVAILABILITY} selected={form.availability}
                    onChange={(v) => set('availability', v)} />
                </div>
                <div>
                  <label className="label">멀티 리전 (재해복구/글로벌 서비스)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => set('multiRegion', !form.multiRegion)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${form.multiRegion ? 'bg-aws-orange' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.multiRegion ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                    <span className="text-sm text-gray-600">
                      {form.multiRegion ? '멀티 리전 구성 (고가용성, 글로벌 서비스)' : '단일 리전 구성 (비용 효율적)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="section-title">예산 & 우선순위</h2>
                <div>
                  <label className="label">월 예산 범위 (AWS 인프라 비용) *</label>
                  <RadioGroup options={BUDGET_RANGES} selected={form.budgetRange}
                    onChange={(v) => set('budgetRange', v)} />
                </div>
                <div>
                  <label className="label">설계 우선순위 *</label>
                  <RadioGroup options={PRIORITIES} selected={form.priority}
                    onChange={(v) => set('priority', v)} />
                </div>
                <div>
                  <label className="label">추가 요구사항 또는 특이사항</label>
                  <textarea
                    className="input-field resize-none"
                    rows={4}
                    placeholder="예: 기존 온프레미스 Oracle DB와 연동 필요, 특정 AWS 리전(서울) 필수, CI/CD 파이프라인 포함..."
                    value={form.additionalRequirements}
                    onChange={(e) => set('additionalRequirements', e.target.value)}
                  />
                </div>

                {/* 입력 요약 */}
                <div className="bg-aws-gray rounded-xl p-4 border border-gray-200">
                  <h3 className="font-bold text-aws-dark mb-3 text-sm">입력 정보 확인</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      ['회사/프로젝트', `${form.companyName} / ${form.projectName}`],
                      ['산업', form.industry],
                      ['서비스 유형', form.serviceTypes.slice(0, 2).join(', ') + (form.serviceTypes.length > 2 ? ` 외 ${form.serviceTypes.length - 2}` : '')],
                      ['예상 사용자', form.expectedUsers],
                      ['가용성', form.availability.split(' ')[0]],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span className="text-gray-400">{k}: </span>
                        <span className="font-medium text-gray-700">{v || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button onClick={() => { setStep((s) => s - 1); setError(''); }} className="btn-secondary">
                  ← 이전
                </button>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <button onClick={handleNext} className="btn-primary">
                  다음 단계 →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[180px] justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      AI 설계 중...
                    </>
                  ) : (
                    '🚀 아키텍처 생성하기'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Progress hint */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Step {step} / {STEPS.length} — {Math.round((step / STEPS.length) * 100)}% 완료
          </p>
        </main>
      </div>
    </>
  );
}
