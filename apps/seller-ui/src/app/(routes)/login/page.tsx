"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

// Rectangular Loader Component
const RectangularLoader = () => {
  return (
    <div className="flex justify-center items-center space-x-1">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="w-3 h-8 bg-gray-300 rounded animate-pulse"
          style={{
            animation: `loader 1.4s ease-in-out infinite both`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes loader {
          0%, 80%, 100% {
            transform: scaleY(0.4);
            opacity: 0.5;
          }
          40% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async(data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/login-seller`, data,{
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      // Invalidate and refetch seller data after successful login
      queryClient.invalidateQueries({ queryKey: ["seller"] });
      router.push("/");
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as {message: string})?.message;
      setServerError(errorMessage || "An error occurred while logging in");
    }
  })


  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };
  return (
     <div className="w-full py-10 min-h-screen bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Login
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home.Login
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white rounded-lg shadow">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to SwiftKart
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Don't have an account?{" "}
            <Link href={"/signup"} className="text-[#3489FF]">
              Sign up
            </Link>
          </p>

          {/* <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-2">or Sign in with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div> */}

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="support@swiftkart.com"
              className="w-full p-2 border border-gray-300 !rounded mb-1"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="text-red-500">{String(errors.email.message)}</p>}

            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="********"
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />

              <button
                type="button"
                className="absolute right-3 text-gray-400 inset-y-0 flex items-center"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeIcon /> : <EyeOff />}
              </button>
              {errors.password && (
                <p className="text-red-500">{String(errors.password.message)}</p>
              )}

            </div>
              <div className="flex justify-between items-center my-4]">
                <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    Remember me
                </label>

                <Link href={"/forgot-password"} className="text-blue-500 text-sm">Forgot password?</Link>
              </div>

              <button disabled={loginMutation.isPending} type="submit" className={`w-full my-4 text-lg p-2 rounded-md ${loginMutation.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black cursor-pointer'} text-white`}>
                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <RectangularLoader />
                  </div>
                ) : (
                  "Login"
                )}
              </button>

              {serverError && <p className="text-red-500">{serverError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
