export type UserRole = 'STUDENT' | 'ADMIN' | 'VERIFIER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  studentId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  course: string;
  department: string;
  yearOfStudy: number;
  enrollmentYear: number;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
}

export type DocumentType =
  | 'OFFICIAL_TRANSCRIPT'
  | 'DEGREE_CERTIFICATE'
  | 'BONAFIDE_CERTIFICATE'
  | 'COURSE_COMPLETION_CERTIFICATE';

export type RequestStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'DOCUMENT_GENERATED'
  | 'AVAILABLE';

export interface SupportingDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  downloadUrl?: string;
}

export interface StatusEvent {
  id: string;
  status: RequestStatus;
  timestamp: string;
  remark?: string;
  actor?: string;
}

export interface AdminRemark {
  id: string;
  adminId: string;
  adminName: string;
  remark: string;
  timestamp: string;
}

export interface DocumentRequest {
  id: string;
  requestRef: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCourse: string;
  studentDepartment: string;
  documentType: DocumentType;
  purpose: string;
  numberOfCopies: number;
  additionalInfo?: string;
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
  supportingDocuments: SupportingDocument[];
  statusTimeline: StatusEvent[];
  remarks: AdminRemark[];
  issuedDocumentId?: string;
}

export type DocumentStatus = 'ISSUED' | 'REVOKED' | 'EXPIRED';

export interface Document {
  id: string;
  documentRef: string;
  studentId: string;
  studentName: string;
  documentType: DocumentType;
  issueDate: string;
  status: DocumentStatus;
  fileName: string;
  fileSize: number;
  requestId: string;
}

export type NotificationType = 'REQUEST_UPDATE' | 'DOCUMENT_READY' | 'SYSTEM' | 'VERIFICATION';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  requestId?: string;
  timestamp: string;
  details?: string;
}

export interface AuthenticationResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

export interface VerificationResponse {
  valid: boolean;
  certificateId: string;
  documentType?: DocumentType;
  issueDate?: string;
  studentName?: string;
  studentCourse?: string;
  studentDepartment?: string;
  institution: string;
  status?: DocumentStatus;
  verifiedAt: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentId: string;
  course: string;
  department: string;
  yearOfStudy: number;
}

export interface CreateDocumentRequest {
  documentType: DocumentType;
  purpose: string;
  numberOfCopies: number;
  additionalInfo?: string;
  supportingDocuments: File[];
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
