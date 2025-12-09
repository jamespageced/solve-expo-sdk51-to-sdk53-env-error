export interface ScanditStore {
  simpleScanditResults: string;
  isTorchOn: boolean;
  clearSimpleScanditResults: () => void;
  setSimpleScanditResults: (results: string) => void;
  setIsTorchOn: (value: boolean) => void;
}
