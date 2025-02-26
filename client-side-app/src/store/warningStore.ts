"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// สร้าง Zustand store แบบเก็บใน localStorage
interface WarningState {
  warningMessage: string;
  setWarningMessage: (message: string) => void;
}

export const useWarningStore = create<WarningState>()(
  persist(
    (set) => ({
      warningMessage: "",
      setWarningMessage: (message) => set({ warningMessage: message }),
    }),
    {
      name: "warning-storage", // ชื่อ key ใน localStorage
    }
  )
);
