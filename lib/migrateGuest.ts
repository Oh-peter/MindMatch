import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebaseAdmin';

export async function migrateGuestData(guestId: string, uid: string) {
  const guestRef = adminDb.collection('guests').doc(guestId);

  // 1) 선점(claim): 이미 다른 uid가 가져갔다면 중단
  const claimed = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(guestRef);
    if (!snap.exists) return false;
    const claimedBy = snap.get('claimedBy');
    if (claimedBy && claimedBy !== uid) return false;
    tx.update(guestRef, {
      claimedBy: uid,
      claimedAt: FieldValue.serverTimestamp(),
      expiresAt: FieldValue.delete(), // TTL 정리 대상에서 제외하지 않아도 되면 생략 가능
    });
    return true;
  });
  if (!claimed) return { migrated: 0 };

  // 2) 결과 소유권 이전 (배치 500건 제한 → 청크 반복)
  let migrated = 0;
  for (;;) {
    const snap = await adminDb
      .collection('testResults')
      .where('ownerType', '==', 'guest')
      .where('ownerId', '==', guestId)
      .limit(400)
      .get();
    if (snap.empty) break;

    const batch = adminDb.batch();
    for (const doc of snap.docs) {
      batch.update(doc.ref, {
        ownerType: 'user',
        ownerId: uid,
        migratedFrom: guestId,
        migratedAt: FieldValue.serverTimestamp(),
        expiresAt: FieldValue.delete(), // 회원 데이터는 TTL 삭제 금지
      });
    }
    await batch.commit();
    migrated += snap.size;
  }
  return { migrated };
}