import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ArchitectureDiagram from '../components/aws/ArchitectureDiagram';
import ServiceCard from '../components/aws/ServiceCard';
import CostSummary from '../components/aws/CostSummary';
import type { ArchitectureResult, CustomerInput } from '../types/aws';

const CATEGORY_ORDER = ['Compute', 'Network', 'Storage', 'Database', 'Security', 'Analytics', 'AI/ML', 'Management'];

function groupByCategory(services: ArchitectureResult['services']) {
  const groups: Record<string, typeof services> = {};
  for (const svc of services) {
    const cat = svc.category || 'etc';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(svc);
  }
  const ordered: typeof groups = {};
  for (const cat of CATEGORY_ORDER) {
    if (groups[cat]) ordered[cat] = groups[cat];
  }
  for (const cat of Object.keys(groups)) {
    if (!ordered[cat]) ordered[cat] = groups[cat];
  }
  return ordered;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ArchitectureResult | null>(null);
  const [input, setInput] = useState<CustomerInput | null>(null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'services' | 'cost'>('architecture');

  useEffect(() => {
    const raw = sessionStorage.getItem('aws_result');
    const rawInput = sessionStorage.getItem('aws_input');
    if (!raw) { router.push('/consultant'); return; }
    try {
      setResult(JSON.parse(raw));
      if (rawInput) setInput(JSON.parse(rawInput));
    } catch {
      router.push('/consultant');
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-aws-gray flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-aws-orange mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const grouped = groupByCategory(result.services);
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Head>
        <title>AWS 아키텍처 결과 - {input?.projectName || '프로젝트'}</title>
      </Head>
      <div className="min-h-screen bg-aws-gray">
        {/* Header */}
        <header className="bg-aws-dark text-white no-print">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/consultant')}
                className="text-sm text-gray-300 hover:text-white border border-white/20 rounded-lg px-4 py-2 transition-all"
              >
                새 설계 시작
              </button>
              <button
                onClick={() => window.print()}
                className="bg-aws-orange hover:bg-aws-orange-dark text-aws-dark font-bold text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                리포트 출력
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Report Header */}
          <div className="card mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-aws-orange rounded flex items-center justify-center font-extrabold text-aws-dark text-xs">
                    AWS
                  </div>
                  <span className="text-sm font-medium text-gray-500">AWS 아키텍처 제안서</span>
                </div>
                <h1 className="text-2xl font-extrabold text-aws-dark">
                  {input?.projectName || '프로젝트'} 아키텍처 설계
                </h1>
                {input && (
                  <p className="text-gray-500 mt-1">
                    {input.companyName} • {input.industry} • {today}
                  </p>
                )}
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="text-right">
                  <div className="text-xs text-gray-400">월 예상 비용</div>
                  <div className="text-2xl font-extrabold text-aws-orange">
                    ${result.totalMonthlyMin.toLocaleString()} ~ ${result.totalMonthlyMax.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">USD/월</div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-aws-gray rounded-xl">
              <p className="text-gray-700 leading-relaxed text-sm">{result.summary}</p>
            </div>

            {/* Highlights & Warnings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {result.highlights.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-bold text-green-800 mb-2 text-sm flex items-center gap-2">
                    <span>✅</span> 주요 장점
                  </h3>
                  <ul className="space-y-1">
                    {result.highlights.map((h, i) => (
                      <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                        <span className="mt-0.5">•</span>{h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="font-bold text-amber-800 mb-2 text-sm flex items-center gap-2">
                    <span>⚠️</span> 주의사항
                  </h3>
                  <ul className="space-y-1">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="mt-0.5">•</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 no-print">
            {[
              { key: 'architecture', label: '🏗️ 아키텍처 구조' },
              { key: 'services', label: '⚙️ 서비스 상세' },
              { key: 'cost', label: '💰 비용 견적' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-aws-dark text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-aws-orange/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Architecture Diagram Tab */}
          {activeTab === 'architecture' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              <div className="card">
                <h2 className="font-bold text-aws-dark mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-aws-orange rounded text-aws-dark text-xs flex items-center justify-center font-bold">🏗</span>
                  아키텍처 다이어그램
                </h2>
                <ArchitectureDiagram layers={result.layers} />
              </div>
              <div className="space-y-4">
                <div className="card">
                  <h2 className="font-bold text-aws-dark mb-3">서비스 구성 요약</h2>
                  <div className="space-y-2">
                    {result.layers.map((layer, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: layer.color }} />
                        <div>
                          <span className="font-semibold text-gray-700">{layer.name}</span>
                          <span className="text-gray-400 ml-2">— {layer.description}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {layer.services.map((s, si) => (
                              <span key={si} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <CostSummary result={result} />
              </div>
            </div>
          )}

          {/* Services Detail Tab */}
          {activeTab === 'services' && (
            <div className="animate-fade-in">
              {Object.entries(grouped).map(([category, services]) => (
                <div key={category} className="mb-6">
                  <h2 className="font-bold text-aws-dark mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-aws-orange rounded-full" />
                    {category}
                    <span className="text-sm font-normal text-gray-400">({services.length}개)</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((svc) => (
                      <ServiceCard key={svc.id} service={svc} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="card bg-aws-dark text-white mt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">총 서비스 수</div>
                    <div className="text-2xl font-extrabold">{result.services.length}개 서비스</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">월 예상 총 비용</div>
                    <div className="text-2xl font-extrabold text-aws-orange">
                      ${result.totalMonthlyMin.toLocaleString()} ~ ${result.totalMonthlyMax.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cost Tab */}
          {activeTab === 'cost' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="font-bold text-aws-dark mb-4">비용 요약</h2>
                  <CostSummary result={result} />
                </div>
                <div className="card">
                  <h2 className="font-bold text-aws-dark mb-4">서비스별 비용 내역</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {[...result.services].sort((a, b) => b.monthlyMax - a.monthlyMax).map((svc) => {
                      const pct = Math.round((((svc.monthlyMin + svc.monthlyMax) / 2) / ((result.totalMonthlyMin + result.totalMonthlyMax) / 2)) * 100);
                      return (
                        <div key={svc.id} className="flex items-center gap-3">
                          <div className="w-32 text-sm font-semibold text-gray-700 truncate shrink-0">{svc.name}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-aws-orange h-2 rounded-full transition-all"
                              style={{ width: `${Math.max(pct, 2)}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-600 w-28 text-right shrink-0">
                            ${svc.monthlyMin.toLocaleString()}~${svc.monthlyMax.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cost table */}
              <div className="card mt-6">
                <h2 className="font-bold text-aws-dark mb-4">상세 비용표</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-gray-500 font-semibold">카테고리</th>
                        <th className="text-left py-3 px-3 text-gray-500 font-semibold">서비스</th>
                        <th className="text-left py-3 px-3 text-gray-500 font-semibold">사양</th>
                        <th className="text-right py-3 px-3 text-gray-500 font-semibold">월 최소</th>
                        <th className="text-right py-3 px-3 text-gray-500 font-semibold">월 최대</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.services.map((svc, i) => (
                        <tr key={svc.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2.5 px-3 text-gray-500">{svc.category}</td>
                          <td className="py-2.5 px-3 font-semibold text-aws-dark">{svc.name}</td>
                          <td className="py-2.5 px-3 text-gray-500 text-xs">{svc.specs}</td>
                          <td className="py-2.5 px-3 text-right font-mono">${svc.monthlyMin.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono">${svc.monthlyMax.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-aws-orange bg-aws-orange-light">
                        <td colSpan={3} className="py-3 px-3 font-extrabold text-aws-dark">합계</td>
                        <td className="py-3 px-3 text-right font-extrabold text-aws-dark font-mono">
                          ${result.totalMonthlyMin.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-aws-dark font-mono">
                          ${result.totalMonthlyMax.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 text-center text-xs text-gray-400 no-print">
            * 비용은 AWS 공개 가격 기준 추정치이며 실제 사용량에 따라 달라질 수 있습니다. 정확한 견적은 AWS Pricing Calculator를 활용하세요.
          </div>
        </main>
      </div>
    </>
  );
}
