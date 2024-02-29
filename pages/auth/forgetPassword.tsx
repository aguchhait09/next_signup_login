import InputFieldCommon from "@/ui/CommonInput/CommonInput";
import CustomButtonPrimary from "@/ui/CustomButtons/CustomButtonPrimary";
import { Avatar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import dynamic from "next/dynamic";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as yup from "yup";
import validationText from "@/json/messages/validationText";
import { emailRegex } from "@/lib/regex";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgetPassword, otpVerifyFunc, passwordReset } from "@/api/functions/user.api";
import { toast } from "sonner";
import { useState } from "react";
import { ResetSchema } from "./resetPassword";

const Wrapper = dynamic(() => import("@/layout/wrapper/Wrapper"));

export const forgetPasswordSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .trim()
      .email(validationText.error.email_format)
      .required(validationText.error.enter_email)
      .matches(emailRegex, validationText.error.email_format)
  })
  .required();

export type ForgetPasswordSchemaType = yup.InferType<
  typeof forgetPasswordSchema
>;

export const OtpScheme = yup
  .object()
  .shape({
    email: yup
      .string()
      .trim()
      .email(validationText.error.email_format)
      .required(validationText.error.enter_email)
      .matches(emailRegex, validationText.error.email_format),
    otp: yup
      .string()
  })
  .required();

export type OtpSchemeType = yup.InferType<
  typeof OtpScheme
>;
const ForgetPassword = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
    mode: "all",
    defaultValues: {
      email: ""
    }
  });

  const { mutate } = useMutation({
    mutationFn: forgetPassword
  });

  const [isGetOTP, setIsGetOTP] = useState(false);
  const [mail, setMail] = useState("")
  const handleForgetPassword = (data: typeof forgetPasswordSchema) => {
    console.log("forget", data);

    mutate(
      { ...data },
      {
        onSuccess: (response) => {
          if (response?.data?.status === 200) {
            toast.success(response?.data?.message);
            // router.push("/auth/login");
            setIsGetOTP(true);
            setMail(response?.data?.data?.email as string)
          }
        }
      }
    );
  };

  const [verifyOtp, setVerifyOtp] = useState(false)
  const {register: OtpRegister, handleSubmit: OtpVerifier} = useForm({
    resolver: yupResolver(OtpScheme),
    mode: "all",
    defaultValues: {
      email: "",
      otp: ""
    },
  })

  const {mutate: OtpMutate} = useMutation({
    mutationFn: otpVerifyFunc
  })

  const handleOtp = (data: typeof OtpScheme) => {
    OtpMutate(
      {...data},
      {
        onSuccess: (response) => {
          if(response?.data?.status === 200){
            toast.success(response?.data?.message)
            setVerifyOtp(true)
          }
        }
      }
    )
  }

  const { register: resetRegister, handleSubmit: ResetSubmit } = useForm({
    resolver: yupResolver(ResetSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      confirm_password: ""
    }
  });

  const { mutate: passReset } = useMutation({
    mutationFn: passwordReset
  });

  const handlePasswordReset = (data: typeof ResetSchema) => {
    console.log("reset", data);

    passReset(
      { ...data },
      {
        onSuccess: (response) => {
          if (response?.data?.status === 200) {
            toast.success(response?.data?.message);
            router.push("/auth/login");
          }
        }
      }
    );
  };

  return (
    <Wrapper>
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Box width="50%" margin="auto">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main", margin: "auto" }}>
            <LockOutlinedIcon />
          </Avatar>
          {!isGetOTP ? (
            <>
              <form onSubmit={handleSubmit(handleForgetPassword)}>
                <InputFieldCommon
                  required
                  type="text"
                  label="Email"
                  sx={{
                    my: 1
                  }}
                  {...register("email")}
                />
                <CustomButtonPrimary
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    margin: "auto"
                  }}
                >
                  <Typography>Send OTP</Typography>
                </CustomButtonPrimary>
              </form>
            </>
          ) : (
            !verifyOtp ? (
              <>
                <form onSubmit={OtpVerifier(handleOtp)}>
                  <InputFieldCommon
                    required
                    type="text"
                    value={mail}
                    aria-readonly
                    sx={{
                      my: 1
                    }}
                    {...OtpRegister("email")}
                  />
                  <InputFieldCommon
                    required
                    type="text"
                    label="OTP"
                    sx={{
                      my: 1
                    }}
                    {...OtpRegister("otp")}
                  />
                  <CustomButtonPrimary
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      margin: "auto"
                    }}
                  >
                    <Typography>Verify OTP</Typography>
                  </CustomButtonPrimary>
                </form>
              </>
            ) : (
              <>
                <form onSubmit={ResetSubmit(handlePasswordReset)}>
                  <InputFieldCommon
                    required
                    type="text"
                    value={mail}
                    aria-readonly
                    sx={{
                      my: 1
                    }}
                    {...resetRegister("email")}
                  />
                  <InputFieldCommon
                    required
                    type="password"
                    label="Password"
                    sx={{
                      my: 1
                    }}
                    {...resetRegister("password")}
                  />
                  <InputFieldCommon
                    required
                    type="password"
                    label="Confirm Password"
                    sx={{
                      my: 1
                    }}
                    {...resetRegister("confirm_password")}
                  />
                  <CustomButtonPrimary
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      margin: "auto"
                    }}
                  >
                    <Typography>Reset Password</Typography>
                  </CustomButtonPrimary>
                </form>
              </>
            )
          )}
        </Box>
      </Container>
    </Wrapper>
  );
};

export default ForgetPassword;
