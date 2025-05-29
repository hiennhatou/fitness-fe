import { type MouseEvent, useEffect, useRef } from "react";
import { useState } from "react";
import { CalendarIcon, Trash } from "../../../components/icons";
import dayjs from "dayjs";
import { Calendar } from "vanilla-calendar-pro";
import { secureApi } from "../../../utils/http";
import { type IScheduleSession } from "../../../utils/interfaces";

export function ScheduleSession() {
  const calendarInputRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [scheduleSessions, setScheduleSessions] = useState<IScheduleSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const datepickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchScheduleSessions = async () => {
      setIsLoading(true);
      const response = await secureApi.get("/session-schedule");
      setScheduleSessions(response.data);
    };
    fetchScheduleSessions().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    function handleClick(e: globalThis.MouseEvent) {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(e.target as Node) &&
        calendarInputRef.current &&
        !calendarInputRef.current.contains(e.target as Node)
      )
        setShowCalendar(false);
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    const calendar = new Calendar("#calendar", {
      type: "default",
      selectedTheme: "light",
      dateMin: "today",
      onClickDate: (dateChange, e) => {
        if (dateChange.context.selectedDates[0]) setDate(dateChange.context.selectedDates[0]);
        setShowCalendar(false);
      },
    });
    calendar.init();
  }, []);

  const onShowCalendar = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
    const datepicker = document.getElementById("datepicker");

    if (datepicker) {
      datepicker.style.top = `${e.currentTarget.getBoundingClientRect().bottom}px`;
      datepicker.style.left = `${e.currentTarget.getBoundingClientRect().left}px`;
    }
    setShowCalendar(!showCalendar);
  };

  const onScheduleSession = async () => {
    if (date && time && date && time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const scheduleTime = dayjs(date + " " + time, "YYYY-MM-DD HH:mm");
      if (scheduleTime.isValid() && scheduleTime.isAfter(dayjs())) {
        try {
          const response = await secureApi.post("/session-schedule", {
            scheduleTime: scheduleTime.toISOString(),
          });
          setScheduleSessions([...scheduleSessions, response.data]);
          setDate("");
          setTime("");
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const onDeleteScheduleSession = async (id: string) => {
    try {
      await secureApi.delete(`/session-schedule/${id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setScheduleSessions(scheduleSessions.filter((scheduleSession) => scheduleSession.id !== id));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-3">
      <h1 className="text-2xl font-semibold text-blue-400 my-2">Lịch tập</h1>
      <div className="max-w-lg rounded-lg p-4 shadow-sm">
        <div className="flex flex-row gap-x-4">
          <div className="basis-full md:basis-1/2">
            <h2 className="mb-2">Ngày:</h2>
            <div
              ref={calendarInputRef}
              onClick={onShowCalendar}
              className="flex flex-row py-1.5 px-3 w-full border border-gray-200 rounded-lg text-sm active:border-blue-500 active:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
              <span className="basis-full">{date}</span>
              <span className="h-full flex items-center justify-center">
                <CalendarIcon className="size-full stroke-1" />
              </span>
            </div>
          </div>
          <div className="basis-full md:basis-1/2">
            <h2 className="mb-2">Giờ:</h2>
            <input
              type="time"
              className="py-1.5 px-3 block w-full outline-none border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end mt-2">
          <button onClick={onScheduleSession} className="bg-blue-500 text-white px-4 py-1.5 rounded-lg">
            Hẹn lịch
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3">
        {isLoading && (
          <div
            className="animate-spin inline-block size-10 border-3 border-current border-t-transparent text-blue-600 rounded-full"
            role="status"
            aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {scheduleSessions.map((scheduleSession) => (
          <div className="bg-gray-100 p-2 rounded-lg flex flex-row" key={scheduleSession.id}>
            <p className="basis-full">{dayjs(scheduleSession.scheduleTime).format("DD/MM/YYYY HH:mm")}</p>
            <span className="p-1 cursor-pointer rounded-full bg-red-100 hover:bg-red-200 active:bg-red-200" onClick={() => onDeleteScheduleSession(scheduleSession.id)}>
              <Trash className="size-full text-red-500" />
            </span>
          </div>
        ))}
      </div>
      <div
        ref={datepickerRef}
        id="datepicker"
        className={`absolute inline-block z-50 shadow-lg border-[1px] border-gray-200 rounded-lg transition-all duration-300 ${
          !showCalendar ? "invisible opacity-0" : "visible opacity-100"
        }`}>
        <div id="calendar"></div>
      </div>
    </div>
  );
}
