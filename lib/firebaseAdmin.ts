import 'server-only'
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function loadServiceAccount(): ServiceAccount {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (b64) {
    const json = JSON.parse(Buffer.from(b64.trim(), 'base64').toString('utf8')) as {
      project_id: string
      client_email: string
      private_key: string
    }
    return { projectId: json.project_id, clientEmail: json.client_email, privateKey: json.private_key }
  }

  const privateKey = (process.env.FIREBASE_PRIVATE_KEY ?? '')
    .trim()
    .replace(/,$/, '')
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'Firebase 비공개 키를 읽지 못했습니다. .env.local의 FIREBASE_SERVICE_ACCOUNT_BASE64 값을 확인하세요.',
    )
  }
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }
}

const app = getApps()[0] ?? initializeApp({ credential: cert(loadServiceAccount()) })

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)