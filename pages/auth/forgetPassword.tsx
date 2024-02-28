import InputFieldCommon from "@/ui/CommonInput/CommonInput";
import CustomButtonPrimary from "@/ui/CustomButtons/CustomButtonPrimary";
import { Avatar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import dynamic from "next/dynamic";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";

const Wrapper = dynamic(() => import("@/layout/wrapper/Wrapper"));

const ForgetPassword = () => {
  return (
    <Wrapper>
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Box width="50%" margin="auto">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main", margin: "auto" }}>
            <LockOutlinedIcon />
          </Avatar>
          <InputFieldCommon
            required
            type="text"
            label="Email"
            sx={{
              my: 1
            }}
          />
          <CustomButtonPrimary
            type="button"
            variant="contained"
            color="primary"
            sx={{
              margin: "auto"
            }}
          >
            <Typography>Send Password</Typography>
          </CustomButtonPrimary>
        </Box>
      </Container>
    </Wrapper>
  );
};

export default ForgetPassword;
