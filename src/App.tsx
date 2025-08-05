import { type FC } from "react";
import { Scheduler } from "./components/Scheduler";

const App: FC = () => {
  const initialCycleData = {
    cycleName: "Ciclo di Fisioterapia Post-operatoria",
    totalSessions: 10,
    defaultFrequency: "2 volte/settimana",
    defaultStartDate: "2025-09-01",
    defaultEndDate: "2025-10-15",
  };

  return (
    <Scheduler
      cycleName={initialCycleData.cycleName}
      totalSessions={initialCycleData.totalSessions}
      defaultFrequency={initialCycleData.defaultFrequency}
      defaultStartDate={initialCycleData.defaultStartDate}
      defaultEndDate={initialCycleData.defaultEndDate}
    />
  );
};

export default App;
