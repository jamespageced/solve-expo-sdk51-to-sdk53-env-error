import { create } from 'zustand';
import type { ScanditStore } from '@app/types';

export const useScanditStore = create<ScanditStore>((set, get) => ({
  simpleScanditResults: '',
  isTorchOn: false,
  clearSimpleScanditResults: () => {
    set(() => ({ simpleScanditResults: '' }));
  },
  setSimpleScanditResults: (results: string) => {
    set(() => ({ simpleScanditResults: results }));
  },
  setIsTorchOn: (value: boolean) => {
    set(() => ({ isTorchOn: value }));
  }
}));
