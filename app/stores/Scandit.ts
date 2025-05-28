import { create } from 'zustand';
import type { ScanditStore } from '@app/types';

export const useScanditStore = create<ScanditStore>((set, get) => ({
  simpleScanditResults: '',
  clearSimpleScanditResults: () => {
    set(() => ({ simpleScanditResults: '' }));
  },
  setSimpleScanditResults: (results: string) => {
    set(() => ({ simpleScanditResults: results }));
  }
}));
