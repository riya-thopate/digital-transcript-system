import { apiFetch, USE_MOCKS } from './api';
import type { Notification } from '@/types';
import { mockNotifications } from '@/mocks/data';
import { delay } from '@/utils/helpers';

export async function getMyNotifications(): Promise<Notification[]> {
  if (USE_MOCKS) {
    await delay(300);
    return [...mockNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return apiFetch<Notification[]>('/notifications');
}

export async function markNotificationRead(id: string): Promise<void> {
  if (USE_MOCKS) {
    await delay(150);
    const n = mockNotifications.find((x) => x.id === id);
    if (n) n.read = true;
    return;
  }
  return apiFetch<void>(`/notifications/${id}/read`, { method: 'PUT' });
}

export async function markAllNotificationsRead(): Promise<void> {
  if (USE_MOCKS) {
    await delay(300);
    mockNotifications.forEach((n) => (n.read = true));
    return;
  }
  return apiFetch<void>('/notifications/read-all', { method: 'PUT' });
}
