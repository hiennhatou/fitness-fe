import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SessionCard } from "../../../components";
import { normalApi } from "../../../utils/http";
import type { ISession } from "../../../utils/interfaces";

export default function LatestSession() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    normalApi
      .get(`/sessions?page=1`)
      .then((data) => {
        return data.data;
      })
      .then((data) => {
        setSessions(data);
      });
  }, []);

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
