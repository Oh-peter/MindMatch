// types/index.ts

// 1. test_results 컬렉션 스키마 타입
export interface TestResultSchema {
  id: string;               // 문서 고유 ID
  guestId: string;         // 비회원 식별용 쿠키 토큰
  userId: string | null;    // 소셜 가입 회원 UID (비회원일 땐 null)
  mbti: 'INFP' | 'ENFP' | 'INFJ' | 'ENFJ' | 'INTJ' | 'ENTJ' | 'INTP' | 'ENTP' | 'ISFP' | 'ESFP' | 'ISFJ' | 'ESFJ' | 'ISTJ' | 'ESTJ' | 'ISTP' | 'ESTP';
  matchedCharacter: string; // 5단계에서 매칭된 동식물 캐릭터 키
  createdAt: string;        // ISO 8601 타임스탬프 문자열
}

// 2. users 컬렉션 스키마 타입
export interface UserSchema {
  uid: string;              // Firebase Auth 고유 uid
  email: string;
  displayName: string;
  photoURL: string;
  joinedAt: string;
}

// 3. community_posts 컬렉션 스키마 타입
export interface CommunityPostSchema {
  id: string;
  mbtiCategory: string;     // 게시판 필터링 키
  authorId: string;         // 작성자 uid
  content: string;          // 게시글 본문
  likes: number;            // 좋아요 수
  createdAt: string;
}
