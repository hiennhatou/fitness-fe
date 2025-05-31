import { Fragment, useEffect, useMemo, type JSX } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

import { ActivityIcon, Burger, Collapse, ComunityIcon, Dumbbell, ExitIcon, HeartHandShakeIcon, ProfileIcon, UserPenIcon } from "../components/icons";
import { useUserState } from "./globalState";
import anonymousAvatar from "../assets/anonymous-avatar.jpg";
import { UserRoleEnum } from "../utils/enums";
import type { IUser } from "../utils/interfaces";

function getPersonalizedMenu(user?: Omit<IUser, "password"> | null) {
  const menu: { label: string; to: string; Icon: JSX.Element }[] = [
    {
      label: "Hồ sơ cá nhân",
      to: `/profile?id=${user?.id}`,
      Icon: <ProfileIcon className="size-4" />,
    },
    {
      label: "Thông tin cá nhân",
      to: "/user-inform",
      Icon: <UserPenIcon className="size-4" />,
    },
    {
      label: "Chỉ số sức khỏe",
      to: "/user-inform/metrics",
      Icon: <ActivityIcon className="size-4" />,
    },
    {
      label: "Tư vấn từ PT",
      to: "/recommend-session",
      Icon: <HeartHandShakeIcon className="size-4" />,
    },
  ];
  switch (user?.role) {
    case UserRoleEnum.ROLE_TRAINER:
      menu.push(
        {
          label: "Quản lý bài tập tổng hợp",
          to: "/manage-sessions",
          Icon: <Dumbbell className="size-4" />,
        },
        {
          label: "Quản lý học viên",
          to: "/trainees",
          Icon: <ComunityIcon className="size-4" />,
        }
      );
      break;
    default:
      break;
  }

  return menu;
}

export function RootTemplate() {
  const user = useUserState((state) => state.user);
  const isLoaded = useUserState((state) => state.isLoaded);
  const setUser = useUserState((state) => state.setUser);
  const navigate = useNavigate();
  const location = useLocation();

  const personalizedMenu = useMemo(() => getPersonalizedMenu(user), [user]);

  useEffect(() => {
    setTimeout(() => {
      if (window.HSStaticMethods) window.HSStaticMethods.autoInit();
    }, 100);
  }, [location, user]);

  useEffect(() => {
    if (!user && isLoaded) navigate("/login");
  }, [user, navigate, isLoaded]);

  const onLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Fragment>
      {!isLoaded && (
        <div className="absolute z-50 bg-white top-0 bottom-0 right-0 left-0 flex items-center justify-center">
          <div
            className="animate-spin inline-block size-20 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
            role="status"
            aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="min-h-dvh grid grid-rows-[min-content_100%]">
        <header className="sticky top-0 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 shadow-md z-40">
          <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center justify-between">
              <Link
                className="font-[Mulish] flex-none text-2xl font-extrabold text-blue-400 focus:outline-hidden focus:opacity-60"
                to="/"
                aria-label="Brand">
                FitnessApp
              </Link>
              <div className="sm:hidden">
                <button
                  type="button"
                  className="hs-collapse-toggle relative size-9 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  id="hs-navbar-collapse"
                  aria-expanded="false"
                  aria-controls="hs-navbar"
                  aria-label="Đóng/mở menu"
                  data-hs-collapse="#hs-navbar">
                  <Burger />
                  <Collapse />
                  <span className="sr-only">Đóng/mở menu</span>
                </button>
              </div>
            </div>
            <div
              id="hs-navbar"
              className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
              aria-labelledby="hs-navbar-collapse">
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5 [&>.active]:text-blue-400 [&>:not(.active)]:focus:text-gray-400 [&>:not(.active)]:hover:text-gray-400">
                <Link className="font-medium text-gray-600 focus:outline-hidden" to="/sessions">
                  Bài tập tổng hợp
                </Link>
                <Link className="font-medium text-gray-600 focus:outline-hidden" to="/exercises">
                  Bài tập đơn
                </Link>
                {user && (
                  <div className="hs-dropdown relative inline-block [--strategy:static] sm:[--strategy:fixed]">
                    <button
                      id="hs-dropdown-default"
                      type="button"
                      className="cursor-pointer hs-dropdown-toggle flex flex-row rounded-full gap-x-1 items-center text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Dropdown">
                      <img src={user.avatar || anonymousAvatar} alt="" className="size-8 rounded-full" />
                      <span className="text-sm">{user.firstName}</span>
                    </button>

                    <div
                      className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="hs-dropdown-default">
                      <div className="p-1 space-y-0.5">
                        {personalizedMenu.map((item, idx) => (
                          <Link
                            key={idx}
                            className="flex items-center py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 gap-x-2"
                            to={item.to}>
                            {item.Icon}
                            {item.label}
                          </Link>
                        ))}
                        <a
                          onClick={onLogout}
                          className="!cursor-pointer flex items-center py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 gap-x-2">
                          <ExitIcon className="size-4" />
                          Đăng xuất
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
        <div className="mx-auto max-w-7xl h-full w-full">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
}
