import { useRouter } from 'next/router';
import Head from 'next/head';

const FEATURES = [
  {
    icon: '🎯',
    title: '맞춤형 아키텍처 설계',
    desc: '고객의 비즈니스 요구사항을 분석하여 최적의 AWS 서비스 조합을 자동으로 추천합니다.',
  },
  {
    icon: '💰',
    title: '실시간 비용 산출',
    desc: '실제 AWS 가격 기준으로 월별 예상 비용을 상세하게 계산하여 투명한 견적을 제공합니다.',
  },
  {
    icon: '📐',
    title: '시각적 다이어그램',
    desc: '레이어 구조로 아키텍처를 시각화하여 고객이 전체 구성을 직관적으로 이해할 수 있습니다.',
  },
  {
    icon: '📋',
    title: '전문 리포트 출력',
    desc: '생성된 아키텍처와 견적을 바로 출력하거나 PDF로 저장하여 고객에게 제공할 수 있습니다.',
  },
];

const INDUSTRIES = ['이커머스', '핀테크', '헬스케어', '미디어/엔터', 'SaaS', '게임', '교육', '제조'];

const USE_CASES = [
  { title: '스타트업 MVP', desc: '빠른 출시, 최소 비용', icon: '🚀', badge: '인기' },
  { title: '엔터프라이즈 전환', desc: '온프레미스 → 클라우드', icon: '🏢', badge: '' },
  { title: '데이터 분석 플랫폼', desc: '대용량 데이터 처리', icon: '📊', badge: '' },
  { title: 'AI/ML 서비스', desc: '머신러닝 인프라', icon: '🤖', badge: '신규' },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AWS Consultant Pro - AI 기반 아키텍처 자동 설계</title>
        <meta name="description" content="고객 요구사항을 입력하면 AWS 아키텍처와 비용 견적을 자동으로 생성합니다" />
      </Head>
      <div className="min-h-screen bg-aws-gray">
        {/* Header */}
        <header className="bg-aws-dark text-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-aws-orange rounded flex items-center justify-center font-extrabold text-aws-dark text-xs">
                AWS
              </div>
              <span className="font-bold text-lg">Consultant Pro</span>
            </div>
            <button
              onClick={() => router.push('/consultant')}
              className="bg-aws-orange hover:bg-aws-orange-dark text-aws-dark font-bold py-2 px-5 rounded-lg text-sm transition-all"
            >
              무료로 시작하기
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="bg-gradient-to-br from-aws-dark via-aws-dark-light to-[#1a3a5c] text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-aws-orange/20 border border-aws-orange/30 rounded-full px-4 py-1.5 text-aws-orange text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-aws-orange rounded-full animate-pulse-slow" />
              AI 기반 AWS 아키텍처 자동 설계
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              고객 요구사항을 입력하면<br />
              <span className="text-aws-orange">AWS 아키텍처와 견적</span>이<br />
              자동으로 완성됩니다
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              수십 시간이 걸리던 아키텍처 설계와 비용 산출을 단 몇 분 만에.
              Claude AI가 고객의 비즈니스를 분석하고 최적의 솔루션을 제안합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/consultant')}
                className="bg-aws-orange hover:bg-aws-orange-dark text-aws-dark font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-2xl"
              >
                지금 바로 시작하기 →
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-6">소요 시간: 약 2-3분 • 무료 이용 가능</p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-aws-dark text-center mb-3">
            왜 AWS Consultant Pro인가요?
          </h2>
          <p className="text-gray-500 text-center mb-12">AWS 전문가 수준의 컨설팅을 자동화합니다</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card hover:shadow-md transition-all duration-200">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-aws-dark text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-aws-dark text-center mb-8">
              모든 산업에 맞는 아키텍처를 제안합니다
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {INDUSTRIES.map((ind, i) => (
                <span
                  key={i}
                  className="bg-aws-orange-light text-aws-dark font-semibold px-4 py-2 rounded-full text-sm border border-aws-orange/30"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-aws-dark text-center mb-8">
            대표 활용 사례
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map((uc, i) => (
              <div
                key={i}
                className="card hover:shadow-md hover:border-aws-orange/30 border border-gray-100 cursor-pointer transition-all duration-200"
                onClick={() => router.push('/consultant')}
              >
                <div className="text-3xl mb-3">{uc.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-aws-dark">{uc.title}</h3>
                  {uc.badge && (
                    <span className="text-xs bg-aws-orange text-aws-dark font-bold px-2 py-0.5 rounded-full">
                      {uc.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-aws-dark py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              지금 바로 아키텍처를 설계해보세요
            </h2>
            <p className="text-gray-400 mb-8">
              고객 정보를 입력하고 전문가 수준의 AWS 아키텍처와 비용 견적을 받아보세요.
            </p>
            <button
              onClick={() => router.push('/consultant')}
              className="bg-aws-orange hover:bg-aws-orange-dark text-aws-dark font-bold py-4 px-10 rounded-xl text-lg transition-all shadow-lg"
            >
              무료로 시작하기 →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-aws-dark border-t border-white/10 py-6">
          <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
            AWS Consultant Pro • Claude AI 기반 아키텍처 설계 도구 • 2025
          </div>
        </footer>
      </div>
    </>
  );
}
