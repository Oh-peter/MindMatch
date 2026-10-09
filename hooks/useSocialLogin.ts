'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { clientAuth } from '@/lib/firebaseClient';
import { createSession } from '@/actions/auth';

export type Provider = 'google' | 'kakao';

export function useSocialLogin(next: string = '/') {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const login = (provider: Provider) => {
    setError(null);
    // React 19 비동기 Transition: pending이 작업 전체 동안 유지됨
    startTransition(async () => {
      try {
        const authProvider =
          provider === 'google' ? new GoogleAuthProvider() : new OAuthProvider('oidc.kakao');

        const cred = await signInWithPopup(clientAuth, authProvider);
        const idToken = await cred.user.getIdToken();

        await createSession(idToken); // 세션 발급 + 게스트 데이터 이관
        await signOut(clientAuth);    // 클라이언트 측 인증 상태 정리

        router.replace(next);
        router.refresh();
      } catch {
        setError('로그인에 실패했어요. 잠시 후 다시 시도해 주세요.');
      }
    });
  };

  return { login, pending, error };
}