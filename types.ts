
export type StorageCategory = 
  | '1' | '4.1A' | '5.2' | '4.2' | '4.3' 
  | '4.1B' | '5.1A' | '5.1B' | '3' 
  | '6.1A' | '6.1B' | '6.1C' | '6.1D' 
  | '8A' | '8B' 
  | 'UNKNOWN';

export interface ChemicalInfo {
  cas: string;
  name: string;
  hPhrases: string[];
  isCombustible: boolean;
  category: StorageCategory;
  categoryDesc: string;
}

export interface CompatibilityResult {
  compatible: boolean;
  message: string;
  icon: string;
}
