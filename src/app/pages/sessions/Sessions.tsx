import { useCallback, useEffect, useState } from "react";
import { normalApi } from "../../../utils/http";
import type { ISession } from "../../../utils/interfaces";
import { SessionCard } from "../../../components";

export function Sessions() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState<number | null>(1);

  const fetchSessions = useCallback(() => {
    if (nextPage && !loading) {
      setLoading(true);
      normalApi
        .get(`/sessions?page=${nextPage}`)
        .then((data) => {
          if (data.data.length > 0) {
            setSessions([...sessions, ...data.data]);
            setNextPage(nextPage + 1);
          } else {
            throw new Error("No sessions found");
          }
        })
        .catch((err) => {
          setNextPage(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [nextPage, loading, sessions]);

  useEffect(() => {
    const handleScroll = () => {
      console.log("aa");

      const container = document.getElementById("session-container");
      if (container && window.scrollY + window.innerHeight >= container.offsetTop + container.offsetHeight - 80) {
        fetchSessions();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchSessions]);

  useEffect(() => {
    normalApi
      .get(`/sessions?page=1`)
      .then((data) => {
        if (data.data.length > 0) {
          setSessions(data.data);
          setNextPage(2);
        } else {
          throw new Error("No sessions found");
        }
      })
      .catch((err) => {
        setNextPage(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="col-span-full md:col-span-2">
      <div id="session-container" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {loading && (
        <div
          className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
          role="status"
          aria-label="loading">
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}
