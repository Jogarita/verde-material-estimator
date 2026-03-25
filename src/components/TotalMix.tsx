import { useCalculations } from '../hooks/useCalculations';
import { InputField } from './InputField';
import { OutputField } from './OutputField';
import { ResetButton } from './ResetButton';

function validate(label: string, value: number): string | undefined {
  if (value < 0) return `${label} cannot be negative`;
  if (label === 'Safety factor' && value > 100) return 'Unusually high safety factor';
  if (label === 'Thickness' && value > 24) return 'Unusually thick section';
  return undefined;
}

export function TotalMix() {
  const { totalMix, totalMixOutputs, setTotalMix, resetTotalMix } = useCalculations();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Input</h3>
          <ResetButton onClick={resetTotalMix} />
        </div>
        <div className="flex flex-col gap-4">
          <InputField label="Length of section" unit="ft" value={totalMix.length} onChange={v => setTotalMix('length', v)} warning={validate('Length', totalMix.length)} />
          <InputField label="Width of section" unit="ft" value={totalMix.width} onChange={v => setTotalMix('width', v)} warning={validate('Width', totalMix.width)} />
          <InputField label="Thickness" unit="in" value={totalMix.thickness} onChange={v => setTotalMix('thickness', v)} step={0.5} warning={validate('Thickness', totalMix.thickness)} />
          <InputField label="Target density" unit="pcf" value={totalMix.targetDensity} onChange={v => setTotalMix('targetDensity', v)} warning={validate('Target density', totalMix.targetDensity)} />
          <InputField label="Safety factor" unit="%" value={totalMix.safetyFactor} onChange={v => setTotalMix('safetyFactor', v)} warning={validate('Safety factor', totalMix.safetyFactor)} />
          <InputField label="Load per truck" unit="tons" value={totalMix.loadPerTruck} onChange={v => setTotalMix('loadPerTruck', v)} warning={validate('Load per truck', totalMix.loadPerTruck)} />
        </div>
      </div>
      <div className="md:sticky md:top-4 self-start">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Output</h3>
        <div className="bg-green-50 rounded-xl p-5">
          <OutputField label="Volume of section" unit="ft³" value={totalMixOutputs.volume} />
          <OutputField label="Material needed" unit="lb" value={totalMixOutputs.materialLb} />
          <OutputField label="Material needed" unit="tons" value={totalMixOutputs.materialTons} />
          <OutputField label="Truck loads needed" value={totalMixOutputs.truckLoads} decimals={0} />
        </div>
      </div>
    </div>
  );
}
