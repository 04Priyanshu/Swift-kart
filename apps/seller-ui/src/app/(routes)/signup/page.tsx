"use client";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import countries from "apps/seller-ui/src/utils/countries";
import CreateShop from "apps/seller-ui/src/shared/modules/auth/create-shop";
import StripeLogo from 'apps/seller-ui/src/assets/svgs/stripe-logo';


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
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
};

const Signup = () => {
    const [activeStep, setActiveStep] = useState(3);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/seller-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setSellerData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "An error occurred while signing up");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-seller`,
        {
          ...sellerData,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.seller?.id);
      setActiveStep(2);
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "An error occurred while verifying OTP");
    },
  });

  const onSubmit = (data: any) => {
    signupMutation.mutate(data);
  };

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

  const resendOtp = () => {
    if (sellerData) {
      signupMutation.mutate(sellerData);
    }
  };


  const connectStripe = async () => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-stripe-link`,{
            sellerId
        })
        if(response.data.url){
            window.location.href = response.data.url;
        }
    } catch (error:any) {
        console.log(error.response.data.message);
    }
  }


  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
        {/* stepper */}
    <div className="relative flex items-center justify-between md:w-[50%] mb-8 ">
        <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10"/>
        {[1,2,3].map((step)=>(
            <div key={step} >
                <div className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center ${step <= activeStep ? 'bg-black ' : 'bg-gray-300'}`}>
                    {step}
                </div>
                <span className="ml-[-15px]">
                    {step === 1 ? "Create Account" : step === 2 ? "Setup Shop" : "Connect Bank"}
                </span>
            </div>
        ))}
    </div>

    {/* steps content  */}

<div className="md:w-[480px] p-8 bg-white rounded-lg shadow">
    {activeStep === 1 && (
       <>
       {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-2xl font-semibold text-center mb-4">Create Account</h3>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-2 border border-gray-300 !rounded mb-1"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500">{String(errors.name.message)}</p>
              )}

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

              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="123-456-7890"
                className="w-full p-2 border border-gray-300 !rounded mb-1"
                {...register("phone_number", {required: "Phone number is required", pattern: {
                    value: /^\+[1-9]\d{1,14}$/,
                    message: "Invalid phone number",
                },
                maxLength: {
                    value: 15,
                    message: "Phone number must be at most 15 digits",
                },
                minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits",
                },
                })}
              />

              {errors.phone_number && (
                <p className="text-red-500">{String(errors.phone_number.message)}</p>
              )}

              <label className="block text-gray-700 mb-1">Country</label>
              <select
                className="w-full p-2 border border-gray-300 !rounded mb-1"
                {...register("country", {required: "Country is required"})}
              >
                <option value="">Select your country</option>
                {countries.map((country)=>(
                    <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500">{String(errors.country.message)}</p>
              )}

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
                  <p className="text-red-500">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>

              <button
                disabled={signupMutation.isPending}
                type="submit"
                className={`w-full mt-4 text-lg cursor-pointer p-2 rounded-md transition-all duration-200 ${
                  signupMutation.isPending
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {signupMutation.isPending ? <RectangularLoader /> : "Signup"}
              </button>

              {signupMutation.isError && 
              signupMutation.error instanceof AxiosError && (
                <p className="text-red-500">
                  {(signupMutation.error.response?.data as {message: string})?.message || signupMutation.error.message}
                </p>
              )
              }

              <p className="text-center text-gray-500 text-sm mt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 text-sm ml-1 cursor-pointer">
                  Login
                </Link>
              </p>

            </form>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold text-center mb-4">
                Enter OTP
              </h3>
              <div className="flex justify-center gap-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }} //after the first input is focused, the next input should be focused
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
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? (
                  <RectangularLoader />
                ) : (
                  "Verify OTP"
                )}
              </button>
              <p className="text-center text-gray-500 text-sm mt-2">
                {canResend ? (
                  <>
                    Didn't receive OTP?
                    <button
                      type="button"
                      className="text-blue-500 text-sm ml-1 cursor-pointer"
                      onClick={resendOtp}
                    >
                      Resend OTP
                    </button>
                  </>
                ) : (
                  <>Resend OTP in {timer} seconds</>
                )}
              </p>
              {verifyOtpMutation?.isError &&
                verifyOtpMutation.error instanceof AxiosError && (
                  <p className="text-red-500">
                    {(
                      verifyOtpMutation.error.response?.data as {
                        message: string;
                      }
                    )?.message || verifyOtpMutation.error.message}
                  </p>
                )}

               
            </div>
          )}
       </>
    )}

    {activeStep === 2 && (
      <CreateShop sellerId={sellerId || ""} setActiveStep={setActiveStep}/>
    )}

    {activeStep === 3 && (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-center mb-4">
          Connect Bank
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Connect your bank account to start selling on Swiftkart.
        </p>
        <button
          onClick={connectStripe}
          className="w-full mt-4 text-lg p-2 rounded-md transition-all duration-200 bg-black text-white cursor-pointer hover:bg-gray-800 flex items-center justify-center gap-2"
        >
          Connect Stripe <StripeLogo size={24} className="text-white" />
        </button>
        
      </div>
    )}
</div>
    </div>
  );
};

export default Signup;
