import { useCalculations } from '../hooks/useCalculations';
import { InputField } from './InputField';
import { OutputField } from './OutputField';
import { ResetButton } from './ResetButton';
import { CrossSheetRef } from './CrossSheetRef';

function validate(field: string, value: number, totalPercent?: number): string | undefined {
  if (value < 0) return 'Cannot be negative';
  if (field === 'percent' && value > 100) return 'Cannot exceed 100%';
  if (field === 'moistureRAP' && value > 0 && (value < 2 || value > 3)) return 'Should be around 2-3%';
  if (field === 'moistureBiochar' && value > 0 && (value < 17 || value > 20)) return 'Should be around 17-20%';
  if (field === 'totalPercent' && totalPercent !== undefined && totalPercent > 100) return 'Biochar + Cement exceeds 100%';
  return undefined;
}

export function IndividualMaterial() {
  const { individualMaterial, individualMaterialOutputs, totalMixOutputs, setIndividualMaterial, resetIndividualMaterial } = useCalculations();
  const totalTargetPercent = individualMaterial.targetBiochar + individualMaterial.targetCement;

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm text-amber-800">
        <strong>Note:</strong> RAP must be around 2-3% moisture and Biochar must be around 17-20% moisture.
      </div>
      <div className="mb-4 flex flex-col gap-1.5">
        <CrossSheetRef label="Material needed" value={totalMixOutputs.materialTons} source="Total Mix" />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Input</h3>
            <ResetButton onClick={resetIndividualMaterial} />
          </div>
          <div className="flex flex-col gap-4">
            <InputField label="Optimum Fluid Content (% Aggregate)" unit="%" value={individualMaterial.optimumFluidContent} onChange={v => setIndividualMaterial('optimumFluidContent', v)} step={0.1} warning={validate('percent', individualMaterial.optimumFluidContent)} />
            <InputField label="Moisture content of RAP" unit="%" value={individualMaterial.moistureRAP} onChange={v => setIndividualMaterial('moistureRAP', v)} step={0.1} warning={validate('moistureRAP', individualMaterial.moistureRAP)} />
            <InputField label="Moisture content of Biochar" unit="%" value={individualMaterial.moistureBiochar} onChange={v => setIndividualMaterial('moistureBiochar', v)} step={0.1} warning={validate('moistureBiochar', individualMaterial.moistureBiochar)} />
            <InputField label="Target Emulsion content" unit="%" value={individualMaterial.targetEmulsion} onChange={v => setIndividualMaterial('targetEmulsion', v)} step={0.1} warning={validate('percent', individualMaterial.targetEmulsion)} />
            <InputField label="Target Biochar content" unit="%" value={individualMaterial.targetBiochar} onChange={v => setIndividualMaterial('targetBiochar', v)} step={0.1} warning={validate('totalPercent', individualMaterial.targetBiochar, totalTargetPercent)} />
            <InputField label="Target Cement content" unit="%" value={individualMaterial.targetCement} onChange={v => setIndividualMaterial('targetCement', v)} step={0.1} warning={validate('totalPercent', individualMaterial.targetCement, totalTargetPercent)} />
          </div>
        </div>
        <div className="md:sticky md:top-4 self-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Output</h3>
          <div className="bg-green-50 rounded-xl p-5">
            <OutputField label="RAP content" unit="%" value={individualMaterialOutputs.rapContent} />
            <OutputField label="Additional water content" unit="%" value={individualMaterialOutputs.additionalWater} />
            <OutputField label="RAP required" unit="tons" value={individualMaterialOutputs.rapTons} />
            <OutputField label="Biochar required" unit="tons" value={individualMaterialOutputs.biocharTons} />
            <OutputField label="Cement required" unit="tons" value={individualMaterialOutputs.cementTons} />
            <OutputField label="Emulsion required" unit="tons" value={individualMaterialOutputs.emulsionTons} />
            <OutputField label="Additional water required" unit="tons" value={individualMaterialOutputs.additionalWaterTons} />
          </div>
        </div>
      </div>
    </div>
  );
}
