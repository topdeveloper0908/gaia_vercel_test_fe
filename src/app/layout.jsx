"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    primary: {
      light: "#8bc34a",
      main: "#67bc46",
      dark: "#558b2f",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff4081",
      main: "#DD3444",
      dark: "#DD3444",
      contrastText: "#fff",
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontFamily: "Open Sans",
  },
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <html lang="en">
          <head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="true"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
              rel="stylesheet"
            />
          </head>
          <body className={inter.className}>
            <ToastContainer />
            {children}
          </body>
        </html>
      </CssBaseline>
    </ThemeProvider>
  );
}
