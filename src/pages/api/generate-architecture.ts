import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import type { CustomerInput, ArchitectureResult } from '../../types/aws';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(input: CustomerInput): string {
  return `당신은 AWS 솔루션 아키텍트 전문가입니다. 고객의 요구사항을 분석하여 최적의 AWS 아키텍처를 설계하고 비용을 산출해주세요.

## 고객 정보
- 회사명: ${input.companyName}
- 프로젝트명: ${input.projectName}
- 산업 분야: ${input.industry}

## 서비스 요구사항
- 서비스 유형: ${input.serviceTypes.join(', ')}
- 주요 기능: ${input.mainFeatures.join(', ')}
- 컴플라이언스: ${input.compliance.length > 0 ? input.compliance.join(', ') : '없음'}

## 규모 및 성능
- 예상 사용자 수: ${input.expectedUsers}
- 일일 트래픽: ${input.dailyTraffic}
- 데이터 저장 용량: ${input.dataStorage}
- 가용성 요구사항: ${input.availability}
- 멀티 리전: ${input.multiRegion ? '필요' : '불필요'}

## 예산 및 우선순위
- 월 예산 범위: ${input.budgetRange}
- 우선순위: ${input.priority}

## 추가 요구사항
${input.additionalRequirements || '없음'}

위 요구사항을 바탕으로 다음 JSON 형식으로 정확하게 응답해주세요. 반드시 유효한 JSON만 응답하고 다른 텍스트는 포함하지 마세요:

{
  "summary": "아키텍처 전체 요약 (2-3문장)",
  "layers": [
    {
      "name": "레이어명 (예: 사용자 접근 계층)",
      "color": "색상코드 (예: #FF9900)",
      "services": ["서비스1", "서비스2"],
      "description": "레이어 설명"
    }
  ],
  "services": [
    {
      "id": "고유ID",
      "category": "카테고리 (Compute/Storage/Database/Network/Security/Analytics/AI/ML 중 하나)",
      "name": "AWS 서비스명",
      "description": "서비스 역할 설명",
      "specs": "세부 사양 (예: t3.medium x 2 인스턴스)",
      "monthlyMin": 최소월비용(숫자),
      "monthlyMax": 최대월비용(숫자),
      "reason": "이 서비스를 선택한 이유"
    }
  ],
  "totalMonthlyMin": 전체최소월비용(숫자),
  "totalMonthlyMax": 전체최대월비용(숫자),
  "setupCost": 초기구축비용(숫자),
  "timeline": "구축 예상 기간 (예: 4-6주)",
  "highlights": ["주요 장점1", "주요 장점2", "주요 장점3"],
  "warnings": ["주의사항1", "주의사항2"],
  "optimizationTips": ["비용 최적화 팁1", "팁2", "팁3"]
}

모든 비용은 USD 기준 월별 비용입니다. 실제 AWS 가격 기준으로 현실적인 견적을 산출해주세요. layers는 아키텍처의 논리적 계층 구조를 나타냅니다 (예: CDN 계층, 웹 계층, 앱 계층, 데이터 계층, 보안 계층 등). 최소 5개 이상의 AWS 서비스를 포함해주세요.`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const input: CustomerInput = req.body;

  if (!input.companyName || !input.projectName) {
    return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: buildPrompt(input),
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('응답에 텍스트가 없습니다.');
    }

    const jsonText = textContent.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result: ArchitectureResult = JSON.parse(jsonText);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Architecture generation error:', error);
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    return res.status(500).json({ error: `아키텍처 생성 중 오류가 발생했습니다: ${message}` });
  }
}
