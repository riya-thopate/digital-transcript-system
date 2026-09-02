import { apiFetch, USE_MOCKS, getToken } from './api';
import type { Document, PaginatedResponse, PageParams } from '@/types';
import { mockDocuments } from '@/mocks/data';
import { delay } from '@/utils/helpers';
import { API_BASE_URL } from './api';

export async function getMyDocuments(
  params: PageParams = {},
): Promise<PaginatedResponse<Document>> {
  if (USE_MOCKS) {
    await delay(400);
    const items = mockDocuments.filter((d) => d.studentId === 's-001');
    return {
      content: items,
      page: params.page ?? 0,
      size: params.size ?? 10,
      totalElements: items.length,
      totalPages: 1,
    };
  }
  return apiFetch<PaginatedResponse<Document>>(`/documents${buildQueryLocal(params)}`);
}

export async function downloadDocument(id: string): Promise<Blob> {
  if (USE_MOCKS) {
    await delay(500);
    const content = `%PDF-1.4\nMock document for ${id}\nThis is a placeholder file for preview only.`;
    return new Blob([content], { type: 'application/pdf' });
  }
  const res = await fetch(`${API_BASE_URL}/documents/${id}/download`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

export function getDocumentDownloadUrl(id: string): string {
  return `${API_BASE_URL}/documents/${id}/download`;
}

function buildQueryLocal(params: Record<string, unknown> | object): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      sp.append(key, String(value));
    }
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}
