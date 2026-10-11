'use client'

import { useEffect, useState } from 'react'
import styles from './match.module.css'

export default function ShareLink({ path }: { path: string }) {
  const [url, setUrl] = useState(path)
  const [canShare, setCanShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`)
    setCanShare(typeof navigator.share === 'function')
  }, [path])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('링크를 복사해 주세요.', url)
    }
  }

  async function handleShare() {
    try {
      await navigator.share({ title: 'MindMatch 궁합 보기', text: '나랑 궁합 볼래?', url })
    } catch {
      // 공유 창을 닫은 경우는 무시합니다.
    }
  }

  return (
    <div className={styles.share}>
      <div className={styles.linkBox}>{url}</div>
      <div className={styles.row}>
        <button type="button" className={styles.btn} onClick={handleCopy}>
          {copied ? '복사했어요' : '링크 복사'}
        </button>
        {canShare && (
          <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={handleShare}>
            공유하기
          </button>
        )}
      </div>
    </div>
  )
}