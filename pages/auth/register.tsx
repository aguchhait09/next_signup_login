import InputFieldCommon from "@/ui/CommonInput/CommonInput";
import CustomButtonPrimary from "@/ui/CustomButtons/CustomButtonPrimary";
import { Avatar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import dynamic from "next/dynamic";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { signUpMutation } from "@/api/functions/user.api";
import validationText from "@/json/messages/validationText";
import { emailRegex } from "@/lib/regex";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const Wrapper = dynamic(() => import("@/layout/wrapper/Wrapper"));

export const SignupSchema = yup
    .object()
    .shape({
      fullName: yup.string().required(),
      email: yup
        .string()
        .trim()
        .email(validationText.error.email_format)
        .required(validationText.error.enter_email)
        .matches(emailRegex, validationText.error.email_format),
      password: yup
        .string()
        .trim()
        .required(validationText.error.enter_password)
    })
    .required();

    export type signupSchemaType = yup.InferType<typeof SignupSchema>

const register = () => {

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(SignupSchema),
    mode: "all",
    defaultValues: {
        fullName: "",
        email: "",
        password: ""
      }
  });

  const {mutate} = useMutation({
    mutationFn: signUpMutation
  })
  
  const handleSignup = (data: typeof SignupSchema) =>{
    console.log('signup', data);
    
    mutate (
        {...data},        
        {
            onSuccess: (response)=>{
                if(response?.data?.status === 200){
                    toast.success('SignUp Successfully!')
                    
                }
            }
                
            },
    )
  }

  return (
    <Wrapper>
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Box width="50%" margin="auto">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main", margin: "auto" }}>
            <LockOutlinedIcon />
          </Avatar>
          <form onSubmit={handleSubmit(handleSignup)}>
            <InputFieldCommon
              required
              type="text"
              label="Full Name"
              sx={{
                my: 1
              }}
              {...register("fullName")}
            />
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
            <CustomButtonPrimary
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                margin: "auto"
              }}
              
            >
              <Typography>Register</Typography>
            </CustomButtonPrimary>
          </form>
        </Box>
      </Container>
    </Wrapper>
  );
};

export default register;
