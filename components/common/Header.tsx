// components/common/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    { href: '/test', label: 'MBTI 검사' },
    { href: '/community', label: '커뮤니티' },
    { href: '/match', label: '친구 매칭' },
    { href: '/counseling', label: 'AI 상담' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 로고 영역 (우측 가로 결합형) */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="relative h-8 w-36">
            <Image
              src="/assets/images/logo/horizontal-logo.png"
              alt="MindMatch 로고"
              fill
              priority
              className="object-contain" 
            />
          </div>
        </Link>

        {/* 데스크톱 내비게이션 메뉴 (GNB) */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`text-sm font-medium transition-colors hover:text-[var(--brand-blue)] ${
                isActive(item.href) ? 'text-[var(--brand-blue)] font-semibold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 데스크톱 우측 로그인 버튼 */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <button className="rounded-full bg-[var(--brand-navy)] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[var(--brand-blue)] dark:bg-[var(--brand-blue)] dark:hover:bg-blue-600">
              시작하기
            </button>
          </Link>
        </div>

        {/* 모바일 햄버거 메뉴 버튼 (Radix UI Dialog 트리거) */}
        <div className="flex md:hidden">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button 
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="메뉴 열기"
              >
                <Menu className="h-6 w-6" />
              </button>
            </Dialog.Trigger>
            
            <Dialog.Portal>
              {/* 반투명 오버레이 배경 */}
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in" />
              
              {/* 오른쪽에서 슬라이드인되는 모바일 사이드바 콘텐츠 */}
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-[var(--background)] p-6 shadow-xl transition ease-in-out data-[state=open]:animate-slide-in-from-right border-l border-[var(--border)] flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <Dialog.Title className="text-lg font-bold text-[var(--brand-navy)] dark:text-white">
                      메뉴
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="메뉴 닫기">
                        <X className="h-6 w-6" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* 모바일 세로 메뉴 링크 리스트 */}
                  <nav className="mt-6 flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Dialog.Close asChild key={item.href}>
                        <Link 
                          href={item.href}
                          className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            isActive(item.href) ? 'text-[var(--brand-blue)] bg-slate-50 dark:bg-slate-800 font-semibold' : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </Dialog.Close>
                    ))}
                  </nav>
                </div>

                {/* 모바일 드로워 하단 로그인/시작 버튼 섹션 */}
                <div className="border-t border-[var(--border)] pt-4">
                  <Dialog.Close asChild>
                    <Link href="/login" className="block w-full">
                      <button className="w-full rounded-xl bg-[var(--brand-navy)] py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[var(--brand-blue)] dark:bg-[var(--brand-blue)]">
                        시작하기
                      </button>
                    </Link>
                  </Dialog.Close>
                </div>

              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

      </div>
    </header>
  );
}
