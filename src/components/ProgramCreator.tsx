import React, { useState, useEffect, type FC } from "react";

// --- DEFINIZIONE DEI TIPI (TYPESCRIPT) ---

// Definisce la struttura di un ciclo disponibile per la selezione
interface Cycle {
  id: number;
  name: string;
  sessions: number;
}

// Definisce la struttura di un ciclo all'interno del programma in creazione
interface ProgramCycle {
  id: number; // ID univoco per la chiave di React
  cycleId: number | null;
  startDate: string;
  endDate: string;
}

// Definisce la struttura dell'intero programma
interface Program {
  cycles: ProgramCycle[];
  notes: string;
}

// Definisce le props per il componente modale
interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Program) => void;
}

// Definisce le props per il nuovo componente ProgramCreator
interface ProgramCreatorProps {
  onProgramCreate: (program: Program) => void;
}

// --- DATI DI ESEMPIO ---
// Dati di esempio che verrebbero da un'API, ora tipizzati
const AVAILABLE_CYCLES: Cycle[] = [
  { id: 1, name: "Rieducazione Motoria Arti Inferiori", sessions: 10 },
  { id: 2, name: "Fisioterapia Post-operatoria Spalla", sessions: 12 },
  { id: 3, name: "Terapia Occupazionale", sessions: 8 },
  { id: 4, name: "Logopedia", sessions: 15 },
  { id: 5, name: "Ginnastica Correttiva", sessions: 20 },
];

// --- COMPONENTE MODALE (Componente "dumb" per la UI) ---
const ProgramModal: FC<ProgramModalProps> = ({ isOpen, onClose, onSave }) => {
  // Stato interno del form, ora con tipo Program
  const [program, setProgram] = useState<Program>({ cycles: [], notes: "" });
  const [showContent, setShowContent] = useState<boolean>(false);

  // Effetto per le animazioni di entrata/uscita
  useEffect(() => {
    if (isOpen) {
      // Resetta il form e aggiunge un ciclo di default all'apertura
      setProgram({
        cycles: [{ id: Date.now(), cycleId: null, startDate: "", endDate: "" }],
        notes: "",
      });
      // Timeout per permettere all'animazione di scorrimento di funzionare
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // --- GESTORI DI EVENTI ---

  const addCycle = (): void => {
    setProgram((prev) => ({
      ...prev,
      cycles: [
        ...prev.cycles,
        { id: Date.now(), cycleId: null, startDate: "", endDate: "" },
      ],
    }));
  };

  const removeCycle = (index: number): void => {
    setProgram((prev) => ({
      ...prev,
      cycles: prev.cycles.filter((_, i) => i !== index),
    }));
  };

  const handleCycleChange = (
    index: number,
    field: keyof Omit<ProgramCycle, "id">,
    value: string
  ): void => {
    const updatedCycles = [...program.cycles];
    const cycleToUpdate = { ...updatedCycles[index] };

    if (field === "cycleId") {
      cycleToUpdate.cycleId = value ? parseInt(value, 10) : null;
    } else {
      cycleToUpdate[field] = value;
    }

    updatedCycles[index] = cycleToUpdate;
    setProgram((prev) => ({ ...prev, cycles: updatedCycles }));
  };

  const handleNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setProgram((prev) => ({ ...prev, notes: e.target.value }));
  };

  const handleSave = (): void => {
    const isValid = program.cycles.every((c) => c.cycleId !== null);
    if (program.cycles.length === 0 || !isValid) {
      alert("Per favore, seleziona un'attività per ogni ciclo aggiunto.");
      return;
    }
    onSave(program);
  };

  // --- FUNZIONI HELPER ---

  const getCycleInfo = (
    cycleId: number | null,
    infoKey: keyof Omit<Cycle, "id">
  ): string | number => {
    if (cycleId === null) return "N/A";
    const found = AVAILABLE_CYCLES.find((c) => c.id === cycleId);
    return found ? found[infoKey] : "N/A";
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Nuovo Trattamento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Sezione Cicli */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Cicli del Trattamento
            </h3>
            <div className="space-y-4">
              {program.cycles.map((cycle, index) => (
                <div
                  key={cycle.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`cycle-select-${cycle.id}`}
                        className="block text-sm font-medium text-gray-600"
                      >
                        Seleziona Ciclo *
                      </label>
                      <select
                        id={`cycle-select-${cycle.id}`}
                        value={cycle.cycleId || ""}
                        onChange={(e) =>
                          handleCycleChange(index, "cycleId", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8c2d52] focus:border-[#8c2d52]"
                      >
                        <option value="" disabled>
                          Scegli un'attività...
                        </option>
                        {AVAILABLE_CYCLES.map((ac) => (
                          <option key={ac.id} value={ac.id}>
                            {ac.name}
                          </option>
                        ))}
                      </select>
                      {cycle.cycleId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Numero sedute previste:{" "}
                          {getCycleInfo(cycle.cycleId, "sessions")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Periodo Previsto (opzionale)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          value={cycle.startDate}
                          onChange={(e) =>
                            handleCycleChange(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8c2d52] focus:border-[#8c2d52]"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="date"
                          value={cycle.endDate}
                          onChange={(e) =>
                            handleCycleChange(index, "endDate", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8c2d52] focus:border-[#8c2d52]"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Lasciare vuoto per massima flessibilità.
                      </p>
                    </div>
                  </div>
                  <div className="text-right mt-3">
                    <button
                      onClick={() => removeCycle(index)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  onClick={addCycle}
                  className="w-full border-2 border-dashed border-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
                >
                  + Aggiungi Ciclo
                </button>
              </div>
            </div>
          </div>
          {/* Sezione Note */}
          <div>
            <label
              htmlFor="internal-notes"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Nota Interna
            </label>
            <textarea
              id="internal-notes"
              value={program.notes}
              onChange={handleNotesChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8c2d52] focus:border-[#8c2d52]"
              placeholder="Aggiungi una nota interna per il desk..."
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-white text-gray-700 font-bold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="bg-[#8c2d52] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#7a2644] transition-colors shadow"
          >
            Salva Trattamento
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE CREATORE (Componente "smart" che gestisce la logica) ---
export const ProgramCreator: FC<ProgramCreatorProps> = ({
  onProgramCreate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSaveProgram = (programData: Program): void => {
    onProgramCreate(programData); // "Solleva" i dati al componente genitore
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Accesso Paziente: Mario Rossi
      </h2>
      <p className="text-gray-600 mb-6">
        Riepilogo della visita del {new Date().toLocaleDateString("it-IT")}.
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#8c2d52] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#7a2644] transition-colors shadow"
      >
        + Crea nuovo Trattamento
      </button>

      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProgram}
      />
    </div>
  );
};
