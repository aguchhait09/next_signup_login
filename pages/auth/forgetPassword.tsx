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
import { forgetPassword } from "@/api/functions/user.api";
import { toast } from "sonner";

const Wrapper = dynamic(() => import("@/layout/wrapper/Wrapper"));

export const forgetPasswordSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .trim()
      .email(validationText.error.email_format)
      .required(validationText.error.enter_email)
      .matches(emailRegex, validationText.error.email_format),
  })
  .required();

export type ForgetPasswordSchemaType = yup.InferType<typeof forgetPasswordSchema>;

const ForgetPassword = () => {

  const router = useRouter();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
    mode: "all",
    defaultValues: {
      email: "", 
    }
  });

  const { mutate } = useMutation({
    mutationFn: forgetPassword
  });

  const handleForgetPassword = (data: typeof forgetPasswordSchema) => {
    console.log("forget", data);

    mutate(
      { ...data },
      {
        onSuccess: (response) => {
          if (response?.data?.status === 200) {
            toast.success(response?.data?.message);
            // router.push("/auth/login");
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
        </Box>
      </Container>
    </Wrapper>
  );
};

export default ForgetPassword;
