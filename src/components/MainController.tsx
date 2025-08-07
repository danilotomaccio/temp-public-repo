import { type FC, useState } from "react";
import { ProgramCreator } from "./ProgramCreator";
import { Scheduler } from "./Scheduler";
import { GlobalScheduleView } from "./GlobalScheduleView"; // Importa il nuovo componente dal file corretto

// --- TIPI CONDIVISI ---
interface Cycle {
  id: number;
  name: string;
  sessions: number;
}

interface ProgramCycle {
  id: number;
  cycleId: number | null;
  startDate: string;
  endDate: string;
}

interface Program {
  cycles: ProgramCycle[];
  notes: string;
}

// --- DATI DI ESEMPIO ---
const AVAILABLE_CYCLES: Cycle[] = [
  { id: 1, name: "Rieducazione Motoria Arti Inferiori", sessions: 10 },
  { id: 2, name: "Fisioterapia Post-operatoria Spalla", sessions: 12 },
  { id: 3, name: "Terapia Occupazionale", sessions: 8 },
  { id: 4, name: "Logopedia", sessions: 15 },
  { id: 5, name: "Ginnastica Correttiva", sessions: 20 },
];

export const MainController: FC = () => {
  const [savedProgram, setSavedProgram] = useState<Program | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<ProgramCycle | null>(null);
  const [scheduleConfirmed, setScheduleConfirmed] = useState<boolean>(false);

  const handleProgramCreated = (program: Program) => {
    setSavedProgram(program);
    setScheduleConfirmed(false);
  };

  const handleCycleSelect = (cycle: ProgramCycle) => {
    setSelectedCycle(cycle);
  };

  const handleBackToList = () => {
    setSelectedCycle(null);
  };

  const handleScheduleConfirmation = () => {
    setSelectedCycle(null);
    setSavedProgram(null);
    setScheduleConfirmed(true);
  };

  // --- VISTA CALENDARIO GLOBALE ---
  if (scheduleConfirmed) {
    return <GlobalScheduleView />;
  }

  // --- VISTA LISTA CICLI ---
  if (savedProgram && !selectedCycle) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Trattamenti
        </h2>
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">
            Seleziona un ciclo per avviare la pianificazione:
          </h3>
          <ul className="list-disc list-inside pl-2 space-y-2">
            {savedProgram.cycles.map((cycle) => {
              const cycleInfo = AVAILABLE_CYCLES.find(
                (c) => c.id === cycle.cycleId
              );
              if (!cycleInfo) return null;

              return (
                <li key={cycle.id}>
                  <button
                    onClick={() => handleCycleSelect(cycle)}
                    className="text-[#8c2d52] hover:text-[#7a2644] font-semibold hover:underline"
                  >
                    {cycleInfo.name}
                  </button>
                  {cycle.startDate &&
                    ` (dal ${cycle.startDate} al ${cycle.endDate || "N/D"})`}
                </li>
              );
            })}
          </ul>
          {/* {savedProgram.notes && (
            <>
              <h3 className="font-semibold text-gray-700 pt-2">Note:</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                {savedProgram.notes}
              </p>
            </>
          )} */}
        </div>
        <div className="mt-6 border-t pt-4 text-right">
          <button
            onClick={() => {
              setSavedProgram(null);
              setScheduleConfirmed(false); // Torna alla schermata iniziale
            }}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Crea un altro trattamento
          </button>
        </div>
      </div>
    );
  }

  // --- VISTA SCHEDULER ---
  if (selectedCycle && savedProgram) {
    const cycleInfo = AVAILABLE_CYCLES.find(
      (c) => c.id === selectedCycle.cycleId
    );
    if (!cycleInfo) {
      return (
        <div>
          Errore: dati del ciclo non trovati.
          <button onClick={handleBackToList}>Torna alla lista</button>
        </div>
      );
    }

    return (
      <div>
        <button
          onClick={handleBackToList}
          className="mb-4 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          &larr; Torna alla lista dei cicli
        </button>
        <Scheduler
          cycleName={cycleInfo.name}
          totalSessions={cycleInfo.sessions}
          defaultFrequency="2 volte/settimana"
          defaultStartDate={
            selectedCycle.startDate || new Date().toISOString().split("T")[0]
          }
          defaultEndDate={
            selectedCycle.endDate ||
            new Date(new Date().setMonth(new Date().getMonth() + 2))
              .toISOString()
              .split("T")[0]
          }
          notes={savedProgram.notes}
          onConfirmSchedule={handleScheduleConfirmation}
        />
      </div>
    );
  }

  // --- VISTA INIZIALE ---
  return <ProgramCreator onProgramCreate={handleProgramCreated} />;
};
