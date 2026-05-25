"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockUsers } from "@/data/mock";
import { authenticateUser, createUser, recoverPassword, type RegisterPayload } from "@/services/auth-service";
import type { AccessibilityNeed, User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  users: User[];
  status: "idle" | "loading" | "success" | "error";
  message: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  recover: (email: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  setAccessibilityNeeds: (needs: AccessibilityNeed[]) => void;
  verifyPcd: (documentName: string) => void;
  switchRole: (role: UserRole) => void;
  clearMessage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: mockUsers,
      status: "idle",
      message: "",
      login: async (email, password) => {
        set({ status: "loading", message: "" });
        const foundUser = await authenticateUser(get().users, email, password);

        if (!foundUser) {
          set({ status: "error", message: "Email ou senha invalidos." });
          return false;
        }

        set({ user: foundUser, status: "success", message: "Sessao iniciada com seguranca." });
        return true;
      },
      register: async (payload) => {
        set({ status: "loading", message: "" });
        try {
          const createdUser = await createUser(get().users, payload);
          set((state) => ({
            users: [createdUser, ...state.users],
            user: createdUser,
            status: "success",
            message: "Conta criada. Bem-vindo ao Rota+."
          }));
          return true;
        } catch (error) {
          set({
            status: "error",
            message: error instanceof Error ? error.message : "Nao foi possivel criar a conta."
          });
          return false;
        }
      },
      logout: () => set({ user: null, status: "idle", message: "Sessao encerrada." }),
      recover: async (email) => {
        set({ status: "loading", message: "" });
        const response = await recoverPassword(email);
        set({ status: "success", message: response.message });
        return true;
      },
      updateUser: (updates) =>
        set((state) => {
          if (!state.user) {
            return state;
          }
          const user = { ...state.user, ...updates };
          return {
            user,
            users: state.users.map((item) => (item.id === user.id ? user : item))
          };
        }),
      setAccessibilityNeeds: (needs) =>
        set((state) => {
          if (!state.user) {
            return state;
          }
          const user = {
            ...state.user,
            accessibility: {
              ...state.user.accessibility,
              needs
            }
          };
          return {
            user,
            users: state.users.map((item) => (item.id === user.id ? user : item)),
            message: "Perfil de acessibilidade atualizado."
          };
        }),
      verifyPcd: (documentName) =>
        set((state) => {
          if (!state.user) {
            return state;
          }
          const user = {
            ...state.user,
            accessibility: {
              ...state.user.accessibility,
              verifiedPcd: true,
              verificationDocument: documentName
            }
          };
          return {
            user,
            users: state.users.map((item) => (item.id === user.id ? user : item)),
            message: "Documento validado na simulacao. Selo PCD liberado."
          };
        }),
      switchRole: (role) =>
        set((state) => {
          if (!state.user) {
            return state;
          }
          const user = { ...state.user, role };
          return {
            user,
            users: state.users.map((item) => (item.id === user.id ? user : item)),
            message: "Perfil ativo alterado."
          };
        }),
      clearMessage: () => set({ message: "", status: "idle" })
    }),
    {
      name: "rota-plus-auth",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = persisted as Partial<AuthState> | undefined;

        return {
          ...current,
          ...state,
          user: state?.user ?? null,
          users: Array.isArray(state?.users) && state.users.length > 0 ? state.users : current.users,
          status: "idle",
          message: ""
        };
      },
      partialize: (state) => ({
        user: state.user,
        users: state.users
      })
    }
  )
);
