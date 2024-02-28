import { IFormInput } from "@/interface/common.interface";

import { IgetSignUpQuery } from "@/interface/apiresp.interfaces";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const signUpMutation = async (body: IFormInput) => {
  const res = await axiosInstance.post<IgetSignUpQuery>(
    endpoints.auth.signup,
    body
  );
  return res;
};

export const passwordReset = async (body: IFormInput) => {
  const res = await axiosInstance.post<IgetSignUpQuery>(
    endpoints.auth.reserPassword,
    body
  );
  return res;
};

export const loginMutation = async (body: IFormInput) => {
  const res = await axiosInstance.post<IgetSignUpQuery>(
    endpoints.auth.login,
    body
  );
  return res;
};


