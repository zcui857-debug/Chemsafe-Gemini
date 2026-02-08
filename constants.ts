
import { StorageCategory } from './types';

export const CATEGORY_NAMES: Record<StorageCategory, string> = {
  '1': '爆炸物 1.1 - 1.5项',
  '4.1A': '自反应物质/有机过氧化物 A型/B型',
  '5.2': '自反应物质/有机过氧化物 C型-F型',
  '4.2': '自燃液体/固体/自热物质',
  '4.3': '遇水放出易燃气体的物质',
  '4.1B': '易燃固体 类别1、2',
  '5.1A': '氧化性液体/固体 类别1',
  '5.1B': '氧化性液体/固体 类别2、3',
  '3': '易燃液体 类别1、2、3',
  '6.1A': '急性毒性 类别1、2 (可燃)',
  '6.1B': '急性毒性 类别1、2 (不可燃)',
  '6.1C': '急性毒性 类别3 (可燃)',
  '6.1D': '急性毒性 类别3 (不可燃)',
  '8A': '皮肤腐蚀 类别1 (可燃)',
  '8B': '皮肤腐蚀 类别1 (不可燃)',
  'UNKNOWN': '未知/未分类'
};

// Compatibility Matrix from Image 2
// O = Compatible (true), X = Incompatible (false)
// Rows: [3, 4.1B, 5.1A, 5.1B, 6.1A, 6.1B, 6.1C, 6.1D, 8A, 8B]
export const COMPATIBILITY_MATRIX: Record<string, Record<string, boolean>> = {
  '3':    { '3': true, '4.1B': false, '5.1A': false, '5.1B': false, '6.1A': true, '6.1B': false, '6.1C': true, '6.1D': false, '8A': true, '8B': true },
  '4.1B': { '3': false, '4.1B': true, '5.1A': false, '5.1B': false, '6.1A': false, '6.1B': false, '6.1C': true, '6.1D': false, '8A': true, '8B': true },
  '5.1A': { '3': false, '4.1B': false, '5.1A': true, '5.1B': true, '6.1A': false, '6.1B': false, '6.1C': false, '6.1D': false, '8A': false, '8B': false },
  '5.1B': { '3': false, '4.1B': false, '5.1A': true, '5.1B': true, '6.1A': false, '6.1B': false, '6.1C': false, '6.1D': false, '8A': false, '8B': true },
  '6.1A': { '3': true, '4.1B': false, '5.1A': false, '5.1B': false, '6.1A': true, '6.1B': true, '6.1C': true, '6.1D': true, '8A': true, '8B': true },
  '6.1B': { '3': false, '4.1B': false, '5.1A': false, '5.1B': false, '6.1A': true, '6.1B': true, '6.1C': true, '6.1D': true, '8A': true, '8B': true },
  '6.1C': { '3': true, '4.1B': true, '5.1A': false, '5.1B': false, '6.1A': true, '6.1B': true, '6.1C': true, '6.1D': true, '8A': true, '8B': true },
  '6.1D': { '3': false, '4.1B': false, '5.1A': false, '5.1B': false, '6.1A': true, '6.1B': true, '6.1C': true, '6.1D': true, '8A': true, '8B': true },
  '8A':   { '3': true, '4.1B': true, '5.1A': false, '5.1B': false, '6.1A': true, '6.1B': true, '6.1C': true, '6.1D': true, '8A': true, '8B': true },
  '8B':   { '3': true, '4.1B': true, '5.1A': false, '5.1B': true, '6.1A': true, '6.1B': true, '6.1C': true, '6.1D': true, '8A': true, '8B': true }
};

// Priority list for high-hazard categories not in the matrix (typically stored alone)
export const SPECIAL_HAZARD_CATEGORIES: StorageCategory[] = ['1', '4.1A', '5.2', '4.2', '4.3'];
