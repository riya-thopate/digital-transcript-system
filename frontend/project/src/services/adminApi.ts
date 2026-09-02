import { apiFetch, buildQuery, USE_MOCKS } from './api';
import type {
  DocumentRequest,
  Document,
  Student,
  AuditLog,
  PaginatedResponse,
  PageParams,
  RequestStatus,
  DocumentType,
} from '@/types';
import {
  mockRequests,
  mockDocuments,
  mockStudents,
  mockAuditLogs,
} from '@/mocks/data';
import { delay } from '@/utils/helpers';

interface AdminRequestFilters extends PageParams {
  status?: RequestStatus;
  documentType?: DocumentType;
  search?: string;
}

function paginate<T>(items: T[], page = 0, size = 10): PaginatedResponse<T> {
  const start = page * size;
  return {
    content: items.slice(start, start + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
  };
}

export async function getAllRequests(
  filters: AdminRequestFilters = {},
): Promise<PaginatedResponse<DocumentRequest>> {
  if (USE_MOCKS) {
    await delay(400);
    let items = [...mockRequests];
    if (filters.status) items = items.filter((r) => r.status === filters.status);
    if (filters.documentType)
      items = items.filter((r) => r.documentType === filters.documentType);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.requestRef.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.studentEmail.toLowerCase().includes(q) ||
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
    `/admin/requests${buildQuery(filters)}`,
  );
}

export async function getAdminRequestById(id: string): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(300);
    const req = mockRequests.find((r) => r.id === id || r.requestRef === id);
    if (!req) throw new Error('Request not found');
    return req;
  }
  return apiFetch<DocumentRequest>(`/admin/requests/${id}`);
}

export async function approveRequest(id: string, remark?: string): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(700);
    const req = mockRequests.find((r) => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = 'APPROVED';
    req.updatedAt = new Date().toISOString();
    req.statusTimeline.push({
      id: `se-${Date.now()}`,
      status: 'APPROVED',
      timestamp: req.updatedAt,
      actor: 'Priya Iyer (Admin)',
    });
    if (remark) {
      req.remarks.push({
        id: `rm-${Date.now()}`,
        adminId: 'u-002',
        adminName: 'Priya Iyer',
        remark,
        timestamp: req.updatedAt,
      });
    }
    return req;
  }
  return apiFetch<DocumentRequest>(`/admin/requests/${id}/approve`, {
    method: 'PUT',
    body: { remark },
  });
}

export async function rejectRequest(id: string, remark: string): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(700);
    const req = mockRequests.find((r) => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = 'REJECTED';
    req.updatedAt = new Date().toISOString();
    req.statusTimeline.push({
      id: `se-${Date.now()}`,
      status: 'REJECTED',
      timestamp: req.updatedAt,
      actor: 'Priya Iyer (Admin)',
    });
    if (remark) {
      req.remarks.push({
        id: `rm-${Date.now()}`,
        adminId: 'u-002',
        adminName: 'Priya Iyer',
        remark,
        timestamp: req.updatedAt,
      });
    }
    return req;
  }
  return apiFetch<DocumentRequest>(`/admin/requests/${id}/reject`, {
    method: 'PUT',
    body: { remark },
  });
}

export async function addRemark(id: string, remark: string): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(400);
    const req = mockRequests.find((r) => r.id === id);
    if (!req) throw new Error('Request not found');
    req.remarks.push({
      id: `rm-${Date.now()}`,
      adminId: 'u-002',
      adminName: 'Priya Iyer',
      remark,
      timestamp: new Date().toISOString(),
    });
    return req;
  }
  return apiFetch<DocumentRequest>(`/admin/requests/${id}/remarks`, {
    method: 'POST',
    body: { remark },
  });
}

export async function generateDocument(id: string): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(900);
    const req = mockRequests.find((r) => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = 'DOCUMENT_GENERATED';
    req.updatedAt = new Date().toISOString();
    req.statusTimeline.push({
      id: `se-${Date.now()}`,
      status: 'DOCUMENT_GENERATED',
      timestamp: req.updatedAt,
      actor: 'Priya Iyer (Admin)',
    });
    return req;
  }
  return apiFetch<DocumentRequest>(`/admin/requests/${id}/generate`, {
    method: 'PUT',
  });
}

export async function markAvailable(id: string): Promise<DocumentRequest> {
  if (USE_MOCKS) {
    await delay(500);
    const req = mockRequests.find((r) => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = 'AVAILABLE';
    req.updatedAt = new Date().toISOString();
    req.statusTimeline.push({
      id: `se-${Date.now()}`,
      status: 'AVAILABLE',
      timestamp: req.updatedAt,
      actor: 'Priya Iyer (Admin)',
    });
    return req;
  }
  return apiFetch<DocumentRequest>(`/admin/requests/${id}/available`, {
    method: 'PUT',
  });
}

export async function getAllStudents(
  params: PageParams & { search?: string; department?: string } = {},
): Promise<PaginatedResponse<Student>> {
  if (USE_MOCKS) {
    await delay(400);
    let items = [...mockStudents];
    if (params.department)
      items = items.filter((s) => s.department === params.department);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (s) =>
          s.studentId.toLowerCase().includes(q) ||
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q),
      );
    }
    return paginate(items, params.page ?? 0, params.size ?? 10);
  }
  return apiFetch<PaginatedResponse<Student>>(`/admin/students${buildQuery(params)}`);
}

export async function getAllDocuments(
  params: PageParams & { search?: string } = {},
): Promise<PaginatedResponse<Document>> {
  if (USE_MOCKS) {
    await delay(400);
    let items = [...mockDocuments];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (d) =>
          d.documentRef.toLowerCase().includes(q) ||
          d.studentName.toLowerCase().includes(q) ||
          d.documentType.toLowerCase().includes(q),
      );
    }
    return paginate(items, params.page ?? 0, params.size ?? 10);
  }
  return apiFetch<PaginatedResponse<Document>>(`/admin/documents${buildQuery(params)}`);
}

export async function getAuditLogs(
  params: PageParams & { search?: string; action?: string } = {},
): Promise<PaginatedResponse<AuditLog>> {
  if (USE_MOCKS) {
    await delay(400);
    let items = [...mockAuditLogs];
    if (params.action) items = items.filter((l) => l.action === params.action);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (l) =>
          l.userName.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.entityId.toLowerCase().includes(q) ||
          l.details?.toLowerCase().includes(q),
      );
    }
    items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return paginate(items, params.page ?? 0, params.size ?? 10);
  }
  return apiFetch<PaginatedResponse<AuditLog>>(`/admin/audit-logs${buildQuery(params)}`);
}

export async function getDashboardStats(): Promise<{
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  documentGenerated: number;
}> {
  if (USE_MOCKS) {
    await delay(300);
    const all = mockRequests;
    return {
      total: all.length,
      pending: all.filter((r) => r.status === 'PENDING').length,
      underReview: all.filter((r) => r.status === 'UNDER_REVIEW').length,
      approved: all.filter((r) => r.status === 'APPROVED').length,
      rejected: all.filter((r) => r.status === 'REJECTED').length,
      documentGenerated: all.filter(
        (r) => r.status === 'DOCUMENT_GENERATED' || r.status === 'AVAILABLE',
      ).length,
    };
  }
  return apiFetch('/admin/dashboard/stats');
}
