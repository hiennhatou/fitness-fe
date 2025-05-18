import { Link } from "react-router";
import createSessionImg from "../assets/create-session.jpg";
import scheduleSessionImg from "../assets/schedule-session.jpg";
import historySessionImg from "../assets/history-session.jpeg";

export default function Actions() {
  return (
    <div className="flex flex-col my-4 gap-y-2">
      <Link
        to="/start-session"
        style={{ backgroundImage: `url(${createSessionImg})` }}
        className="relative overflow-hidden inline-flex items-center gap-x-2 text-sm font-medium rounded-lg h-32 bg-center bg-cover bg-no-repeat z-0 after:z-10 after:absolute after:top-0 after:right-0 after:left-0 after:bottom-0 after:content-['Bắt_đầu_phiên_tập'] after:backdrop-brightness-50 after:text-white after:flex after:items-center after:justify-center after:text-2xl after:text-shadow-lg hover:after:backdrop-brightness-75 focus:after:backdrop-brightness-100"></Link>
      <Link
        to="/schedule-session"
        style={{ backgroundImage: `url(${scheduleSessionImg})` }}
        className="relative overflow-hidden inline-flex items-center gap-x-2 text-sm font-medium rounded-lg h-32 bg-center bg-cover bg-no-repeat z-0 after:z-10 after:absolute after:top-0 after:right-0 after:left-0 after:bottom-0 after:content-['Lên_lịch_tập_luyện'] after:backdrop-brightness-50 after:text-white after:flex after:items-center after:justify-center after:text-2xl after:text-shadow-lg hover:after:backdrop-brightness-75 focus:after:backdrop-brightness-100"></Link>
      <Link
        to="/history/sessions"
        style={{ backgroundImage: `url(${historySessionImg})` }}
        className="relative overflow-hidden inline-flex items-center gap-x-2 text-sm font-medium rounded-lg h-32 bg-center bg-cover bg-no-repeat z-0 after:z-10 after:absolute after:top-0 after:right-0 after:left-0 after:bottom-0 after:content-['Lịch_sử_tập_luyện'] after:backdrop-brightness-50 after:text-white after:flex after:items-center after:justify-center after:text-2xl after:text-shadow-lg hover:after:backdrop-brightness-75 focus:after:backdrop-brightness-100"></Link>
    </div>
  );
}
