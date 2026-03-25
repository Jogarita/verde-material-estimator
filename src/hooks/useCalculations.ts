import { createContext, useContext, useState, useMemo, useCallback } from 'react';

export interface TotalMixInputs {
  length: number;
  width: number;
  thickness: number;
  targetDensity: number;
  safetyFactor: number;
  loadPerTruck: number;
}

export interface IndividualMaterialInputs {
  optimumFluidContent: number;
  moistureRAP: number;
  moistureBiochar: number;
  targetEmulsion: number;
  targetBiochar: number;
  targetCement: number;
}

export interface PaverAdjustmentInputs {
  compactionFactor: number;
  trialWeight: number;
  lengthPaved: number;
  adjustedScreedHeight: number;
}

export interface TotalMixOutputs {
  volume: number;
  materialLb: number;
  materialTons: number;
  truckLoads: number;
}

export interface IndividualMaterialOutputs {
  rapContent: number;
  additionalWater: number;
  rapTons: number;
  biocharTons: number;
  cementTons: number;
  emulsionTons: number;
  additionalWaterTons: number;
}

export interface PaverAdjustmentOutputs {
  looseThickness: number;
  yieldTonsPerFt: number;
  recommendation: string;
  lengthShouldPave: number;
  adjustedCompactionFactor: number;
}

export const TOTAL_MIX_DEFAULTS: TotalMixInputs = {
  length: 200,
  width: 12,
  thickness: 4.5,
  targetDensity: 125,
  safetyFactor: 10,
  loadPerTruck: 22,
};

export const INDIVIDUAL_MATERIAL_DEFAULTS: IndividualMaterialInputs = {
  optimumFluidContent: 8,
  moistureRAP: 2,
  moistureBiochar: 17,
  targetEmulsion: 4,
  targetBiochar: 3,
  targetCement: 1,
};

export const PAVER_ADJUSTMENT_DEFAULTS: PaverAdjustmentInputs = {
  compactionFactor: 1.5,
  trialWeight: 1,
  lengthPaved: 8,
  adjustedScreedHeight: 2.5,
};

export interface CalculationsState {
  totalMix: TotalMixInputs;
  individualMaterial: IndividualMaterialInputs;
  paverAdjustment: PaverAdjustmentInputs;
  totalMixOutputs: TotalMixOutputs;
  individualMaterialOutputs: IndividualMaterialOutputs;
  paverAdjustmentOutputs: PaverAdjustmentOutputs;
  setTotalMix: (field: keyof TotalMixInputs, value: number) => void;
  setIndividualMaterial: (field: keyof IndividualMaterialInputs, value: number) => void;
  setPaverAdjustment: (field: keyof PaverAdjustmentInputs, value: number) => void;
  resetTotalMix: () => void;
  resetIndividualMaterial: () => void;
  resetPaverAdjustment: () => void;
}

export const CalculationsContext = createContext<CalculationsState | null>(null);

export function useCalculationsProvider(): CalculationsState {
  const [totalMix, setTotalMixState] = useState<TotalMixInputs>({ ...TOTAL_MIX_DEFAULTS });
  const [individualMaterial, setIndividualMaterialState] = useState<IndividualMaterialInputs>({ ...INDIVIDUAL_MATERIAL_DEFAULTS });
  const [paverAdjustment, setPaverAdjustmentState] = useState<PaverAdjustmentInputs>({ ...PAVER_ADJUSTMENT_DEFAULTS });

  const setTotalMix = useCallback((field: keyof TotalMixInputs, value: number) => {
    setTotalMixState(prev => ({ ...prev, [field]: value }));
  }, []);

  const setIndividualMaterial = useCallback((field: keyof IndividualMaterialInputs, value: number) => {
    setIndividualMaterialState(prev => ({ ...prev, [field]: value }));
  }, []);

  const setPaverAdjustment = useCallback((field: keyof PaverAdjustmentInputs, value: number) => {
    setPaverAdjustmentState(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetTotalMix = useCallback(() => setTotalMixState({ ...TOTAL_MIX_DEFAULTS }), []);
  const resetIndividualMaterial = useCallback(() => setIndividualMaterialState({ ...INDIVIDUAL_MATERIAL_DEFAULTS }), []);
  const resetPaverAdjustment = useCallback(() => setPaverAdjustmentState({ ...PAVER_ADJUSTMENT_DEFAULTS }), []);

  const totalMixOutputs = useMemo<TotalMixOutputs>(() => {
    const volume = totalMix.length * totalMix.width * (totalMix.thickness / 12);
    const materialLb = (1 + totalMix.safetyFactor / 100) * totalMix.targetDensity * volume;
    const materialTons = materialLb / 2000;
    const truckLoads = totalMix.loadPerTruck > 0 ? Math.ceil(materialTons / totalMix.loadPerTruck) : 0;
    return { volume, materialLb, materialTons, truckLoads };
  }, [totalMix]);

  const individualMaterialOutputs = useMemo<IndividualMaterialOutputs>(() => {
    const rapContent = 100 - individualMaterial.targetBiochar - individualMaterial.targetCement;
    const additionalWater =
      individualMaterial.optimumFluidContent -
      individualMaterial.targetEmulsion -
      (individualMaterial.moistureRAP / 100) * rapContent -
      (individualMaterial.moistureBiochar / 100) * individualMaterial.targetBiochar;

    const totalParts =
      individualMaterial.targetEmulsion +
      individualMaterial.targetBiochar +
      individualMaterial.targetCement +
      rapContent +
      additionalWater;

    const tons = totalMixOutputs.materialTons;
    const rapTons = totalParts !== 0 ? (rapContent / totalParts) * tons : 0;
    const biocharTons = totalParts !== 0 ? (individualMaterial.targetBiochar / totalParts) * tons : 0;
    const cementTons = totalParts !== 0 ? (individualMaterial.targetCement / totalParts) * tons : 0;
    const emulsionTons = totalParts !== 0 ? (individualMaterial.targetEmulsion / totalParts) * tons : 0;
    const additionalWaterTons = totalParts !== 0 ? (additionalWater / totalParts) * tons : 0;

    return { rapContent, additionalWater, rapTons, biocharTons, cementTons, emulsionTons, additionalWaterTons };
  }, [individualMaterial, totalMixOutputs.materialTons]);

  const paverAdjustmentOutputs = useMemo<PaverAdjustmentOutputs>(() => {
    const looseThickness = totalMix.thickness * paverAdjustment.compactionFactor;
    const yieldTonsPerFt = totalMix.length > 0 ? totalMixOutputs.materialTons / totalMix.length : 0;
    const lengthShouldPave = yieldTonsPerFt > 0 ? paverAdjustment.trialWeight / yieldTonsPerFt : 0;
    const recommendation =
      paverAdjustment.lengthPaved > lengthShouldPave
        ? 'Paver is paving thin, adjust screed'
        : 'Paver is paving thick, adjust screed';
    const adjustedCompactionFactor = totalMix.thickness > 0
      ? paverAdjustment.adjustedScreedHeight / totalMix.thickness
      : 0;
    return { looseThickness, yieldTonsPerFt, recommendation, lengthShouldPave, adjustedCompactionFactor };
  }, [totalMix.thickness, totalMix.length, totalMixOutputs.materialTons, paverAdjustment]);

  return {
    totalMix,
    individualMaterial,
    paverAdjustment,
    totalMixOutputs,
    individualMaterialOutputs,
    paverAdjustmentOutputs,
    setTotalMix,
    setIndividualMaterial,
    setPaverAdjustment,
    resetTotalMix,
    resetIndividualMaterial,
    resetPaverAdjustment,
  };
}

export function useCalculations(): CalculationsState {
  const ctx = useContext(CalculationsContext);
  if (!ctx) throw new Error('useCalculations must be used within CalculationsContext');
  return ctx;
}
