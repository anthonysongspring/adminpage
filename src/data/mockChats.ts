export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  userId: string
  jobId: string
  mentorId: string
  startedAt: string
  messages: ChatMessage[]
}

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'chat-001',
    userId: 'user_A',
    jobId: 'ai-dx',
    mentorId: 'kim_seonbae',
    startedAt: '2025-03-20T10:15:00',
    messages: [
      { role: 'user', content: 'AI/DX 개발 직무에 지원하려는데 Python 실력이 부족한 것 같아서 걱정돼요.', timestamp: '2025-03-20T10:15:10' },
      { role: 'assistant', content: 'Python 기초는 빠르게 익힐 수 있어요. 중요한 건 LLM 파인튜닝 경험이나 MLOps 이해도예요. 개인 프로젝트로 간단한 LLM 앱을 만들어보는 게 좋습니다.', timestamp: '2025-03-20T10:15:40' },
      { role: 'user', content: 'LLM 관련 포트폴리오를 어떻게 준비하면 좋을까요?', timestamp: '2025-03-20T10:16:20' },
      { role: 'assistant', content: 'GitHub에 RAG 기반 챗봇을 구현해서 올려두는 게 가장 효과적입니다. 딥러닝 이론보다는 실제 서비스 배포 경험을 보여주는 게 중요해요.', timestamp: '2025-03-20T10:16:55' },
      { role: 'user', content: '면접에서 자주 나오는 질문은 어떤 게 있나요?', timestamp: '2025-03-20T10:17:30' },
      { role: 'assistant', content: 'MLOps 파이프라인 설계, 모델 성능 평가 방법, 데이터 전처리 경험 등을 많이 물어봐요. 특히 실제 프로젝트에서 겪은 문제와 해결 방법을 구체적으로 말할 수 있도록 준비하세요.', timestamp: '2025-03-20T10:18:00' },
    ],
  },
  {
    id: 'chat-002',
    userId: 'user_B',
    jobId: 'sw-dev',
    mentorId: 'park_mentor',
    startedAt: '2025-03-21T14:30:00',
    messages: [
      { role: 'user', content: '소프트웨어 개발 신입 공고인데 Spring을 공부한 적이 없어요. 괜찮을까요?', timestamp: '2025-03-21T14:30:15' },
      { role: 'assistant', content: '서류 단계에서는 Java 기초와 프로젝트 경험이 더 중요해요. Spring은 입사 후 배울 수 있지만, 기본적인 MVC 패턴 정도는 알고 가는 게 좋습니다.', timestamp: '2025-03-21T14:30:50' },
      { role: 'user', content: '자소서에서 어떤 부분을 강조해야 할까요?', timestamp: '2025-03-21T14:31:30' },
      { role: 'assistant', content: '팀 프로젝트 경험과 문제 해결 능력을 구체적인 수치와 함께 서술하세요. 예를 들어 "API 응답속도 30% 개선" 같이 성과를 정량화하면 더 좋습니다.', timestamp: '2025-03-21T14:32:10' },
      { role: 'user', content: 'DevOps 경험이 없는데 태그에 DevOps가 있어서 걱정돼요.', timestamp: '2025-03-21T14:32:50' },
      { role: 'assistant', content: '신입 공고라면 DevOps는 우대 조건이에요. Docker 기초 정도만 알아도 서류는 통과됩니다. CI/CD 개념을 이해하고 있다고 어필하면 충분해요.', timestamp: '2025-03-21T14:33:20' },
    ],
  },
  {
    id: 'chat-003',
    userId: 'user_C',
    jobId: 'cloud-migration',
    mentorId: 'kim_seonbae',
    startedAt: '2025-03-22T09:00:00',
    messages: [
      { role: 'user', content: 'AWS 자격증은 어떤 걸 따는 게 좋을까요?', timestamp: '2025-03-22T09:00:20' },
      { role: 'assistant', content: 'AWS Solutions Architect Associate가 가장 범용적이에요. 클라우드 이행 직무라면 추가로 AWS Migration Specialty까지 있으면 확실히 차별화됩니다.', timestamp: '2025-03-22T09:00:55' },
      { role: 'user', content: 'Azure 경험이 더 많은데 불리한가요?', timestamp: '2025-03-22T09:01:35' },
      { role: 'assistant', content: '전혀요. 멀티클라우드 경험은 오히려 장점입니다. KT도 AWS, Azure 모두 사용하므로 두 클라우드를 비교 분석할 수 있는 역량을 어필하세요.', timestamp: '2025-03-22T09:02:10' },
      { role: 'user', content: '마이그레이션 프로젝트 경험이 없어도 지원 가능할까요?', timestamp: '2025-03-22T09:02:45' },
      { role: 'assistant', content: '경력채용이라 실무 경험이 중요해요. 직접 마이그레이션은 아니더라도 인프라 구축이나 클라우드 환경 운영 경험을 강조하세요. 사이드 프로젝트도 충분히 인정받습니다.', timestamp: '2025-03-22T09:03:20' },
    ],
  },
  {
    id: 'chat-004',
    userId: 'user_D',
    jobId: 'network-infra',
    mentorId: 'lee_frontier',
    startedAt: '2025-03-23T16:00:00',
    messages: [
      { role: 'user', content: '네트워크 자격증이 없는데 신입 공고라 지원할 수 있을까요?', timestamp: '2025-03-23T16:00:30' },
      { role: 'assistant', content: '신입 공고니까 자격증보다 열정과 기초 지식이 중요해요. CCNA 공부 중이라는 사실만 어필해도 충분히 어필이 돼요.', timestamp: '2025-03-23T16:01:05' },
      { role: 'user', content: '면접에서 어떤 질문이 나올까요?', timestamp: '2025-03-23T16:01:40' },
      { role: 'assistant', content: 'OSI 7계층, TCP/IP 프로토콜, 라우팅 알고리즘 기초 등을 물어봐요. 실무 경험보단 개념 이해를 테스트하는 질문이 많습니다.', timestamp: '2025-03-23T16:02:15' },
      { role: 'user', content: '자소서 지원 동기를 어떻게 써야 할까요?', timestamp: '2025-03-23T16:02:50' },
      { role: 'assistant', content: 'KT의 통신 인프라와 연결지어 쓰면 좋아요. "5G 네트워크 인프라를 직접 설계하고 싶다"는 식으로 구체적인 목표를 담으세요. 저도 이 방식으로 합격했어요.', timestamp: '2025-03-23T16:03:25' },
    ],
  },
  {
    id: 'chat-005',
    userId: 'user_E',
    jobId: 'security',
    mentorId: 'park_mentor',
    startedAt: '2025-03-24T11:00:00',
    messages: [
      { role: 'user', content: '정보보안 직무 서류 전형에서 어떤 점을 중점적으로 봐요?', timestamp: '2025-03-24T11:00:20' },
      { role: 'assistant', content: 'ISMS 인증 관련 경험과 침해 대응 실적이 핵심이에요. 보안관제 경험이 있다면 반드시 구체적인 사례와 함께 서술하세요.', timestamp: '2025-03-24T11:00:55' },
      { role: 'user', content: '보안 자격증은 CISSP가 있어야 하나요?', timestamp: '2025-03-24T11:01:30' },
      { role: 'assistant', content: 'CISSP가 있으면 유리하지만 필수는 아니에요. 정보보안기사나 CISA도 충분히 인정받습니다. 자격증보다 실제 보안 사고 대응 경험이 더 중요해요.', timestamp: '2025-03-24T11:02:05' },
      { role: 'user', content: '면접 준비는 어떻게 해야 하나요?', timestamp: '2025-03-24T11:02:40' },
      { role: 'assistant', content: '최근 보안 이슈(랜섬웨어, 제로데이 취약점 등)를 파악하고 본인만의 의견을 정리해두세요. 기술 면접에서 Wireshark 사용 경험이나 취약점 분석 사례를 물어볼 수 있어요.', timestamp: '2025-03-24T11:03:15' },
    ],
  },
  {
    id: 'chat-006',
    userId: 'user_F',
    jobId: 'ai-dx',
    mentorId: 'lee_frontier',
    startedAt: '2025-03-25T13:00:00',
    messages: [
      { role: 'user', content: '비전공자인데 AI/DX 직무에 지원해도 될까요?', timestamp: '2025-03-25T13:00:25' },
      { role: 'assistant', content: '요즘은 비전공자도 많이 합격해요. 핵심은 포트폴리오예요. Kaggle 입상 경험이나 개인 프로젝트가 있으면 충분히 경쟁력이 있어요.', timestamp: '2025-03-25T13:01:00' },
      { role: 'user', content: '포트폴리오에 어떤 프로젝트를 넣는 게 좋을까요?', timestamp: '2025-03-25T13:01:35' },
      { role: 'assistant', content: 'LLM 기반 서비스, 데이터 분석 대시보드, 딥러닝 모델 배포 프로젝트가 효과적이에요. GitHub 링크와 함께 README를 잘 정리해두세요.', timestamp: '2025-03-25T13:02:10' },
      { role: 'user', content: '면접에서 Python 코딩 테스트가 있나요?', timestamp: '2025-03-25T13:02:45' },
      { role: 'assistant', content: '기술 면접에서 간단한 알고리즘 문제가 나올 수 있어요. LeetCode Easy~Medium 수준을 준비하고, Pandas/NumPy 기본 조작도 연습해두세요.', timestamp: '2025-03-25T13:03:20' },
    ],
  },
]

export const KEYWORD_STATS: { keyword: string; count: number; category: string }[] = [
  { keyword: '자소서', count: 18, category: '서류' },
  { keyword: '면접', count: 16, category: '면접' },
  { keyword: '포트폴리오', count: 14, category: '준비' },
  { keyword: '자격증', count: 12, category: '스펙' },
  { keyword: 'Python', count: 11, category: '기술' },
  { keyword: 'LLM', count: 10, category: '기술' },
  { keyword: 'AWS', count: 9, category: '기술' },
  { keyword: '프로젝트', count: 9, category: '준비' },
  { keyword: '신입', count: 8, category: '채용' },
  { keyword: 'GitHub', count: 7, category: '준비' },
  { keyword: 'Spring', count: 7, category: '기술' },
  { keyword: '경력', count: 6, category: '채용' },
  { keyword: '지원동기', count: 6, category: '서류' },
  { keyword: 'Docker', count: 5, category: '기술' },
  { keyword: '보안', count: 5, category: '기술' },
  { keyword: 'MLOps', count: 4, category: '기술' },
  { keyword: '합격', count: 4, category: '채용' },
  { keyword: 'Azure', count: 4, category: '기술' },
  { keyword: '코딩테스트', count: 3, category: '면접' },
  { keyword: 'CISSP', count: 3, category: '스펙' },
]
