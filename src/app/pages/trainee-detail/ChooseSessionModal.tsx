import { useCallback, useEffect, useRef, useState } from "react";
import { CheckedIcon, SearchIcon } from "../../../components/icons";
import type { ISession } from "../../../utils/interfaces";
import { normalApi } from "../../../utils/http";
import { HSOverlay, type ICollectionItem } from "preline";
import sessionCover from "../../../assets/session-cover.webp";
import anonymousAvatar from "../../../assets/anonymous-avatar.jpg";

function SessionCard({ session, onClick, isSelect = false }: { session: ISession; onClick: () => void; isSelect?: boolean }) {
  return (
    <div
      className="cursor-pointer relative shadow-xs rounded-lg  border-gray-200 border bg-indigo-50 hover:shadow-xl transition-shadow duration-100 ease-in-out z-0 overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: `url(${session.coverImage || sessionCover})` }}>
      <div
        onClick={onClick}
        className="relative block h-full z-20 bg-[rgba(0,0,0,0.3)] backdrop-saturate-200 active:bg-[rgba(0,0,0,0.25)] py-2 px-3 text-white text-shadow-gray-800 text-shadow-md">
        <div className="flex flex-row items-center my-2">
          <div>
            <img width={45} height={45} className="rounded-full inline-block" src={session.owner?.avatar || anonymousAvatar} />
          </div>
          <div className="flex flex-col pl-2">
            <div>
              <span className="font-semibold">{session.owner?.firstName || "Anomymous Trainer"}</span>{" "}
              {session.owner ? <span className="text-gray-100 text-sm">&#9210; {session.owner.username}</span> : ""}
            </div>
          </div>
        </div>
        <h1 className="text-xl font-semibold my-1 overflow-ellipsis overflow-hidden text-nowrap">{session.name}</h1>
        <div className="line-clamp-3">{session.description}</div>
        <div className="flex justify-end">
          <span className="size-8 bg-white rounded-full overflow-hidden">
            {isSelect && (
              <span className="inline-block size-full bg-blue-500 p-1">
                <CheckedIcon className="size-full text-white" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ChooseSessionModal({ onSuccess }: { onSuccess: (session: ISession) => Promise<void> }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedSessions, setSearchedSessions] = useState<ISession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [nextPage, setNextPage] = useState<number>(1);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSessions = useCallback(async () => {
    if (isLoadingPage) return;
    setIsLoadingPage(true);
    try {
      const req = await normalApi.get<ISession[]>("/sessions", {
        params: {
          page: nextPage,
          ...(searchQuery ? { s: searchQuery } : {}),
        },
      });
      if (req.status === 200 && req.data && req.data.length > 0) {
        setSearchedSessions(nextPage === 1 ? req.data : [...searchedSessions, ...req.data]);
      } else throw new Error("Failed to fetch sessions");
      setNextPage(nextPage + 1);
    } catch (error) {
      console.error(error);
      setNextPage(0);
    } finally {
      setIsLoadingPage(false);
    }
  }, [nextPage, searchQuery, searchedSessions, isLoadingPage]);

  useEffect(() => {
    HSOverlay.autoInit();
  }, []);

  useEffect(() => {
    const modal = HSOverlay.getInstance("#hs-choose-session-modal", true) as ICollectionItem<HSOverlay>;
    modal.element.on("open", () => {
      if (nextPage === 1) fetchSessions();
    });
  }, [nextPage, fetchSessions]);

  useEffect(() => {
    if (nextPage === 1) fetchSessions();
  }, [searchQuery, nextPage, fetchSessions]);

  useEffect(() => {
    const modal = HSOverlay.getInstance("#hs-choose-session-modal", true) as ICollectionItem<HSOverlay>;
    modal.element.on("close", () => {
      setSearchedSessions([]);
      setNextPage(1);
      setSearchQuery("");
      setSelectedSession(null);
      setIsProcessing(false);
    });
  }, []);

  useEffect(() => {
    const content = document.getElementById("hs-choose-session-modal-content");
    const onScroll = () => {
      if (content && content.scrollTop + content.clientHeight >= content.scrollHeight) {
        if (nextPage > 1) fetchSessions();
      }
    };
    content?.addEventListener("scroll", onScroll);
    return () => content?.removeEventListener("scroll", onScroll);
  }, [nextPage, fetchSessions]);

  const onSave = useCallback(async () => {
    if (selectedSession) {
      setIsProcessing(true);
      try {
        await onSuccess(selectedSession);
        const modal = HSOverlay.getInstance("#hs-choose-session-modal", true) as ICollectionItem<HSOverlay>;
        modal.element.close();
      } catch (error) {
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [selectedSession, onSuccess]);

  const onSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setNextPage(1);
    setSearchedSessions([]);
  }, []);

  return (
    <div
      id="hs-choose-session-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-choose-session-modal-label">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 lg:max-w-4xl lg:w-full m-3 lg:mx-auto h-[calc(100%-56px)] flex items-center">
        <div className="max-h-full w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto overflow-hidden">
          <div className="flex gap-3 justify-between items-center px-4 py-2.5 border-b border-gray-200">
            <div className="flex flex-row border-gray-400 border px-4 py-1.5 rounded-full basis-full">
              <div className="basis-full">
                <input
                  ref={inputRef}
                  className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-300"
                  placeholder="Tìm bài tập..."
                  type="text"
                />
              </div>
              <div className="w-[1px] bg-gray-300 mx-2"></div>
              <button onClick={() => onSearch(inputRef.current?.value || "")} className="size-6">
                <SearchIcon className="w-full h-full text-gray-600" />
              </button>
            </div>
          </div>
          <div id="hs-choose-session-modal-content" className="p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
                  {...{ isSelect: selectedSession?.id === session.id }}
                />
              ))}
            </div>
            {!!nextPage && (
              <div className="flex justify-center items-center py-4">
                <div
                  className="animate-spin inline-block size-10 border-3 border-current border-t-transparent text-blue-600 rounded-full"
                  role="status"
                  aria-label="loading">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            <button
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-choose-session-modal">
              Đóng
            </button>
            <button
              {...{ disabled: !selectedSession || isProcessing }}
              type="button"
              onClick={onSave}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
