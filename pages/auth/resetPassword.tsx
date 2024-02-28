import InputFieldCommon from "@/ui/CommonInput/CommonInput";
import CustomButtonPrimary from "@/ui/CustomButtons/CustomButtonPrimary";
import { Avatar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import dynamic from "next/dynamic";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import validationText from "@/json/messages/validationText";
import * as yup from "yup";
import { emailRegex } from "@/lib/regex";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { passwordReset } from "@/api/functions/user.api";

const Wrapper = dynamic(() => import("@/layout/wrapper/Wrapper"));

export const ResetSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .trim()
      .email(validationText.error.email_format)
      .required(validationText.error.enter_email)
      .matches(emailRegex, validationText.error.email_format),
    password: yup.string().trim().required(validationText.error.enter_password),
    confirm_password: yup.string().trim().required(validationText.error.enter_password)
  })
  .required();

export type ResetSchemaType = yup.InferType<typeof ResetSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(ResetSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      confirm_password: ""  
    }
  });

  const { mutate } = useMutation({
    mutationFn: passwordReset
  });

  const handlePasswordReset = (data: typeof ResetSchema) => {
    console.log("reset", data);

    mutate(
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
          <form onSubmit={handleSubmit(handlePasswordReset)}>
            <InputFieldCommon
              required
              type="text"
              label="Email"
              sx={{
                my: 1
              }}
              {...register("email")}
            />
            <InputFieldCommon
              required
              type="password"
              label="Password"
              sx={{
                my: 1
              }}
              {...register("password")}
            />
            <InputFieldCommon
              required
              type="password"
              label="Confirm Password"
              sx={{
                my: 1
              }}
              {...register("confirm_password")}
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
        </Box>
      </Container>
    </Wrapper>
  );
};

export default ResetPassword;
