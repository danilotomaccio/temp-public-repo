import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  type FC,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  SlidersHorizontal,
  X,
  User,
  Stethoscope,
  MapPin,
  Clock,
} from "lucide-react";

// --- TIPI ---
interface Appointment {
  id: number;
  title: string;
  patient: string;
  therapist: string;
  type: string;
  start: Date;
  end: Date;
  location: string | null;
  address: string | null;
  color: string;
}

// --- DATI DI ESEMPIO (MOCK DATA) ---
const MOCK_THERAPISTS = ["Dott.ssa Rossi", "Dott. Bianchi", "Dott. Verdi"];
const MOCK_PATIENTS = [
  "Mario Russo",
  "Luigi Galli",
  "Anna Neri",
  "Paolo Colombo",
  "Sara Esposito",
];
const MOCK_ACTIVITY_TYPES = [
  "Visita medica",
  "Colloquio",
  "Ciclo terapeutico",
  "Restituzione",
  "Valutazione",
];
const MOCK_LOCATIONS = [
  "Studio Medico Centrale",
  "Clinica San Marco",
  "Centro Riabilitativo",
];

const generateMockAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const today = new Date();
  for (let i = 0; i < 50; i++) {
    const randomDay = Math.floor(Math.random() * 60) - 30;
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + randomDay
    );

    const randomHour = Math.floor(Math.random() * 9) + 8; // Ore 8-16
    const randomMinute = Math.random() > 0.5 ? 30 : 0;
    startDate.setHours(randomHour, randomMinute, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const isHomeVisit = Math.random() > 0.8;

    appointments.push({
      id: i + 1,
      title:
        MOCK_ACTIVITY_TYPES[
          Math.floor(Math.random() * MOCK_ACTIVITY_TYPES.length)
        ],
      patient: MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)],
      therapist:
        MOCK_THERAPISTS[Math.floor(Math.random() * MOCK_THERAPISTS.length)],
      type: MOCK_ACTIVITY_TYPES[
        Math.floor(Math.random() * MOCK_ACTIVITY_TYPES.length)
      ],
      start: startDate,
      end: endDate,
      location: isHomeVisit
        ? null
        : MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
      address: isHomeVisit
        ? `Via Roma ${Math.floor(Math.random() * 100)}, Milano`
        : null,
      color: ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899"][
        Math.floor(Math.random() * 5)
      ],
    });
  }
  return appointments;
};

// --- COMPONENTI HELPER ---

const ActivityIcon: FC<{ type: string; className: string }> = ({
  type,
  className,
}) => {
  const baseClass = `mr-2 ${className}`;
  switch (type) {
    case "Visita medica":
      return <Stethoscope className={baseClass} />;
    case "Colloquio":
      return <User className={baseClass} />;
    case "Ciclo terapeutico":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClass}
        >
          <path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.5-.16-1.16.3-1.16.84v2.33c0 .54.66.98 1.16.82C16.33 7.87 18 9.78 18 12a6 6 0 1 1-12 0c0-2.22 1.67-4.13 3.84-5.5.5-.34 0-.98-.5-1.16A9.94 9.94 0 0 0 2 12a10 10 0 0 0 10-10z" />
        </svg>
      );
    default:
      return <Calendar className={baseClass} />;
  }
};

// --- COMPONENTI DEL CALENDARIO ---

const CalendarHeader: FC<any> = ({
  currentDate,
  view,
  setView,
  onPrev,
  onNext,
  onToday,
  onToggleFilters,
}) => {
  const monthName = currentDate.toLocaleString("it-IT", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4 w-full md:w-auto mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-gray-800 capitalize">{`${monthName} ${year}`}</h1>
        <div className="flex items-center space-x-1">
          <button
            onClick={onPrev}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Oggi
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-gray-100 rounded-md p-1">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 text-sm font-semibold rounded ${
              view === "month"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-600"
            }`}
          >
            Mese
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 text-sm font-semibold rounded ${
              view === "week"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-600"
            }`}
          >
            Settimana
          </button>
        </div>
        <button
          onClick={onToggleFilters}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-500 border border-gray-300"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

const MonthView: FC<any> = ({ date, appointments, onSelectAppointment }) => {
  const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const monthData = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth: { date: Date; isCurrentMonth: boolean }[] = [];
    let currentDay = new Date(firstDayOfMonth);
    let dayOfWeek = currentDay.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;

    for (let i = 1; i < dayOfWeek; i++) {
      const prevMonthDay = new Date(firstDayOfMonth);
      prevMonthDay.setDate(prevMonthDay.getDate() - (dayOfWeek - i));
      daysInMonth.push({ date: prevMonthDay, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      daysInMonth.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    const lastDayOfWeek = daysInMonth[daysInMonth.length - 1].date.getDay();
    if (lastDayOfWeek !== 0) {
      for (let i = lastDayOfWeek === 0 ? 0 : lastDayOfWeek; i < 7; i++) {
        const nextMonthDay = new Date(lastDayOfMonth);
        nextMonthDay.setDate(
          nextMonthDay.getDate() +
            (i - (lastDayOfWeek === 0 ? -1 : lastDayOfWeek) + 1)
        );
        daysInMonth.push({ date: nextMonthDay, isCurrentMonth: false });
      }
    }

    return daysInMonth;
  }, [date]);

  const getAppointmentsForDay = (day: Date) => {
    return appointments
      .filter(
        (app: Appointment) =>
          app.start.getFullYear() === day.getFullYear() &&
          app.start.getMonth() === day.getMonth() &&
          app.start.getDate() === day.getDate()
      )
      .sort(
        (a: Appointment, b: Appointment) =>
          a.start.getTime() - b.start.getTime()
      );
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="grid grid-cols-7 flex-grow">
      {daysOfWeek.map((day) => (
        <div
          key={day}
          className="text-center font-semibold text-sm text-gray-600 py-2 border-b border-r border-gray-200"
        >
          {day}
        </div>
      ))}
      {monthData.map(({ date: d, isCurrentMonth }, index) => {
        const dayAppointments = getAppointmentsForDay(d);
        return (
          <div
            key={index}
            className={`border-b border-r border-gray-200 p-1.5 h-36 flex flex-col ${
              isCurrentMonth ? "bg-white" : "bg-gray-50"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                isToday(d)
                  ? "bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
                  : "text-gray-500"
              } ${!isCurrentMonth ? "opacity-50" : ""}`}
            >
              {d.getDate()}
            </span>
            <div className="mt-1 overflow-y-auto text-xs">
              {dayAppointments.slice(0, 3).map((app: Appointment) => (
                <div
                  key={app.id}
                  onClick={() => onSelectAppointment(app)}
                  style={{ borderLeftColor: app.color }}
                  className="p-1 mb-1 rounded-md bg-gray-100 border-l-4 cursor-pointer hover:bg-gray-200 truncate"
                >
                  {app.start.toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  - {app.title}
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-blue-500 font-semibold mt-1">
                  + {dayAppointments.length - 3} altri
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const WeekView: FC<any> = ({ date, appointments, onSelectAppointment }) => {
  const daysOfWeek = useMemo(() => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [date]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  const getPositionAndHeight = (appointment: Appointment) => {
    const startHour =
      appointment.start.getHours() + appointment.start.getMinutes() / 60;
    const endHour =
      appointment.end.getHours() + appointment.end.getMinutes() / 60;
    const duration = endHour - startHour;
    const top = (startHour - 8) * 60;
    const height = duration * 60;
    return { top: `${top}px`, height: `${height}px` };
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex flex-grow overflow-x-auto">
      <div className="w-16 flex-shrink-0">
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-[60px] text-right pr-2 text-xs text-gray-400 border-r border-gray-200 flex items-start justify-end pt-[-2px]"
          >
            <span>{`${hour}:00`}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-grow min-w-[800px]">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="relative border-r border-gray-200">
            <div className="text-center py-2 border-b border-gray-200 sticky top-0 bg-white z-10">
              <p className="text-sm text-gray-500">
                {day.toLocaleString("it-IT", { weekday: "short" })}
              </p>
              <p
                className={`text-lg font-semibold ${
                  isToday(day) ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {day.getDate()}
              </p>
            </div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b border-gray-100"
              ></div>
            ))}
            {appointments
              .filter(
                (app: Appointment) =>
                  app.start.toDateString() === day.toDateString()
              )
              .map((app: Appointment) => {
                const { top, height } = getPositionAndHeight(app);
                return (
                  <div
                    key={app.id}
                    onClick={() => onSelectAppointment(app)}
                    className="absolute left-1 right-1 p-2 rounded-lg text-white text-xs flex flex-col cursor-pointer shadow-md hover:opacity-90"
                    style={{
                      top,
                      height,
                      backgroundColor: app.color,
                      borderLeft: `4px solid ${app.color}`,
                    }}
                  >
                    <p className="font-bold">{app.title}</p>
                    <p>{app.patient}</p>
                    <p className="mt-auto">
                      {app.start.toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {app.end.toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

const AppointmentDetailsSidebar: FC<{
  appointment: Appointment | null;
  onClose: () => void;
}> = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out"
      style={{ transform: appointment ? "translateX(0)" : "translateX(100%)" }}
    >
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Dettagli Appuntamento
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-start">
          <ActivityIcon
            type={appointment.type}
            className="text-blue-500 w-6 h-6 mt-1"
          />
          <div>
            <p className="text-sm text-gray-500">Tipo attività</p>
            <p className="text-lg font-semibold text-gray-800">
              {appointment.title}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <Clock className="mr-2 text-gray-500 w-6 h-6 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Data e Ora</p>
            <p className="text-md font-medium text-gray-700">
              {appointment.start.toLocaleDateString("it-IT", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-md font-medium text-gray-700">
              dalle{" "}
              {appointment.start.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              alle{" "}
              {appointment.end.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <User className="mr-2 text-gray-500 w-6 h-6 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Paziente</p>
            <p className="text-md font-medium text-gray-700">
              {appointment.patient}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <Stethoscope className="mr-2 text-gray-500 w-6 h-6 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Terapista</p>
            <p className="text-md font-medium text-gray-700">
              {appointment.therapist}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <MapPin className="mr-2 text-gray-500 w-6 h-6 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Luogo</p>
            <p className="text-md font-medium text-gray-700">
              {appointment.location || appointment.address}
            </p>
            {appointment.address && (
              <p className="text-sm text-gray-500">(Domiciliare)</p>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
        <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Modifica Appuntamento
        </button>
      </div>
    </div>
  );
};

const FilterSidebar: FC<any> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  therapists,
  activityTypes,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ therapist: "", patient: "", type: "" });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Filtri</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paziente
          </label>
          <input
            type="text"
            placeholder="Cerca un paziente"
            value={filters.patient}
            onChange={(e) => handleFilterChange("patient", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Terapista
          </label>
          <select
            value={filters.therapist}
            onChange={(e) => handleFilterChange("therapist", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Tutti i terapisti</option>
            {therapists.map((t: string) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo di attività
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Tutti i tipi</option>
            {activityTypes.map((t: string) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50 flex space-x-2">
        <button
          onClick={resetFilters}
          className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Annulla
        </button>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Applica Filtri
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE CALENDARIO RIUTILIZZABILE ---
const TherapyCalendar: FC<any> = ({
  initialAppointments,
  therapists,
  activityTypes,
}) => {
  const [allAppointments] = useState(initialAppointments);
  const [filteredAppointments, setFilteredAppointments] =
    useState(allAppointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment|null>(null);
  const [isFilterSidebarOpen, setFilterSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    therapist: "",
    patient: "",
    type: "",
  });

  useEffect(() => {
    let appointments = [...allAppointments];
    if (filters.patient) {
      appointments = appointments.filter((app) =>
        app.patient.toLowerCase().includes(filters.patient.toLowerCase())
      );
    }
    if (filters.therapist) {
      appointments = appointments.filter(
        (app) => app.therapist === filters.therapist
      );
    }
    if (filters.type) {
      appointments = appointments.filter((app) => app.type === filters.type);
    }
    setFilteredAppointments(appointments);
  }, [filters, allAppointments]);

  const handlePrev = () => {
    setCurrentDate((d) => {
      const newDate = new Date(d);
      if (view === "month") {
        newDate.setMonth(d.getMonth() - 1);
      } else {
        // week
        newDate.setDate(d.getDate() - 7);
      }
      return newDate;
    });
  };
  const handleNext = () => {
    setCurrentDate((d) => {
      const newDate = new Date(d);
      if (view === "month") {
        newDate.setMonth(d.getMonth() + 1);
      } else {
        // week
        newDate.setDate(d.getDate() + 7);
      }
      return newDate;
    });
  };
  const handleToday = () => setCurrentDate(new Date());

  const handleSelectAppointment = useCallback(
    (appointment: Appointment) => setSelectedAppointment(appointment),
    []
  );
  const handleCloseDetails = useCallback(
    () => setSelectedAppointment(null),
    []
  );
  const handleToggleFilters = useCallback(
    () => setFilterSidebarOpen((p) => !p),
    []
  );
  const handleCloseFilters = useCallback(() => setFilterSidebarOpen(false), []);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col font-sans antialiased relative overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        setView={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onToggleFilters={handleToggleFilters}
      />
      <main className="flex-grow flex flex-col overflow-hidden">
        {view === "month" ? (
          <MonthView
            date={currentDate}
            appointments={filteredAppointments}
            onSelectAppointment={handleSelectAppointment}
          />
        ) : (
          <WeekView
            date={currentDate}
            appointments={filteredAppointments}
            onSelectAppointment={handleSelectAppointment}
          />
        )}
      </main>

      {(selectedAppointment || isFilterSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => {
            handleCloseDetails();
            handleCloseFilters();
          }}
        ></div>
      )}

      <AppointmentDetailsSidebar
        appointment={selectedAppointment}
        onClose={handleCloseDetails}
      />
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={handleCloseFilters}
        filters={filters}
        setFilters={setFilters}
        therapists={therapists}
        activityTypes={activityTypes}
      />
    </div>
  );
};

// --- COMPONENTE WRAPPER PER L'INTEGRAZIONE ---
export const GlobalScheduleView: FC = () => {
  const [appointments] = useState(generateMockAppointments());
  const [therapists] = useState(MOCK_THERAPISTS);
  const [patients] = useState(MOCK_PATIENTS);
  const [activityTypes] = useState(MOCK_ACTIVITY_TYPES);

  return (
    <TherapyCalendar
      initialAppointments={appointments}
      therapists={therapists}
      patients={patients}
      activityTypes={activityTypes}
    />
  );
};
