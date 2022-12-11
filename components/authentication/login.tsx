import React, { FunctionComponent, useState } from "react";
import LoginImage from "../../images/workifylogo.svg";
import Image from "next/image";
import Google from "../../images/google.svg";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { urlFetcher } from "../../utils/Helper/urlFetcher";

type LoginType = {
  email: string;
  password: string;
};

const Login: FunctionComponent = () => {
  //Password status.
  const [passwordStatus, setPasswordStatus] = useState<boolean>(false);
  const router = useRouter();
  // Form state.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginType>();

  const loginUser = handleSubmit(async (formData: LoginType) => {
    const notification = toast.loading("Checking Credentials!");
    if (Object.keys(errors).length == 0) {
      try {
        await axios
          .post(`${urlFetcher()}/api/authentication/login`, {
            email: formData.email,
            password: formData.password,
          })
          .then((res) => {
            setValue("email", "");
            setValue("password", "");

            toast.success("Verified!", {
              id: notification,
            });

            router.push("/dashboard");
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error: any) {
        toast.error(error.message, {
          id: notification,
        });
        console.error(error?.message);
      }
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
      <div className="w-4/5 h-fit py-5 lg:w-2/3 lg:h-4/5 lg:py-0 bg-white shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg absolute border">
        <div className=" hidden lg:flex lg:flex-col mt-3">
          <Link href="/">
            <div className="text-lg text-[#6C63FF] pl-10 pt-2 font-bold cursor-pointer">
              workify
            </div>
          </Link>
          <div className="w-full h-full p-5 flex justify-center items-center ">
            <Image src={LoginImage} alt="LoginImge" />
          </div>
        </div>
        <div className="flex flex-col justify-center mx-5 my-2 xl:mx-7 xl:my-6 2xl:mx-7 2xl:my-10">
          <Link href="/">
            <div className="block lg:hidden text-lg text-[#6C63FF] font-bold">
              workify
            </div>
          </Link>
          <div className="w-full text-center text-xl  lg:text-2xl font-bold text-[#6C63FF]">
            Welcome Back!
          </div>
          <div className="w-full text-lg text-gray-900 mt-5 font-bold text-center">
            Sign in to your account.
          </div>
          <div className="mt-10">
            <form className="flex flex-col space-y-5" onSubmit={loginUser}>
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
              <div className="flex bg-gray-100 p-2 rounded space-x-3 items-center">
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
                      pattern: /^[a-z0-9._]{3,}@[a-z]{3,}[.]{1}[a-z.]{2,}$/gm,
                    })}
                    className="bg-transparent w-full focus:outline-none font-bold"
                    placeholder="Email Address"
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
              <div className="flex bg-gray-100 p-2 rounded space-x-3 items-center">
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
              <div className="flex justify-between items-center mt-3">
                <div className="text-md text-gray-500 cursor-pointer font-medium">
                  Forgot password?
                </div>
              </div>
              <button
                type="submit"
                className="py-2 px-5 rounded-lg bg-[#6C63FF] text-white font-bold cursor-pointer"
              >
                Login
              </button>
            </form>
            <div className="flex flex-col space-y-4 mt-4">
              <div className="text-center text-md text-gray-500">
                <span>Or continue with</span>
              </div>
              <div className="w-7 h-7 block mx-auto cursor-pointer">
                <a href="/api/google">
                  <Image src={Google} alt="google" />
                </a>
              </div>
            </div>
            <div className="text-md text-gray-500 cursor-pointer font-medium mt-2 text-center flex justify-start space-x-1">
              <span>Don't have an account?</span>{" "}
              <Link href="/signup">
                <span className="font-bold text-black underline">Register</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
