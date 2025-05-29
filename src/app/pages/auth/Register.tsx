import { useState } from "react";
import { Link } from "react-router";
import { Eye } from "../../../components/icons";
import imageCover from "../../../assets/register-cover.png";
import { Template } from "./Template";

function RightComponent() {
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const onRegister = () => {
    console.log(username);
    console.log(password);
  };

  return (
    <>
      <div className="flex flex-row gap-3">
        <div className="flex flex-col gap-2 flex-1/2">
          {/* Last Name */}
          <label className="text-gray-800" htmlFor="lastname-input">
            Họ:
          </label>
          <input
            value={lastName}
            onChange={(t) => setLastName(t.currentTarget.value)}
            className="w-full outline-none py-2.5 sm:py-3 px-4 block border border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            type="text"
            name="last-name"
            id="lastname-input"
            placeholder="Họ..."
          />
        </div>
        {/* First Name */}
        <div className="flex flex-col gap-2 flex-1/2">
          <label className="text-gray-800" htmlFor="name-input">
            Tên:
          </label>
          <input
            value={name}
            onChange={(t) => setName(t.currentTarget.value)}
            className="w-full outline-none py-2.5 sm:py-3 px-4 block border border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            type="text"
            name="first-name"
            id="name-input"
            placeholder="Tên..."
          />
        </div>
      </div>
      <div className="flex flex-row gap-3">
        {/* Username */}
        <div className="flex flex-col gap-2 flex-1/2">
          <label className="text-gray-800" htmlFor="username-input">
            Tên đăng nhập:
          </label>
          <input
            value={username}
            onChange={(t) => setUsername(t.currentTarget.value)}
            className="w-full outline-none py-2.5 sm:py-3 px-4 block border border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            type="text"
            name="username"
            id="username-input"
            placeholder="Tên đăng nhập..."
          />
        </div>
        {/** Email */}
        <div className="flex flex-col gap-2 flex-1/2">
          <label className="text-gray-800" htmlFor="email-input">
            Email:
          </label>
          <input
            value={email}
            onChange={(t) => setEmail(t.currentTarget.value)}
            className="w-full outline-none py-2.5 sm:py-3 px-4 block border border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            type="text"
            name="email"
            id="email-input"
            placeholder="Email..."
          />
        </div>
      </div>
      <div className="flex flex-row gap-3">
        {/** Password */}
        <div className="flex flex-col gap-2 flex-1/2">
          <label className="text-gray-800" htmlFor="password-input">
            Mật khẩu:
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(t) => setPassword(t.currentTarget.value)}
              id="password-input"
              name="password"
              type="password"
              className="outline-none py-2.5 sm:py-3 ps-4 pe-10 block w-full border border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Mật khẩu..."
            />
            <button
              type="button"
              data-hs-toggle-password='{"target": "#password-input"}'
              className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600">
              <Eye />
            </button>
          </div>
        </div>
        {/* Repeated Password */}
        <div className="flex flex-col gap-2 flex-1/2">
          <label className="text-gray-800" htmlFor="repeated-password-input">
            Nhập lại mật khẩu:
          </label>
          <div className="relative">
            <input
              value={repeatedPassword}
              onChange={(t) => setRepeatedPassword(t.currentTarget.value)}
              id="repeated-password-input"
              name="repeated-password"
              type="password"
              className="outline-none py-2.5 sm:py-3 ps-4 pe-10 block w-full border border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Nhập lại mật khẩu..."
            />
            <button
              type="button"
              data-hs-toggle-password='{"target": "#repeated-password-input"}'
              className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600">
              <Eye />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between text-sm text-gray-800 underline">
        <a href="#">Quên mật khẩu?</a>
        <Link to="/login">Đã có tài khoản? Đăng nhập tại đây</Link>
      </div>
      <button
        type="button"
        onClick={onRegister}
        className="py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
        Đăng ký
      </button>
    </>
  );
}

export default function Register() {
  return (
    <Template
      rightComponent={<RightComponent />}
      coverImage={imageCover}
      name="Đăng ký"
      quote={
        <>
          Không chỉ tập luyện,
          <br />
          mà còn sống trọn vẹn.
        </>
      }
    />
  );
}
