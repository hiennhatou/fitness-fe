import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Eye } from "../../../components/icons";
import imageCover from "../../../assets/login-cover.png";
import { useUserState } from "../../globalState";
import { loadUser } from "../../../utils/functions/loadUser";
import { normalApi } from "../../../utils/http";
import { Template } from "./Template";

function RightComponent() {
  const user = useUserState((state) => state.user);
  const isLoaded = useUserState((state) => state.isLoaded);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (window.HSStaticMethods) window.HSStaticMethods.autoInit(["toggle-password"]);
    });
  }, []);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, isLoaded, navigate]);

  const onLogin = () => {
    if (username && password) {
      normalApi
        .post(`/login`, { username, password }, { headers: { "Content-Type": "application/json" } })
        .then((data) => {
          if (data.status === 200 && data.data.token) return data.data as { token: string };
          throw new Error("Lỗi hệ thống");
        })
        .then((data) => {
          localStorage.setItem("token", data.token);
          return loadUser(true);
        })
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
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
      <div className="flex flex-col gap-2">
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
      <div className="flex flex-row justify-between text-sm text-gray-800 underline">
        <a href="#">Quên mật khẩu?</a>
        <Link to="/register">Chưa có tài khoản? Đăng ký tại đây</Link>
      </div>
      <button
        type="button"
        onClick={onLogin}
        className="py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
        Đăng nhập
      </button>
    </>
  );
}

export default function Login() {
  return (
    <Template
      rightComponent={<RightComponent />}
      coverImage={imageCover}
      name="Đăng nhập"
      quote={
        <>
          Tập luyện thông minh
          <br />
          Sống khỏe toàn diện
        </>
      }
    />
  );
}
