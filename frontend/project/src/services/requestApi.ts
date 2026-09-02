import { apiFetch, buildQuery, USE_MOCKS } from './api';
import type {
  CreateDocumentRequest,
  DocumentRequest,
  PaginatedResponse,
  PageParams,
  RequestStatus,
  DocumentType,
} from '@/types';
import { mockRequests } from '@/mocks/data';
import { delay } from '@/utils/helpers';

interface RequestFilters extends PageParams {
  status?: RequestStatus;
  documentType?: DocumentType;
  search?: string;
}

function paginate<T>(items: T[], page = 0, size = 10): PaginatedResponse<T> {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    page,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
  };
}

export async function getMyRequests(
  filters: RequestFilters = {},
): Promise<PaginatedResponse<DocumentRequest>> {
  if (USE_MOCKS) {
    await delay(400);
    let items = [...mockRequests].filter((r) => r.studentId === 's-001');
    if (filters.status) items = items.filter((r) => r.status === filters.status);
    if (filters.documentType)
      items = items.filter((r) => r.documentType === filters.documentType);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.requestRef.toLowerCase().includes(q) ||
          r.documentType.toLowerCase().includes(q) ||
          r.purpose.toLowerCase().includes(q),
      );
    }
    items.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return paginate(items, filters.page ?? 0, filters.size ?? 10);
  }
  return apiFetch<PaginatedResponse<DocumentRequest>>(
    `/requests${buildQuery(filters)}`,
  );
}

export async function getRequestById(id: string): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(300);
    const req = mockRequests.find((r) => r.id === id || r.requestRef === id);
    if (!req) throw new Error('Request not found');
    return req;
  }
  return apiFetch<DocumentRequest>(`/requests/${id}`);
}

export async function createRequest(
  data: CreateDocumentRequest,
): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(1000);
    const nowIso = new Date().toISOString();
    const newReq: DocumentRequest = {
      id: `r-${Date.now()}`,
      requestRef: `REQ-2024-${String(mockRequests.length + 1).padStart(4, '0')}`,
      studentId: 's-001',
      studentName: 'Arjun Sharma',
      studentEmail: 'student@college.edu',
      studentCourse: 'B.Tech Computer Science',
      studentDepartment: 'Computer Science & Engineering',
      documentType: data.documentType,
      purpose: data.purpose,
      numberOfCopies: data.numberOfCopies,
      additionalInfo: data.additionalInfo,
      status: 'PENDING',
      submittedAt: nowIso,
      updatedAt: nowIso,
      supportingDocuments: data.supportingDocuments.map((f, i) => ({
        id: `sd-${Date.now()}-${i}`,
        fileName: f.name,
        fileSize: f.size,
        fileType: f.type || 'application/octet-stream',
        uploadedAt: nowIso,
      })),
      statusTimeline: [
        { id: `se-${Date.now()}`, status: 'PENDING', timestamp: nowIso, actor: 'System' },
      ],
      remarks: [],
    };
    mockRequests.unshift(newReq);
    return newReq;
  }
  const formData = new FormData();
  formData.append('documentType', data.documentType);
  formData.append('purpose', data.purpose);
  formData.append('numberOfCopies', String(data.numberOfCopies));
  if (data.additionalInfo) formData.append('additionalInfo', data.additionalInfo);
  data.supportingDocuments.forEach((file) => formData.append('documents', file));
  return apiFetch<DocumentRequest>('/requests', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}
