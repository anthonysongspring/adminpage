import type { ArchitectureLayer } from '../../types/aws';

interface Props {
  layers: ArchitectureLayer[];
}

const LAYER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  '#FF9900': { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700' },
  '#1A73E8': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' },
  '#00A591': { bg: 'bg-teal-50', border: 'border-teal-400', text: 'text-teal-700' },
  '#7C3AED': { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700' },
  '#DC2626': { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
  '#059669': { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700' },
  '#D97706': { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700' },
  '#2563EB': { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-700' },
};

function getColors(color: string) {
  return LAYER_COLORS[color] || { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700' };
}

export default function ArchitectureDiagram({ layers }: Props) {
  return (
    <div className="space-y-3">
      {/* Internet 표시 */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Internet / Users
        </div>
      </div>

      {layers.map((layer, index) => {
        const colors = getColors(layer.color);
        return (
          <div key={index}>
            {/* 화살표 */}
            <div className="flex justify-center my-1">
              <svg className="w-4 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: layer.color }} />
                <span className={`font-bold text-sm ${colors.text}`}>{layer.name}</span>
                <span className="text-xs text-gray-500 ml-auto">{layer.description}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.services.map((service, si) => (
                  <span
                    key={si}
                    className={`px-3 py-1.5 bg-white border ${colors.border} rounded-lg text-xs font-semibold ${colors.text} shadow-sm`}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* 데이터베이스 레이어 하단 표시 */}
      <div className="flex justify-center my-1">
        <svg className="w-4 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4 8 4s8 1.79 8 4" />
          </svg>
          AWS Cloud Infrastructure
        </div>
      </div>
    </div>
  );
}
