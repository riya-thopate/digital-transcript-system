import { apiFetch, USE_MOCKS } from './api';
import type { VerificationResponse } from '@/types';
import { mockVerificationValid } from '@/mocks/data';
import { delay } from '@/utils/helpers';

export async function verifyCertificate(certificateId: string): Promise<VerificationResponse> {
  if (USE_MOCKS) {
    await delay(800);
    const id = certificateId.trim().toUpperCase();
    if (id === mockVerificationValid.certificateId || id === 'CERT-2024-DEG-00045') {
      return { ...mockVerificationValid, certificateId: id };
    }
    return {
      valid: false,
      certificateId: certificateId.trim(),
      institution: 'National Institute of Technology',
      verifiedAt: new Date().toISOString(),
    };
  }
  return apiFetch<VerificationResponse>(`/verify/${encodeURIComponent(certificateId)}`);
}
