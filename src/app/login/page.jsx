"use client";
import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import Cookies from "js-cookie";

export default function SignIn() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [isAdmin, setAdmin] = useState(false);
  const [step, setStep] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (isAdmin == true) {
      var formData = {
        email: data.get("email"),
        password: data.get("password"),
      };
      try {
        const response = await axios.post(`${API_URL}login`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle success response
        Cookies.set("token", `${response.data.token}`, { expires: 7 });
        router.push("/admin");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Invalid Credentials
          toast.error("Invalid Credentials!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Login Failed
          console.log(error);
          toast.error("Login Failed!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    } else {
      var formData = {
        email: data.get("email"),
      };
      try {
        const response = await axios.post(
          `${API_URL}login_practitioner`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Handle success response
        Cookies.set("token", `${response.data.token}`, { expires: 7 });
        toast.success("Check your email for login info!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Invalid Credentials
          toast.error("Invalid Credentials!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Login Failed
          toast.error("Login Failed!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    }
  };

  // useEffect(()=>{
  //   const response = axios.post(
  //     `http://15.197.225.88/epc/rpc.php`,
  //       {
  //         "id": 1,
  //         "jsonrpc": "2.0",
  //         "method": "user_getInfo",
  //         "params": {
  //             "environment": {
  //                 "cpu": "arm64",
  //                 "ostype": "mac",
  //                 "osversion": "12.4"
  //             },
  //             "lang": "en",
  //             "logindata": "AwI+eWupNI3G+uttWIhEp+yFxwty6y3AieSlbxHfTajjjZ9RfeEsyYG7+zYdhw+n8Z/VQH63L5c=",
  //             "softversion": "6.0.6.26"
  //         }
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   console.log('response', response);
  // }, []);
  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img width="100" src="../img/logo.png" />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
            />
            {isAdmin == true ? (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            ) : (
              <></>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  onChange={() => {
                    setAdmin(!isAdmin);
                  }}
                  color="primary"
                />
              }
              label="Administrator"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
