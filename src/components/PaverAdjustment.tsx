import { useCalculations } from '../hooks/useCalculations';
import { InputField } from './InputField';
import { OutputField } from './OutputField';
import { ResetButton } from './ResetButton';
import { CrossSheetRef } from './CrossSheetRef';

function validate(field: string, value: number): string | undefined {
  if (value < 0) return 'Cannot be negative';
  if (field === 'compaction' && value === 0) return 'Compaction factor cannot be zero';
  return undefined;
}

export function PaverAdjustment() {
  const { totalMix, totalMixOutputs, paverAdjustment, paverAdjustmentOutputs, setPaverAdjustment, resetPaverAdjustment } = useCalculations();

  const isThin = paverAdjustmentOutputs.recommendation.includes('thin');

  return (
    <div>
      <div className="mb-4 flex flex-col gap-1.5">
        <CrossSheetRef label="Thickness" value={totalMix.thickness} decimals={1} source="Total Mix" />
        <CrossSheetRef label="Material needed" value={totalMixOutputs.materialTons} source="Total Mix" />
        <CrossSheetRef label="Section length" value={totalMix.length} decimals={0} source="Total Mix" />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Input</h3>
            <ResetButton onClick={resetPaverAdjustment} />
          </div>
          <div className="flex flex-col gap-4">
            <InputField label="Compaction Factor" value={paverAdjustment.compactionFactor} onChange={v => setPaverAdjustment('compactionFactor', v)} step={0.1} warning={validate('compaction', paverAdjustment.compactionFactor)} />
            <div className="text-xs text-gray-500 -mt-2 ml-1">Target thickness x Compaction Factor = Loose thickness</div>
            <InputField label="Trial material weight" unit="tons" value={paverAdjustment.trialWeight} onChange={v => setPaverAdjustment('trialWeight', v)} step={0.1} warning={validate('weight', paverAdjustment.trialWeight)} />
            <InputField label="Length paved" unit="ft" value={paverAdjustment.lengthPaved} onChange={v => setPaverAdjustment('lengthPaved', v)} step={0.1} warning={validate('length', paverAdjustment.lengthPaved)} />
            <InputField label="Adjusted screed height" unit="in" value={paverAdjustment.adjustedScreedHeight} onChange={v => setPaverAdjustment('adjustedScreedHeight', v)} step={0.1} warning={validate('screed', paverAdjustment.adjustedScreedHeight)} />
          </div>
        </div>
        <div className="md:sticky md:top-4 self-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Output</h3>
          <div className="bg-green-50 rounded-xl p-5">
            <OutputField label="Loose thickness" unit="in" value={paverAdjustmentOutputs.looseThickness} />
            <OutputField label="Yield" unit="tons/ft" value={paverAdjustmentOutputs.yieldTonsPerFt} decimals={4} />
            <OutputField label="Length it should pave" unit="ft" value={paverAdjustmentOutputs.lengthShouldPave} decimals={6} />
            <div className={`mt-3 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
              isThin
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {isThin ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                </svg>
              )}
              {paverAdjustmentOutputs.recommendation}
            </div>
            <div className="mt-3">
              <OutputField label="Adjusted compaction factor" value={paverAdjustmentOutputs.adjustedCompactionFactor} decimals={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
