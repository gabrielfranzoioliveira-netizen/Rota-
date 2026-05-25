"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { notifications } from "@/data/mock";
import { createId } from "@/services/mock-api";
import type { NotificationItem } from "@/types";

interface NotificationState {
  notifications: NotificationItem[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearRead: () => void;
  push: (item: Omit<NotificationItem, "id" | "read" | "createdAt">) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications,
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item
          )
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((item) => ({ ...item, read: true }))
        })),
      clearRead: () =>
        set((state) => ({
          notifications: state.notifications.filter((item) => !item.read)
        })),
      push: (item) =>
        set((state) => ({
          notifications: [
            {
              ...item,
              id: createId("not"),
              read: false,
              createdAt: new Date().toISOString()
            },
            ...state.notifications
          ]
        }))
    }),
    {
      name: "rota-plus-notifications",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = persisted as Partial<NotificationState> | undefined;

        return {
          ...current,
          ...state,
          notifications: Array.isArray(state?.notifications) ? state.notifications : current.notifications
        };
      }
    }
  )
);
