"use client"

import { useState} from "react"
import { Eye, EyeOff, Lock, Mail, User, ArrowRight,UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { set } from "react-hook-form"
import {jwtDecode} from "jwt-decode"
import { api } from "../components/setting/api"
import { toast } from "react-toastify"
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
 const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginError, setLoginError] = useState("");
  const [error, setError] = useState("");
const navigate = useNavigate();


const payload = {
  username,
  password,
};


    const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/api/accounts/login", payload);
      console.log(response)
      if (!response.data.status) {
        setLoginError(response.data.message);
        setIsLoading(false);
        console.log("Login failed:", response.data.message);
        return;
      }
      // Extract JWT from your actual API response
      const token = response.data?.result?.token; 
      console.log("token:", token);
      if (!token) {
        setError(response.data?.message);
        setIsLoading(false);
        return;
      }else {
        localStorage.setItem("token", token);
      }

      const role = response.data?.result?.role?.roleName || [];
      // try {
      //   const decodedToken = jwtDecode(token);
      //  roles = decodedToken.role || [];
       console.log(role) 
      // } catch (error) {
      //   console.error("Error decoding token:", error);
      // }
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "User":
          navigate("/home");
          break;
        default:
          navigate("/");
      }

      console.log("User role:", user?.roles?.[0]);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình đăng nhập"
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };


const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  // Kiểm tra mật khẩu khớp
  if (password !== confirmPassword) {
    toast.error("Mật khẩu và xác nhận mật khẩu không khớp");
    return;
  }

  // Tạo payload
  const payload = {
    username,
    email,
    password,
  };

  try {
    const response = await api.post("/api/accounts/register", payload);   

    if (response.data?.status === true || response.status === 200) {
      // Reset form (tuỳ ý)
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Chuyển sang trang đăng nhập hoặc form đăng nhập
      setIsRegistering(false);
      toast.success("Đăng kí thành công !! Mời bạn đăng nhập")
    } else {
      console.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    setError(error.response?.data?.message);
  }
};


  

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-200 flex items-center justify-center p-5 rounded-2xl">


      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}


          {/* Form */}
          { !isRegistering ? (<form onSubmit={handleLogin} className="px-8 pb-8 space-y-6">
            {/* Email Field */}
            <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome to Orchid
            </h1>
            <p className="text-gray-500 text-sm">Đăng nhập để tiếp tục hành trình của bạn</p>
          </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block ">
                Tài khoản 
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                  placeholder="Tên đăng nhập..."
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  
                  className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors hover:underline cursor-pointer"
                  onClick={() => setIsRegistering(true)}
                >
                  Đăng ký miễn phí
                </button>
              </p>
            </div>
          </form>) : (
             <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-500 text-sm">Đăng ký để bắt đầu hành trình của bạn</p>
          </div>

          {/* Form */}
<form onSubmit={handleRegister} className="px-8 pb-8 space-y-5">
  {/* Username */}
  <div className="space-y-2">
    <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
      Tên đăng nhập
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <User className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50 hover:bg-white focus:bg-white"
        placeholder="Tên đăng nhập"
        required
      />
    </div>
  </div>

  {/* Email */}
  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
      Email
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Mail className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50 hover:bg-white focus:bg-white"
        placeholder="example@email.com"
        required
      />
    </div>
  </div>

  {/* Password */}
  <div className="space-y-2">
    <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
      Mật khẩu
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50 hover:bg-white focus:bg-white"
        placeholder="••••••••"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    <p className="text-xs text-gray-500">Mật khẩu phải có ít nhất 8 ký tự</p>
  </div>

  {/* Confirm Password */}
  <div className="space-y-2">
    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
      Xác nhận mật khẩu
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50 hover:bg-white focus:bg-white"
        placeholder="••••••••"
        required
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
      >
        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    <div className="text-red-500">{error}</div>
    
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isLoading}
    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 mt-6"
  >
    {isLoading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>Đang xử lý...</span>
      </>
    ) : (
      <>
      
        <span>Đăng ký</span>
        <ArrowRight className="w-5 h-5" />
      </>
    )}
  </button>

  {/* Login Redirect */}
  <div className="text-center pt-4">
    <p className="text-sm text-gray-600">
      Đã có tài khoản?{" "}
      <button
        onClick={() => setIsRegistering(false)}
        className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors hover:underline"
      >
        Đăng nhập ngay
      </button>
    </p>
  </div>
</form>

        </div>
      </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
