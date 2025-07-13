"use client";
import { useMutation } from "@tanstack/react-query";
import GoogleButton from "apps/user-ui/src/shared/components/google-button";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

type FormData = {
  name: string;
  email: string;
  password: string;
};

// Rectangular Box Animation Loader Component
const RectangularLoader = () => {
  return (
    <div className="flex justify-center items-center gap-1">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="w-2 h-4 bg-white rounded-sm animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", "",""]);
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);



  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    const timerInterval = setInterval(() => {
    setTimer((prev)=>{
        if(prev<=1){
            clearInterval(timerInterval);
            setCanResend(true);
            return 0;
        }
        return prev - 1;
    })
  },1000)
}

  const signupMutation = useMutation({
    mutationFn: async(data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-registration`, data);
      return response.data;
    },
    onSuccess: (_,formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as {message: string})?.message;
      setServerError(errorMessage || "An error occurred while signing up");
    }
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async() => {
        if(!userData) return;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-user`, {
            ...userData,
            otp: otp.join(""),
        });
        return response.data;
    },
    onSuccess: () => {
        router.push("/login");
    },
    onError: (error: AxiosError) => {
        const errorMessage = (error.response?.data as {message: string})?.message;
        setServerError(errorMessage || "An error occurred while verifying OTP");
    }
  })

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if(!/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if(value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
    }
  }

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if((event.key === "Backspace" || event.key === "Delete")) {
        // Always delete the current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        
        // Move to previous input if not at the first box
        if (index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }
  }

  const resendOtp = () => {
    if(userData){
      signupMutation.mutate(userData);
    }
  }
  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Signup
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home.Signup
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white rounded-lg shadow">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Signup to SwiftKart
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Already have an account?{" "}
            <Link href={"/login"} className="text-[#3489FF]">
              Login
            </Link>
          </p>
          <GoogleButton />

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-2">or Sign up with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-2 border border-gray-300 !rounded mb-1"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && <p className="text-red-500">{String(errors.name.message)}</p>}

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
            
              <button 
                disabled={signupMutation.isPending} 
                type="submit" 
                className={`w-full mt-4 text-lg cursor-pointer p-2 rounded-md transition-all duration-200 ${
                  signupMutation.isPending 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {signupMutation.isPending ? <RectangularLoader /> : "Signup"}
              </button>

              {serverError && <p className="text-red-500">{serverError}</p>}
          </form>
          ):(
            <div>
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
                {
                    verifyOtpMutation?.isError &&
                    verifyOtpMutation.error instanceof AxiosError &&
                    <p className="text-red-500">{(verifyOtpMutation.error.response?.data as {message: string})?.message || verifyOtpMutation.error.message}</p>
                }
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Signup;
