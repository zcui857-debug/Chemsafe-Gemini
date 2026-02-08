
import { StorageCategory, ChemicalInfo } from './types';
import { COMPATIBILITY_MATRIX, SPECIAL_HAZARD_CATEGORIES } from './constants';

export const determineCategory = (hPhrases: string[], isCombustible: boolean): StorageCategory => {
  const hSet = new Set(hPhrases.map(p => p.toUpperCase().trim()));

  // 1: Explosives
  if (['H201', 'H202', 'H203', 'H204', 'H205'].some(h => hSet.has(h))) return '1';

  // 4.1A: Self-reactive/Organic Peroxides A/B
  if (['H240', 'H241'].some(h => hSet.has(h))) return '4.1A';

  // 5.2: Self-reactive/Organic Peroxides C-F
  if (hSet.has('H242')) return '5.2';

  // 4.2: Pyrophoric/Self-heating
  if (['H250', 'H251', 'H252'].some(h => hSet.has(h))) return '4.2';

  // 4.3: Water-reactive
  if (['H260', 'H261'].some(h => hSet.has(h))) return '4.3';

  // 4.1B: Flammable Solids
  if (hSet.has('H228')) return '4.1B';

  // 5.1A: Oxidizing Liq/Sol Cat 1
  if (hSet.has('H271')) return '5.1A';

  // 5.1B: Oxidizing Liq/Sol Cat 2/3
  if (hSet.has('H272')) return '5.1B';

  // 3: Flammable Liquids
  if (['H224', 'H225', 'H226'].some(h => hSet.has(h))) return '3';

  // 6.1: Acute Toxicity
  const isHighTox = ['H300', 'H310', 'H330'].some(h => hSet.has(h));
  const isMedTox = ['H301', 'H311', 'H331'].some(h => hSet.has(h));

  if (isHighTox) {
    return isCombustible ? '6.1A' : '6.1B';
  }
  if (isMedTox) {
    return isCombustible ? '6.1C' : '6.1D';
  }

  // 8: Skin Corrosion
  if (hSet.has('H314')) {
    return isCombustible ? '8A' : '8B';
  }

  return 'UNKNOWN';
};

export const assessCompatibility = (chemA: ChemicalInfo, chemB: ChemicalInfo): { compatible: boolean; message: string } => {
  const catA = chemA.category;
  const catB = chemB.category;

  if (catA === 'UNKNOWN' || catB === 'UNKNOWN') {
    return { compatible: false, message: '无法识别其中一种化学品的存储分类，出于安全考虑建议分开存放。' };
  }

  // Handle special hazards (1, 4.1A, etc) which are usually highly restricted
  if (SPECIAL_HAZARD_CATEGORIES.includes(catA) || SPECIAL_HAZARD_CATEGORIES.includes(catB)) {
    if (catA === catB) {
      // Even identical high-hazard categories often require distance, but technically "compatible" in same class
      return { compatible: true, message: `同属于${catA}类高风险物质，原则上可存放于同一区域，但必须遵循特殊存储规定。` };
    }
    return { compatible: false, message: '其中包含极高危险性物质（爆炸、自燃或水敏），严禁与其它分类混存。' };
  }

  // Look up in matrix
  const matrixResult = COMPATIBILITY_MATRIX[catA]?.[catB];

  if (matrixResult === undefined) {
    return { compatible: false, message: '在相容性矩阵中未找到对应匹配，建议查阅MSDS后再做决定。' };
  }

  return {
    compatible: matrixResult,
    message: matrixResult 
      ? `分类 ${catA} 与 ${catB} 评估为“相容(O)”，原则上可以混存。` 
      : `分类 ${catA} 与 ${catB} 评估为“不相容(X)”，严禁混存。`
  };
};
