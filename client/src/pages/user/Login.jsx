import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData, userData } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleVerificationProcess = async () => {
    setIsLoading(true);
    try {
      const otpResponse = await sendVerificationOtp();
      if (otpResponse.success) {
        navigate("/email-verify");
        toast.success(otpResponse.message);
      } else {
        toast.error(otpResponse.message);
      }
    } catch (error) {
      toast.error(error.message || "فشل إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.defaults.withCredentials = true;

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await getUserData();
          await handleVerificationProcess();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();

          if (userData && !userData.isAccountVerified) {
            await handleVerificationProcess();
          } else {
            navigate("/Home");
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex arabic-text items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-white-400">
      <img
        onClick={() => navigate("/")}
        src={assets.elfirma}
        alt="شعار"
        className="absolute left-5 sm:left-20 top-5 w-50 sm:w-60 cursor-pointer"
      />
      <div className="bg-slate-900 arabic-text p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl  arabic-text font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "إنشاء حساب" : "تسجيل الدخول"}
        </h2>

        <p className="text-center arabic-text text-sm mb-6">
          {state === "Sign Up"
            ? "أنشئ حسابك الخاص"
            : "سجل الدخول إلى حسابك!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="أيقونة الشخص" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="الاسم الكامل"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="أيقونة البريد" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="البريد الإلكتروني"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="أيقونة القفل" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="كلمة المرور"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            نسيت كلمة المرور؟
          </p>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? "جاري المعالجة..." : state === "Sign Up" ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            لديك حساب بالفعل؟{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              سجل الدخول هنا
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            ليس لديك حساب؟{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              أنشئ حسابًا
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;