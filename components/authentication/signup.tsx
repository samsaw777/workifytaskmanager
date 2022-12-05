import React, { useState, FunctionComponent } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";

type SignType = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const Signup: FunctionComponent = () => {
  const [passwordStatus, setPasswordStatus] = useState<boolean>(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  // Form state.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<SignType>();

  const signUpUser = handleSubmit(async (formData: SignType) => {
    if (
      Object.keys(errors).length == 0 &&
      formData.password == formData.confirmPassword
    ) {
      console.log("User Creating");
      const notification = toast.loading("Creating User");
      setError("");
      try {
        await axios
          .post(`${urlFetcher()}/api/authentication/signup`, {
            email: formData.email,
            username: formData.username,
            password: formData.password,
          })
          .then((res) => {
            console.log(res.data);
            setValue("email", "");
            setValue("username", "");
            setValue("password", "");

            toast.success("User created", {
              id: notification,
            });
            router.push("/dashboard");
          })
          .catch((error: any) => {
            toast.error(error.message, {
              id: notification,
            });
          });
      } catch (error: any) {
        toast.error(error.message, {
          id: notification,
        });
        console.error(error);
      }
    } else if (formData.confirmPassword != formData.password) {
      setError("Passoword Didn't matched!");
    }
  });

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden relative">
      <svg
        viewBox="0 0 120 200"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <path
          fill="#6C63FF"
          d="M30.4,-42.9C44.5,-38.2,64.4,-38.4,67.6,-31C70.7,-23.6,57.1,-8.7,54.2,7.4C51.3,23.5,59.2,40.8,53.8,46.1C48.4,51.4,29.8,44.6,14.3,49.4C-1.1,54.2,-13.3,70.6,-21,69.3C-28.6,68,-31.6,49,-37,35.9C-42.3,22.8,-50,15.5,-57.3,4.5C-64.6,-6.4,-71.6,-21.2,-68.2,-32.2C-64.8,-43.2,-51,-50.6,-37.9,-55.7C-24.8,-60.8,-12.4,-63.8,-2.1,-60.5C8.2,-57.2,16.3,-47.6,30.4,-42.9Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="w-4/5 h-fit py-5 lg:w-[70%] lg:h-[85%] lg:py-0 bg-white shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg absolute border">
        <div className="hidden lg:flex lg:flex-col mt-3">
          <Link href="/">
            <div className="text-lg text-[#6C63FF] pl-10 pt-10 font-bold cursor-pointer">
              workify
            </div>
          </Link>
          {/* <div className="w-full h-full p-5 flex justify-center items-center">
            <Image src={LoginImage} />
          </div> */}
        </div>
        <div className="flex flex-col justify-center px-5 lg:px-8">
          <Link href="/">
            <div className="block lg:hidden text-lg text-[#6C63FF] font-bold cursor-pointer">
              workify
            </div>
          </Link>
          <div className="w-full text-center text-2xl font-bold text-[#6C63FF]">
            Welcome Aboard!
          </div>
          {/* <div className="w-full text-md text-gray-900 mt-5 flex">
            <span className="font-bold mr-1">Register</span> yourself, to get
            access to track and manage your task in your ongoing projects.
          </div> */}
          <div className="mt-5">
            <form
              className="flex flex-col justify-between h-full"
              onSubmit={signUpUser}
            >
              <div className="flex flex-col space-y-5">
                {errors?.email && errors?.email?.type === "required" && (
                  <div className="w-full text-red-400 font-bold">
                    Email Required!
                  </div>
                )}
                {errors?.email && errors?.email?.type === "pattern" && (
                  <div className="w-full text-red-400 font-bold">
                    Invalid Email!
                  </div>
                )}
                <div className="flex bg-gray-100 p-2 py-3 rounded space-x-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div className="flex flex-col w-full">
                    <input
                      {...register("email", {
                        required: true,
                        pattern: /[a-z0-9._]{3,}@[a-z]{3,}[.]{1}[a-z.]{2,}/gm,
                      })}
                      className="bg-transparent w-full focus:outline-none font-bold"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                {errors?.username && errors?.username?.type === "required" && (
                  <div className="w-full text-red-400 font-bold">
                    Username Required!
                  </div>
                )}
                {errors?.username && errors?.username?.type === "pattern" && (
                  <div className="w-full text-red-400 font-bold">
                    Invalid Username!
                  </div>
                )}
                <div className="flex bg-gray-100 p-2 py-3 rounded space-x-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col w-full">
                    <input
                      {...register("username", {
                        required: true,
                        pattern:
                          /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/gm,
                      })}
                      className="bg-transparent w-full focus:outline-none font-bold"
                      placeholder="Username"
                    />
                  </div>
                </div>
                {errors?.password && errors?.password?.type === "required" && (
                  <div className="w-full text-red-400 font-bold">
                    Password Required!
                  </div>
                )}
                {errors?.password && errors?.password?.type === "pattern" && (
                  <div className="w-full text-red-400 font-bold">
                    Invalid Password!
                  </div>
                )}
                <div className="flex bg-gray-100 p-2 py-3 rounded space-x-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col w-full">
                    <input
                      {...register("password", {
                        required: true,
                        pattern:
                          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm,
                      })}
                      type={passwordStatus ? "text" : "password"}
                      className="bg-transparent w-full focus:outline-none font-bold"
                      placeholder="Password"
                    />
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 cursor-pointer"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => setPasswordStatus(!passwordStatus)}
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {errors?.confirmPassword &&
                  errors?.confirmPassword?.type === "required" && (
                    <div className="w-full text-red-400 font-bold">
                      Password Required!
                    </div>
                  )}
                {error && (
                  <div className="w-full text-red-400 font-bold">{error}</div>
                )}
                <div className="flex bg-gray-100 p-2 py-3 rounded space-x-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col w-full">
                    <input
                      {...register("confirmPassword", {
                        required: true,
                      })}
                      type={confirmPasswordStatus ? "text" : "password"}
                      className="bg-transparent w-full focus:outline-none font-bold"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 cursor-pointer"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => setConfirmPasswordStatus(!passwordStatus)}
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col mt-3">
                <button
                  className="w-full py-2 px-5 rounded-lg bg-[#6C63FF] text-white font-bold"
                  type="submit"
                >
                  Create Account
                </button>
                <div className="text-md text-gray-500 cursor-pointer flex space-x-1 mt-2 justify-center">
                  <span>Already have a account?</span>{" "}
                  <Link href="/login">
                    <span className="font-medium underline text-black">
                      Log in
                    </span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
