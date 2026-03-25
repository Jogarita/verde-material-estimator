import { useState } from 'react';
import { CalculationsContext, useCalculationsProvider } from './hooks/useCalculations';
import { TabNav } from './components/TabNav';
import { TotalMix } from './components/TotalMix';
import { IndividualMaterial } from './components/IndividualMaterial';
import { PaverAdjustment } from './components/PaverAdjustment';

function AppContent() {
  const calculations = useCalculationsProvider();
  const [activeTab, setActiveTab] = useState(0);

  const formatBadge = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(1);

  const tabs = [
    { label: 'Total Mix', badge: `${formatBadge(calculations.totalMixOutputs.materialTons)} tons` },
    { label: 'Individual Material', badge: `${calculations.individualMaterialOutputs.rapContent.toFixed(0)}% RAP` },
    { label: 'Paver Adjustment', badge: `${calculations.paverAdjustmentOutputs.looseThickness.toFixed(1)}" loose` },
  ];

  return (
    <CalculationsContext.Provider value={calculations}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-800 text-white shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-5">
            <h1 className="text-2xl font-bold tracking-tight">Verde Material Estimator</h1>
            <p className="text-green-200 text-sm mt-1">Paving material calculator</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
            <div className="p-6">
              {activeTab === 0 && <TotalMix />}
              {activeTab === 1 && <IndividualMaterial />}
              {activeTab === 2 && <PaverAdjustment />}
            </div>
          </div>
        </main>
      </div>
    </CalculationsContext.Provider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
