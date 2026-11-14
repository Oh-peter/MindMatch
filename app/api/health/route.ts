export function GET() {
  const len = (v: string | undefined) => (v ? v.length : 0)
  return Response.json({
    apiKey: len(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: len(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: len(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    appId: len(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    serviceAccount: len(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64),
  })
}