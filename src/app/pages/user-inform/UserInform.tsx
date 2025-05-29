import { Bounce, ToastContainer, toast } from "react-toastify";
import { useEffect, useState, useRef, type ChangeEvent, type MouseEvent } from "react";
import dayjs from "dayjs";
import { Calendar } from "vanilla-calendar-pro";
import * as yup from "yup";
import { GenderEnum } from "../../../utils/enums";
import avatarDefault from "../../../assets/anonymous-avatar.jpg";
import { Camera } from "../../../components/icons/Camera";
import { secureApi } from "../../../utils/http";
import { CalendarIcon } from "../../../components/icons";
import type { IUser } from "../../../utils/interfaces";

function getAvatar(avatar: File | string | null) {
  if (avatar) {
    if (typeof avatar === "string") {
      return avatar;
    }
    return URL.createObjectURL(avatar);
  }
  return avatarDefault;
}

export function UserInform() {
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [avatar, setAvatar] = useState<File | string | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const imgInputRef = useRef<HTMLInputElement>(null);
  const datepickerRef = useRef<HTMLDivElement>(null);
  const calendarInputRef = useRef<HTMLDivElement>(null);

  const loadUserInfo = () => {
    secureApi.get<IUser>("/me").then((res) => {
      setFirstName(res.data.firstName || "");
      setMiddleName(res.data.middleName || "");
      setLastName(res.data.lastName || "");
      setEmail(res.data.email || "");
      setBirthDate(dayjs(res.data.birthdate).format("DD/MM/YYYY") || "");
      setGender(res.data.gender || "");
      setAvatar(res.data.avatar || null);
    });
  };

  // init user info
  useEffect(() => {
    loadUserInfo();
  }, []);

  // init calendar
  useEffect(() => {
    const calendar = new Calendar("#calendar", {
      type: "default",
      selectedTheme: "light",
      dateMax: "today",
      onClickDate: (date, e) => {
        if (date.context.selectedDates[0]) setBirthDate(dayjs(date.context.selectedDates[0], "YYYY-MM-DD").format("DD/MM/YYYY"));
        setShowCalendar(false);
      },
    });
    calendar.init();
  }, []);

  // handle click outside calendar
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

  const onChooseImage = () => {
    imgInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  const onSave = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Xác thực dữ liệu bằng Yup
      const userSchema = yup.object().shape({
        firstName: yup.string().required("Tên không được để trống"),
        lastName: yup.string().required("Họ không được để trống"),
        email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
        birthDate: yup.string().required("Ngày sinh không được để trống"),
        gender: yup.string().oneOf(["male", "female"], "Giới tính không hợp lệ").required("Giới tính không được để trống"),
      });

      try {
        await userSchema.validate({
          firstName,
          lastName,
          email,
          birthDate,
          gender,
        });
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          toast.error(error.message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          return;
        }
      }

      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("birthdate", dayjs(birthDate, "DD/MM/YYYY").format("YYYY/MM/DD"));
      formData.append("gender", gender.toUpperCase());
      if (avatar && avatar instanceof File) formData.append("img", avatar);
      await secureApi.patch("/me", formData);
      toast.success("Lưu thông tin thành công", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onShowCalendar = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
    setShowCalendar(!showCalendar);
    const datepicker = document.getElementById("datepicker");
    if (datepicker) {
      datepicker.style.top = `${e.currentTarget.getBoundingClientRect().bottom}px`;
      datepicker.style.left = `${e.currentTarget.getBoundingClientRect().left}px`;
    }
  };

  return (
    <>
      <div className="absolute">
        <ToastContainer />
      </div>
      <div className="relative col-span-full md:col-span-2">
        {isLoading && (
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.2)] z-40 flex items-center justify-center">
            <div
              className="animate-spin inline-block size-8 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
              role="status"
              aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="grid gap-4 lg:gap-6">
            <div className="flex items-center justify-center gap-x-4">
              <input onChange={onFileChange} ref={imgInputRef} type="file" accept="image/*" className="hidden" />
              <div
                onClick={onChooseImage}
                className="relative size-32 rounded-full bg-gray-200 border border-gray-50 overflow-hidden hover:[&>span]:bg-[rgba(122,122,122,0.5)]">
                <span className="absolute bottom-0 left-0 right-0 bg-[rgba(87,87,87,0.3)] text-white text-xs flex items-center justify-center pb-1 z-20">
                  <Camera />
                </span>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <img className="h-full object-cover object-center" src={getAvatar(avatar)} alt="avatar" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Họ</label>
                <input
                  type="text"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Nhập họ của bạn"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tên đệm</label>
                <input
                  type="text"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Nhập tên đệm của bạn"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tên</label>
                <input
                  type="text"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Nhập tên của bạn"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ngày sinh</label>
              <div
                ref={calendarInputRef}
                onClick={onShowCalendar}
                className="flex flex-row py-3 px-4 w-full border border-gray-200 rounded-lg text-sm active:border-blue-500 active:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                <span className="basis-full">{birthDate}</span>
                <span className="h-full flex items-center justify-center">
                  <CalendarIcon className="size-full stroke-1" />
                </span>
              </div>
              <div
                ref={datepickerRef}
                className={`absolute inline-block z-50 shadow-lg border-[1px] border-gray-200 rounded-lg transition-all duration-300 ${
                  !showCalendar ? "invisible opacity-0" : "visible opacity-100"
                }`}>
                <div id="calendar"></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Giới tính</label>
              <select
                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}>
                <option value="">Chọn giới tính</option>
                <option value={GenderEnum.MALE}>Nam</option>
                <option value={GenderEnum.FEMALE}>Nữ</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-x-2">
            <button
              type="button"
              onClick={() => loadUserInfo()}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none">
              Hủy
            </button>
            <button
              type="submit"
              onClick={onSave}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
