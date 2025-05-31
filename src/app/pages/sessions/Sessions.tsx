import { useCallback, useEffect, useRef, useState } from "react";
import { normalApi } from "../../../utils/http";
import type { ISession } from "../../../utils/interfaces";
import { SessionCard } from "../../../components";
import { SearchIcon } from "../../../components/icons";

export function Sessions() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchSessions = useCallback(() => {
    if (nextPage && !loading) {
      setLoading(true);
      normalApi
        .get(`/sessions?page=${nextPage}${searchQuery && `&s=${searchQuery}`}`)
        .then((data) => {
          if (data.data.length > 0) {
            setSessions(...[nextPage === 1 ? data.data : [...sessions, ...data.data]]);
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
  }, [nextPage, loading, sessions, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("session-container");
      if (container && window.scrollY + window.innerHeight >= container.offsetTop + container.offsetHeight - 80 && nextPage !== 1) {
        fetchSessions();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchSessions, nextPage]);

  useEffect(() => {
    if (nextPage === 1) fetchSessions();
  }, [fetchSessions, nextPage]);

  const onSearch = useCallback(() => {
    setSearchQuery(searchRef.current?.value || "");
    setNextPage(1);
  }, []);

  return (
    <div className="col-span-full md:col-span-2">
      <div className="flex flex-row my-3 border-gray-400 border px-4 py-1.5 rounded-full col-span-full">
        <div className="basis-full">
          <input
            ref={searchRef}
            className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-300"
            placeholder="Tìm bài tập..."
            type="text"
          />
        </div>
        <div className="w-[1px] bg-gray-300 mx-2"></div>
        <button onClick={onSearch} className="size-6">
          <SearchIcon className="w-full h-full text-gray-600" />
        </button>
      </div>

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
