import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import profileCover from "../../../assets/profile-cover.jpg";
import defaultAvatar from "../../../assets/anonymous-avatar.jpg";

import { SessionCardNoOwner } from "../../../components";
import { normalApi, secureApi } from "../../../utils/http";

import { UserRoleEnum } from "../../../utils/enums";
import type { ISession, IUser } from "../../../utils/interfaces";
import { useUserState } from "../../globalState";

export function Profile() {
  const { user } = useLoaderData() as { user: IUser };
  const currentUser = useUserState((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [currentPT, setCurrentPT] = useState<IUser | null>(null);
  const [loadedPt, setLoadedPt] = useState(false);

  const getPT = async () => {
    try {
      const data = await secureApi.get(`/me/pt`);
      setCurrentPT(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadedPt(true);
    }
  };

  useEffect(() => {
    if (user.id !== currentUser?.id) {
      normalApi
        .get(`users/${user.id}/sessions`)
        .then((res) => {
          setSessions(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
      getPT();
    } else {
      secureApi
        .get(`me/sessions`)
        .then((res) => {
          setSessions(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, currentUser]);

  const onRegisterPT = async () => {
    try {
      await secureApi.post(
        `register-pt`,
        {
          trainerId: `${user.id}`,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getPT();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div
        className="relative w-full h-80 bg-cover bg-center bg-no-repeat max-w-5xl mx-auto rounded-b-3xl shadow-lg"
        style={{ backgroundImage: `url(${profileCover})` }}>
        <div className="absolute -bottom-[calc(var(--spacing)*25)] h-50 flex flex-row">
          <div
            className="h-full aspect-square rounded-full border-2 border-white ms-5  bg-gray-200 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${user.avatar || defaultAvatar})` }}></div>
          <div className="relative top-25 mx-5 my-2">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-2xl">
                {user.lastName} {user.firstName}
              </h1>
              {user.role === UserRoleEnum.ROLE_TRAINER && currentUser && user.id !== currentUser.id && loadedPt && !currentPT && (
                <button onClick={onRegisterPT} className="cursor-pointer hover:bg-blue-500 h-full bg-blue-400 px-2 rounded-md text-white shadow-sm">
                  Đăng ký PT
                </button>
              )}
            </div>
            <div className="flex flex-row gap-2 text-gray-700 text-sm">
              <span>{user.username}</span>
              {user.role === UserRoleEnum.ROLE_TRAINER && (
                <>
                  <span>&#8226;</span>
                  <span>Huấn luyện viên</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl w-full mx-auto mt-25 py-3">
        {isLoading && (
          <div className="flex flex-row justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {sessions?.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl">Phiên tập mẫu</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sessions.map((session) => {
                return <SessionCardNoOwner key={session.id} session={session} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
