import React, { useState, useMemo, type FC } from "react";

// --- ICONE SVG ---
const SortAscendingIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4h13M3 8h9M3 12h9m-9 4h9m5-4v10l4-3m-4 3l-4-3"
    />
  </svg>
);

const SortDescendingIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 20h13M3 16h9M3 12h9m-9-4h9m5 4V4l4 3m-4-3l-4 3"
    />
  </svg>
);

// --- DEFINIZIONE DEI TIPI (TYPESCRIPT) ---

interface Terapista {
  id: number;
  nome: string;
  caricoLavoro: number;
}

interface SlotBase {
  data: string;
  ora: string;
  terapistaId: number;
}

interface SlotProcessato extends SlotBase {
  terapista: Terapista;
  status: "grey" | "blue" | "green";
}

type PatientAvailability = Record<string, Record<string, boolean>>;

interface LastClickedSlot {
  giorno: string;
  ora: string;
}

type SortByType = "chronological" | "best";

// --- DATI FITTIZI (MOCK DATA) ---

const CICLO_ESISTENTE = {
  nome: "Ciclo di Fisioterapia Post-operatoria",
  seduteTotali: 10,
  frequenzaDefault: "2 volte/settimana",
  dataInizioDefault: "2025-09-01",
  dataFineDefault: "2025-10-15",
};

const TERAPISTI: Terapista[] = [
  { id: 1, nome: "Mario Rossi", caricoLavoro: 85 },
  { id: 2, nome: "Luisa Bianchi", caricoLavoro: 60 },
  { id: 3, nome: "Giovanni Verdi", caricoLavoro: 95 },
  { id: 4, nome: "Anna Neri", caricoLavoro: 55 },
];

const generatoreSlotDisponibili = (): SlotBase[] => {
  const slots: SlotBase[] = [];
  const giorniSettimana = [1, 2, 3, 4, 5]; // Lun-Ven
  const orari = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  for (let giorno = 1; giorno <= 30; giorno++) {
    const data = new Date(2025, 8, giorno); // Settembre 2025
    if (!giorniSettimana.includes(data.getDay())) continue;

    TERAPISTI.forEach((terapista) => {
      orari.forEach((ora) => {
        if (Math.random() > 0.6) {
          slots.push({
            data: `2025-09-${String(giorno).padStart(2, "0")}`,
            ora,
            terapistaId: terapista.id,
          });
        }
      });
    });
  }
  return slots;
};

const SLOT_DISPONIBILI_TERAPISTI: SlotBase[] = generatoreSlotDisponibili();

// --- COMPONENTI UTILITY ---

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-14 h-8 rounded-full transition-colors ${
          checked ? "bg-rose-600" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
    <div className="ml-3 text-gray-700 font-medium">{label}</div>
  </label>
);

interface CalendarioMensileProps {
  slots: SlotProcessato[];
  onDayClick: (day: string) => void;
  selectedDays: string[];
}

const CalendarioMensile: FC<CalendarioMensileProps> = ({
  slots,
  onDayClick,
  selectedDays,
}) => {
  const oggi = new Date(2025, 8, 1);
  const primoGiornoDelMese = oggi.getDay() === 0 ? 6 : oggi.getDay() - 1;
  const giorniNelMese = new Date(2025, 9, 0).getDate();

  const giorniPerStato = useMemo(() => {
    const stati: Record<string, { hasBlue: boolean; hasGreen: boolean }> = {};
    slots.forEach((slot) => {
      if (!stati[slot.data]) {
        stati[slot.data] = { hasBlue: false, hasGreen: false };
      }
      if (slot.status === "blue" || slot.status === "green")
        stati[slot.data].hasBlue = true;
      if (slot.status === "green") stati[slot.data].hasGreen = true;
    });
    return stati;
  }, [slots]);

  const getDayClass = (giorno: number) => {
    const dataKey = `2025-09-${String(giorno).padStart(2, "0")}`;
    const stato = giorniPerStato[dataKey];

    let baseClass =
      "w-11 h-11 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200";

    if (!stato)
      return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed`;

    if (stato.hasGreen)
      baseClass += " bg-rose-500 hover:bg-rose-600 text-white";
    else if (stato.hasBlue)
      baseClass += " bg-rose-200 hover:bg-rose-300 text-rose-800";
    else baseClass += " bg-gray-200 hover:bg-gray-300 text-gray-600";

    if (selectedDays.includes(dataKey)) {
      baseClass += " ring-4 ring-offset-2 ring-offset-white ring-rose-500";
    }

    return baseClass;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 h-full">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 mb-2">
        <div>LUN</div>
        <div>MAR</div>
        <div>MER</div>
        <div>GIO</div>
        <div>VEN</div>
        <div>SAB</div>
        <div>DOM</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: primoGiornoDelMese }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {Array.from({ length: giorniNelMese }).map((_, i) => {
          const giorno = i + 1;
          const dataKey = `2025-09-${String(giorno).padStart(2, "0")}`;
          return (
            <div
              key={giorno}
              className={getDayClass(giorno)}
              onClick={() => giorniPerStato[dataKey] && onDayClick(dataKey)}
            >
              {giorno}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPALE ---

const App: FC = () => {
  const [step, setStep] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(
    CICLO_ESISTENTE.dataInizioDefault
  );
  const [endDate, setEndDate] = useState<string>(
    CICLO_ESISTENTE.dataFineDefault
  );
  const [frequenza, setFrequenza] = useState<string>(
    CICLO_ESISTENTE.frequenzaDefault
  );

  const giorniSettimana = ["LUN", "MAR", "MER", "GIO", "VEN"];
  const fasceOrarie = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const [patientAvailability, setPatientAvailability] =
    useState<PatientAvailability>(() => {
      const availability: PatientAvailability = {};
      giorniSettimana.forEach((giorno) => {
        availability[giorno] = {};
        fasceOrarie.forEach((ora) => {
          availability[giorno][ora] = false;
        });
      });
      return availability;
    });

  const [filters, setFilters] = useState({
    preferenzaTerapistaUnico: false,
    avviaPrimaPossibile: false,
    terapistiPiuScarichi: false,
  });

  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(
    null
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [lastClickedSlot, setLastClickedSlot] =
    useState<LastClickedSlot | null>(null);
  const [sortBy, setSortBy] = useState<SortByType>("chronological");

  const handleAvailabilityChange = (
    giorno: string,
    ora: string,
    event: React.MouseEvent
  ) => {
    const isShiftPressed = event.nativeEvent.shiftKey;
    const newAvailability = JSON.parse(JSON.stringify(patientAvailability));

    if (isShiftPressed && lastClickedSlot) {
      const allSlots = giorniSettimana.flatMap((g) =>
        fasceOrarie.map((o) => ({ giorno: g, ora: o }))
      );
      const startIndex = allSlots.findIndex(
        (slot) =>
          slot.giorno === lastClickedSlot.giorno &&
          slot.ora === lastClickedSlot.ora
      );
      const endIndex = allSlots.findIndex(
        (slot) => slot.giorno === giorno && slot.ora === ora
      );

      if (startIndex !== -1 && endIndex !== -1) {
        const rangeStart = Math.min(startIndex, endIndex);
        const rangeEnd = Math.max(startIndex, endIndex);

        for (let i = rangeStart; i <= rangeEnd; i++) {
          const slotToUpdate = allSlots[i];
          newAvailability[slotToUpdate.giorno][slotToUpdate.ora] = true;
        }
        setPatientAvailability(newAvailability);
      }
    } else {
      newAvailability[giorno][ora] = !newAvailability[giorno][ora];
      setPatientAvailability(newAvailability);
    }

    setLastClickedSlot({ giorno, ora });
  };

  const handleBulkAvailabilityChange = (
    type: "mattina" | "pomeriggio" | "giorno" | "nessuno"
  ) => {
    const newAvailability: PatientAvailability = JSON.parse(
      JSON.stringify(patientAvailability)
    );
    const isMorning = (ora: string) => parseInt(ora.split(":")[0]) < 13;

    giorniSettimana.forEach((giorno) => {
      fasceOrarie.forEach((ora) => {
        let shouldBeSelected = false;
        if (type === "mattina" && isMorning(ora)) shouldBeSelected = true;
        if (type === "pomeriggio" && !isMorning(ora)) shouldBeSelected = true;
        if (type === "giorno") shouldBeSelected = true;
        newAvailability[giorno][ora] = shouldBeSelected;
      });
    });
    setPatientAvailability(newAvailability);
  };

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleDayClick = (day: string) => {
    setSelectedDays((prev) => {
      const isSelected = prev.includes(day);
      if (isSelected) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day].sort();
      }
    });
  };

  const processedData = useMemo(() => {
    const dayMap = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];

    const initialSlots =
      selectedTherapistId === null
        ? SLOT_DISPONIBILI_TERAPISTI
        : SLOT_DISPONIBILI_TERAPISTI.filter(
            (slot) => slot.terapistaId === selectedTherapistId
          );

    const patientMatchingSlots: SlotProcessato[] = initialSlots.map((slot) => {
      const slotDate = new Date(slot.data);
      const dayOfWeek = dayMap[slotDate.getDay()];
      const isPatientAvailable =
        patientAvailability[dayOfWeek]?.[slot.ora] || false;

      return {
        ...slot,
        terapista: TERAPISTI.find((t) => t.id === slot.terapistaId)!,
        status: isPatientAvailable ? "blue" : "grey",
      };
    });

    let finalSlots = patientMatchingSlots;

    if (filters.terapistiPiuScarichi || filters.preferenzaTerapistaUnico) {
      const blueSlots = finalSlots.filter((s) => s.status === "blue");
      let filteredByWorkload = [...blueSlots];
      if (filters.terapistiPiuScarichi) {
        const avgWorkload =
          TERAPISTI.reduce((acc, t) => acc + t.caricoLavoro, 0) /
          TERAPISTI.length;
        filteredByWorkload = blueSlots.filter(
          (s) => s.terapista.caricoLavoro < avgWorkload + 10
        );
      }

      let filteredByUniqueTherapist = [...filteredByWorkload];
      if (filters.preferenzaTerapistaUnico && filteredByWorkload.length > 0) {
        const therapistCounts = filteredByWorkload.reduce((acc, slot) => {
          acc[slot.terapistaId] = (acc[slot.terapistaId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const bestTherapistId = Object.keys(therapistCounts).reduce((a, b) =>
          therapistCounts[Number(a)] > therapistCounts[Number(b)] ? a : b
        );

        if (
          therapistCounts[Number(bestTherapistId)] >=
          CICLO_ESISTENTE.seduteTotali
        ) {
          filteredByUniqueTherapist = filteredByWorkload.filter(
            (s) => String(s.terapistaId) === bestTherapistId
          );
        }
      }

      const greenSlotIds = new Set(
        filteredByUniqueTherapist.map(
          (s) => `${s.data}-${s.ora}-${s.terapistaId}`
        )
      );

      finalSlots = finalSlots.map((slot) => ({
        ...slot,
        status: greenSlotIds.has(`${slot.data}-${slot.ora}-${slot.terapistaId}`)
          ? "green"
          : slot.status,
      }));
    } else {
      finalSlots = finalSlots.map((slot) =>
        slot.status === "blue" ? { ...slot, status: "green" } : slot
      );
    }

    if (filters.avviaPrimaPossibile) {
      finalSlots.sort(
        (a, b) =>
          new Date(a.data).getTime() - new Date(b.data).getTime() ||
          a.ora.localeCompare(b.ora)
      );
    }

    const availableGreenSlotsCount = finalSlots.filter(
      (s) => s.status === "green"
    ).length;
    let warningMessage: string | null = null;
    if (availableGreenSlotsCount < CICLO_ESISTENTE.seduteTotali) {
      warningMessage = `Attenzione: Sono stati trovati solo ${availableGreenSlotsCount} slot che soddisfano tutti i filtri, ma ne servono ${CICLO_ESISTENTE.seduteTotali}. Prova a disattivare qualche filtro o esplora le opzioni colorate per trovare più disponibilità.`;
    }

    return { slots: finalSlots, warningMessage };
  }, [patientAvailability, filters, selectedTherapistId]);

  const slotsForSelectedDays = useMemo(() => {
    if (selectedDays.length === 0) return [];

    const filtered = processedData.slots.filter((slot) =>
      selectedDays.includes(slot.data)
    );

    if (sortBy === "best") {
      const statusOrder = { green: 0, blue: 1, grey: 2 };
      filtered.sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.data.localeCompare(b.data) || a.ora.localeCompare(b.ora);
      });
    } else {
      // chronological
      filtered.sort(
        (a, b) => a.data.localeCompare(b.data) || a.ora.localeCompare(b.ora)
      );
    }

    return filtered;
  }, [selectedDays, processedData.slots, sortBy]);

  // --- RENDER ---

  const renderStep1 = () => (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-7xl w-full border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Programmazione Ciclo Medico
      </h1>
      <p className="text-gray-500 mb-8">
        Step 1: Dati del Ciclo e Disponibilità Paziente
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
            Dati del Ciclo
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Nome Ciclo
              </label>
              <p className="text-md text-gray-900 font-semibold">
                {CICLO_ESISTENTE.nome}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                N° Sedute Richieste
              </label>
              <p className="text-md text-gray-900">
                {CICLO_ESISTENTE.seduteTotali}
              </p>
            </div>
            <div>
              <label
                htmlFor="frequenza"
                className="text-sm font-medium text-gray-600"
              >
                Frequenza
              </label>
              <input
                type="text"
                id="frequenza"
                value={frequenza}
                onChange={(e) => setFrequenza(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-600"
              >
                Data Inizio Ciclo
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-600"
              >
                Data Fine Ciclo
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Disponibilità del Paziente
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAvailabilityChange("mattina")}
                className="text-xs bg-rose-100 text-rose-700 font-semibold py-1 px-3 rounded-full hover:bg-rose-200"
              >
                Mattina
              </button>
              <button
                onClick={() => handleBulkAvailabilityChange("pomeriggio")}
                className="text-xs bg-rose-100 text-rose-700 font-semibold py-1 px-3 rounded-full hover:bg-rose-200"
              >
                Pomeriggio
              </button>
              <button
                onClick={() => handleBulkAvailabilityChange("giorno")}
                className="text-xs bg-rose-100 text-rose-700 font-semibold py-1 px-3 rounded-full hover:bg-rose-200"
              >
                Tutto il giorno
              </button>
              <button
                onClick={() => handleBulkAvailabilityChange("nessuno")}
                className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full hover:bg-gray-300"
              >
                Deseleziona tutto
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 text-sm font-semibold text-gray-600">
                    Orario
                  </th>
                  {giorniSettimana.map((giorno) => (
                    <th
                      key={giorno}
                      className="p-2 text-center text-sm font-semibold text-gray-600"
                    >
                      {giorno}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {fasceOrarie.map((ora) => (
                  <tr key={ora} className="border-t border-gray-200">
                    <td className="p-2 font-mono text-gray-700">{ora}</td>
                    {giorniSettimana.map((giorno) => (
                      <td key={`${giorno}-${ora}`} className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={patientAvailability[giorno]?.[ora] || false}
                          onClick={(e) =>
                            handleAvailabilityChange(giorno, ora, e)
                          }
                          onChange={() => {}} // Dummy onChange per evitare warning di React
                          className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer border-gray-300"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
        <button
          onClick={() => setStep(2)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Cerca Soluzioni
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-7xl w-full border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Risultati della Ricerca
      </h1>
      <p className="text-gray-500 mb-6">Step 2: Filtri e Risultati</p>

      {processedData.warningMessage && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg mb-6"
          role="alert"
        >
          <p className="font-bold">Slot insufficienti</p>
          <p>{processedData.warningMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
              Filtri
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terapista
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTherapistId(null)}
                    className={`py-1 px-3 rounded-full text-sm font-semibold transition-colors ${
                      selectedTherapistId === null
                        ? "bg-rose-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Tutti
                  </button>
                  {TERAPISTI.map((terapista) => (
                    <button
                      key={terapista.id}
                      onClick={() => setSelectedTherapistId(terapista.id)}
                      className={`py-1 px-3 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                        selectedTherapistId === terapista.id
                          ? "bg-rose-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {terapista.nome}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          selectedTherapistId === terapista.id
                            ? "bg-rose-400 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {terapista.caricoLavoro}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-6 pt-4 border-t border-gray-200">
                <ToggleSwitch
                  label="Terapista unico"
                  checked={filters.preferenzaTerapistaUnico}
                  onChange={() =>
                    handleFilterChange("preferenzaTerapistaUnico")
                  }
                />
                <ToggleSwitch
                  label="Avvia prima possibile"
                  checked={filters.avviaPrimaPossibile}
                  onChange={() => handleFilterChange("avviaPrimaPossibile")}
                />
                <ToggleSwitch
                  label="Terapisti scarichi"
                  checked={filters.terapistiPiuScarichi}
                  onChange={() => handleFilterChange("terapistiPiuScarichi")}
                />
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Legenda Colori
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-rose-500 mr-2 border border-rose-600"></span>
                  Disponibile e filtrato
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-rose-200 mr-2 border border-rose-300"></span>
                  Paziente e Terapista
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-gray-200 mr-2 border border-gray-300"></span>
                  Solo Terapista
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Livello 1: Seleziona i Giorni
          </h2>
          <CalendarioMensile
            slots={processedData.slots}
            onDayClick={handleDayClick}
            selectedDays={selectedDays}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Livello 2: Orari disponibili
            </h2>
            <button
              onClick={() =>
                setSortBy((prev) =>
                  prev === "chronological" ? "best" : "chronological"
                )
              }
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
              title={
                sortBy === "chronological"
                  ? "Ordina per soluzioni migliori"
                  : "Ordina cronologicamente"
              }
            >
              {sortBy === "chronological" ? (
                <SortAscendingIcon />
              ) : (
                <SortDescendingIcon />
              )}
            </button>
          </div>
          <div
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-grow overflow-y-auto"
            style={{ maxHeight: "600px" }}
          >
            {slotsForSelectedDays.length > 0 ? (
              <ul className="space-y-2">
                {slotsForSelectedDays.map((slot, index) => {
                  const statusColor = {
                    green: "border-rose-500 bg-white",
                    blue: "border-rose-200 bg-white",
                    grey: "border-gray-300 bg-gray-50",
                  }[slot.status];

                  return (
                    <li
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg border-l-4 shadow-sm ${statusColor}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <span className="font-bold text-gray-800">
                          {slot.data}
                        </span>
                        <span className="font-mono text-gray-600">
                          {slot.ora}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-700">
                          {slot.terapista.nome}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          Carico: {slot.terapista.caricoLavoro}%
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-500 p-8">
                  Seleziona uno o più giorni dal calendario per vedere gli orari
                  disponibili.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-gray-200 pt-6">
        <button
          onClick={() => setStep(1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Indietro
        </button>
        <button
          onClick={() => alert("Prenotazione confermata! (Simulazione)")}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={selectedDays.length === 0}
        >
          Conferma Prenotazione
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 p-4 sm:p-8 font-sans flex items-center justify-center">
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default App;
