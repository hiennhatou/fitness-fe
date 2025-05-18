import { useEffect, useState } from "react";
import SessionCard from "../../components/SessionCard";
import type { SessionCardType } from "../../components/SessionCard";
import axios from "axios";
import { useNavigate } from "react-router";

export default function LatestSession() {
  const [sessions, setSessions] = useState<SessionCardType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_HOST}/sessions`)
      .then((data) => {
        return data.data;
      })
      .then((data) => {
        setSessions(data);
      });
  }, [navigate]);

  return (
    <div>
      <h1 className="text-2xl font-[Mulish] font-semibold text-blue-400 mb-4">Gợi ý từ huấn luyện viên</h1>
      <div className="gap-6 grid grid-flow-row grid-cols-1 min-lg:grid-cols-2">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
