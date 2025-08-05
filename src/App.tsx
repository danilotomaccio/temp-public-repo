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


    // <div className="bg-gray-100 min-h-screen p-8 space-y-8">
    //   <ProgramCreator onProgramCreate={handleProgramCreated} />

    //   {/* Sezione per mostrare i dati ricevuti, a dimostrazione che sono stati "sollevati" */}
    //   {savedProgram && (
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h2 className="text-xl font-bold text-gray-800 mb-4">
    //         Riepilogo Programma Creato
    //       </h2>
    //       <div className="space-y-2">
    //         <h3 className="font-semibold text-gray-700">Cicli:</h3>
    //         <ul className="list-disc list-inside pl-2">
    //           {savedProgram.cycles.map((cycle) => {
    //             const cycleInfo = AVAILABLE_CYCLES.find(
    //               (c) => c.id === cycle.cycleId
    //             );
    //             return (
    //               <li key={cycle.id}>
    //                 <strong>{cycleInfo?.name || "N/D"}</strong>
    //                 {cycle.startDate &&
    //                   ` (dal ${cycle.startDate} al ${cycle.endDate || "N/D"})`}
    //               </li>
    //             );
    //           })}
    //         </ul>
    //         {savedProgram.notes && (
    //           <>
    //             <h3 className="font-semibold text-gray-700 pt-2">Note:</h3>
    //             <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
    //               {savedProgram.notes}
    //             </p>
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   )}
    // </div>


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