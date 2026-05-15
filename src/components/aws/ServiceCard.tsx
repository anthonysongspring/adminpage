import type { AwsService } from '../../types/aws';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  Compute: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚙️' },
  Storage: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '💾' },
  Database: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🗄️' },
  Network: { bg: 'bg-teal-100', text: 'text-teal-700', icon: '🌐' },
  Security: { bg: 'bg-red-100', text: 'text-red-700', icon: '🔒' },
  Analytics: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '📊' },
  'AI/ML': { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🤖' },
  Management: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '🛠️' },
};

function getCategory(category: string) {
  return CATEGORY_COLORS[category] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: '☁️' };
}

interface Props {
  service: AwsService;
}

export default function ServiceCard({ service }: Props) {
  const cat = getCategory(service.category);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 hover:border-aws-orange/30">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cat.bg} ${cat.text} whitespace-nowrap`}>
            {cat.icon} {service.category}
          </span>
          <h3 className="font-bold text-aws-dark text-base truncate">{service.name}</h3>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-aws-dark">
            ${service.monthlyMin.toLocaleString()} ~ ${service.monthlyMax.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">USD/월</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">{service.description}</p>

      {service.specs && (
        <div className="text-xs bg-gray-50 rounded-lg px-3 py-2 text-gray-500 font-mono mb-2">
          {service.specs}
        </div>
      )}

      <div className="flex items-start gap-1.5 mt-3">
        <span className="text-aws-orange mt-0.5 shrink-0">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </span>
        <p className="text-xs text-gray-500">{service.reason}</p>
      </div>
    </div>
  );
}
