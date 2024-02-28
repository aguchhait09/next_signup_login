import { userData } from "@/types/common.type";

export interface userSliceData {
  isLoggedIn: boolean;
  userData: userData | null;
  accessToken: null | string;
}

export interface registrationData {}



export interface globalStateInterface {
  counter: number;
}
