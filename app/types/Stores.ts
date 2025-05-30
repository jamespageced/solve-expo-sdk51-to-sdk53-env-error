export interface ScanditStore {
  simpleScanditResults: string;
  clearSimpleScanditResults: () => void;
  setSimpleScanditResults: (results: string) => void;
}
