import InputFieldCommon from "@/ui/CommonInput/CommonInput";
import CustomButtonPrimary from "@/ui/CustomButtons/CustomButtonPrimary";
import { Avatar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import dynamic from "next/dynamic";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import * as yup from "yup";
import validationText from "@/json/messages/validationText";
import { emailRegex } from "@/lib/regex";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useMutation } from "@tanstack/react-query";
import { loginMutation } from "@/api/functions/user.api";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { setAccessToken, setLoginData } from "@/reduxtoolkit/slices/userSlice";
import { useEffect } from "react";

const Wrapper = dynamic(() => import("@/layout/wrapper/Wrapper"));

const signinSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .required(validationText.error.enter_email)
      .matches(emailRegex, validationText.error.email_format),
    password: yup.string().required(validationText.error.enter_password)
  })
  .required();

export type SigninSchemaType = yup.InferType<typeof signinSchema>;

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.userSlice);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signinSchema)
  });

  const { mutate, data, error } = useMutation({
    mutationFn: loginMutation
  });

  const handleLogin = (data: SigninSchemaType) => {
    mutate(
      { ...data },
      {
        onSuccess: (res) => {
          if (res.data.status === 200) {
            if (res?.data) {
              const { ...userData } = res.data;
              toast.success(res?.data?.message);
              setCookie("token", userData.token);
              setCookie("userdata", JSON.stringify(userData));
              dispatch(setAccessToken(userData.token));
              dispatch(setLoginData(userData));
              
            }
          }
        }
      }
    );
  };

  if (data?.status === 400) {
    toast.error(data.data.message);
  }

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <Wrapper>
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Box width="50%" margin="auto">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main", margin: "auto" }}>
            <LockOutlinedIcon />
          </Avatar>
          <form onSubmit={handleSubmit(handleLogin)}>
          <InputFieldCommon
            required
            type="text"
            label="Email"
            sx={{
              my: 1
            }}
            {...register('email')}
          />
          <InputFieldCommon
            required
            type="password"
            label="Password"
            sx={{
              my: 1
            }}
            {...register('password')}
          />
          <CustomButtonPrimary
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              margin: "auto"
            }}
          >
            <Typography>Login</Typography>
          </CustomButtonPrimary>
          </form>
          <Typography sx={{ textAlign: "center", my: 1 }}>
            <Link href={"/auth/register"}>
              Don't have any account? Click here to Signup
            </Link>
          </Typography>
          <Typography sx={{ textAlign: "center", my: 1 }}>
            <Link href={"/auth/forgetPassword"}>
              Forget Password? Click Here
            </Link>
          </Typography>
        </Box>
      </Container>
    </Wrapper>
  );
};

export default Login;
