export interface CustomerInput {
  // 기본 정보
  companyName: string;
  projectName: string;
  industry: string;
  contactName: string;

  // 서비스 유형
  serviceTypes: string[];
  mainFeatures: string[];
  compliance: string[];

  // 규모 정보
  expectedUsers: string;
  dailyTraffic: string;
  dataStorage: string;
  availability: string;
  multiRegion: boolean;

  // 예산
  budgetRange: string;
  priority: string;

  // 추가 요구사항
  additionalRequirements: string;
}

export interface AwsService {
  id: string;
  category: string;
  name: string;
  description: string;
  specs: string;
  monthlyMin: number;
  monthlyMax: number;
  reason: string;
}

export interface ArchitectureLayer {
  name: string;
  color: string;
  services: string[];
  description: string;
}

export interface ArchitectureResult {
  summary: string;
  layers: ArchitectureLayer[];
  services: AwsService[];
  totalMonthlyMin: number;
  totalMonthlyMax: number;
  setupCost: number;
  timeline: string;
  highlights: string[];
  warnings: string[];
  optimizationTips: string[];
}
