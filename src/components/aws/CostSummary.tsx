import type { ArchitectureResult } from '../../types/aws';

interface Props {
  result: ArchitectureResult;
}

export default function CostSummary({ result }: Props) {
  const avgMonthly = Math.round((result.totalMonthlyMin + result.totalMonthlyMax) / 2);
  const avgAnnual = avgMonthly * 12;

  return (
    <div className="space-y-4">
      {/* 비용 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-aws-orange-light border-2 border-aws-orange rounded-xl p-4 text-center">
          <div className="text-xs text-aws-dark/60 font-medium mb-1">월 최소 비용</div>
          <div className="text-2xl font-extrabold text-aws-dark">
            ${result.totalMonthlyMin.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">USD / 월</div>
        </div>
        <div className="bg-aws-dark rounded-xl p-4 text-center">
          <div className="text-xs text-gray-400 font-medium mb-1">월 예상 평균</div>
          <div className="text-2xl font-extrabold text-aws-orange">
            ${avgMonthly.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">USD / 월</div>
        </div>
        <div className="bg-aws-orange-light border-2 border-aws-orange rounded-xl p-4 text-center">
          <div className="text-xs text-aws-dark/60 font-medium mb-1">월 최대 비용</div>
          <div className="text-2xl font-extrabold text-aws-dark">
            ${result.totalMonthlyMax.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">USD / 월</div>
        </div>
      </div>

      {/* 연간 / 초기 비용 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-xs text-gray-500 font-medium mb-1">연간 예상 비용 (평균)</div>
          <div className="text-xl font-bold text-aws-dark">${avgAnnual.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">USD / 년</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-xs text-gray-500 font-medium mb-1">초기 구축 비용 (추정)</div>
          <div className="text-xl font-bold text-aws-dark">${result.setupCost.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">USD (일회성)</div>
        </div>
      </div>

      {/* 구축 기간 */}
      <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-teal-800">예상 구축 기간</div>
          <div className="text-lg font-bold text-teal-700">{result.timeline}</div>
        </div>
      </div>

      {/* 비용 최적화 팁 */}
      {result.optimizationTips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            비용 최적화 팁
          </h4>
          <ul className="space-y-2">
            {result.optimizationTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
