"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

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
          0%,
          80%,
          100% {
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

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const startResendTimer = () => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOtp = () => {
    if (!userEmail || !canResend) return;
    
    requestOtpMutation.mutate({ email: userEmail });
    setCanResend(false);
    setTimer(60);
    startResendTimer();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forgot-password-user`,
        { email }
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setStep("otp");
      setUserEmail(email);
      setCanResend(false);
      setServerError(null);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "An error occurred while requesting OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-forgot-password-user`,
        {
          email: userEmail,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "An error occurred while verifying OTP");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reset-user-password`,
        {
          email: userEmail,
          newPassword: password,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      setServerError(null);
      router.push("/login");
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(
        errorMessage || "An error occurred while resetting password"
      );
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      // Always delete the current input
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move to previous input if not at the first box
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate({ password });
  };

  const onSubmit = (data: FormData) => {
    if(step === "email") {
      onSubmitEmail(data);
    } else if(step === "otp") {
      verifyOtpMutation.mutate();
    } else if(step === "reset") {
      onSubmitPassword(data);
    }
  };
  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Forgot Password
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home.ForgotPassword
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white rounded-lg shadow">
          {step === "email" && (
            <>
              <h3 className="text-3xl font-semibold text-center mb-2">
                Forgot Password
              </h3>
              <p className="text-center text-gray-500 mb-4">
                Remember your password?{" "}
                <Link href={"/login"} className="text-[#3489FF]">
                  Login
                </Link>
              </p>

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
                {errors.email && (
                  <p className="text-red-500">{String(errors.email.message)}</p>
                )}

                <button
                  disabled={requestOtpMutation.isPending}
                  type="submit"
                  className={`w-full mt-4 text-lg cursor-pointer p-2 rounded-md ${
                    requestOtpMutation.isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black cursor-pointer"
                  } text-white`}
                >
                  {requestOtpMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <RectangularLoader />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>

                {serverError && <p className="text-red-500">{serverError}</p>}
              </form>
            </>
          )}


          {step === "otp" && (
            <>
                  <h3 className="text-2xl font-semibold text-center mb-4">Enter OTP</h3>
                <div className="flex justify-center gap-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            ref={(el) => {
                                if (el) {
                                    inputRefs.current[index] = el;
                                }
                            }}//after the first input is focused, the next input should be focused
                            className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md"
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        />
                    ))}
                </div>

                <button 
                  type="button" 
                  disabled={verifyOtpMutation.isPending} 
                  className={`w-full mt-4 text-lg cursor-pointer p-2 rounded-md transition-all duration-200 ${
                    verifyOtpMutation.isPending 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`} 
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? <RectangularLoader /> : "Verify OTP"}
                </button>
                <p className="text-center text-gray-500 text-sm mt-2">
                    {canResend ? (
                        <>
                            Didn't receive OTP?
                            <button type="button" className="text-blue-500 text-sm ml-1 cursor-pointer" onClick={resendOtp}>Resend OTP</button>
                        </>
                    ) : (
                        <>
                            Resend OTP in {timer} seconds
                        </>
                    )}
                </p>

                {serverError && <p className="text-red-500">{serverError}</p>}
            </>
          )}

          {step === "reset" && (
            <>
                <h3 className="text-2xl font-semibold text-center mb-4">Reset Password</h3>
                <form onSubmit={handleSubmit(onSubmitPassword)}>
                    <label className="block text-gray-700 mb-1">New Password</label>
                    <input type="password" placeholder="********" className="w-full p-2 border border-gray-300 !rounded mb-1" {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long",
                        },
                    })} />
                    {errors.password && <p className="text-red-500">{String(errors.password.message)}</p>}
                    <button type="submit" disabled={resetPasswordMutation.isPending} className={`w-full mt-4 text-lg cursor-pointer p-2 rounded-md transition-all duration-200 ${
                    resetPasswordMutation.isPending 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                    {resetPasswordMutation.isPending ? <RectangularLoader /> : "Reset Password"}
                  </button>
                </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
