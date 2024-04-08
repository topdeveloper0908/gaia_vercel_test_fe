"use client";
import React, { use, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Typography from "@mui/material/Typography";
import OutlinedInput from '@mui/material/OutlinedInput';

export default function AddCustomer({addCustomer}) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const token = Cookies.get("token");
  const [countries, setCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAPI, setSelectedAPI] = React.useState([]);

  const apiListhandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAPI(value)
  };

  const apiList = [
    'Heart Cloud',
    'Biowell API',
    'Apple Health'
  ];

  useEffect(() => {
      axios
        .get("https://trial.mobiscroll.com/content/countries.json")
        .then((res) => {
          const data = res.data;
          data.push({ value: "CA", text: "Canada", group: "C" });
          data.sort((a, b) => a.text.localeCompare(b.text));
          setCountries(data);
        });
  }, []);

  // yup
  const validationSchema = Yup.object().shape({
    firstname: Yup.string(),
    lastname: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),
    sex: Yup.string(),
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipcode: Yup.string(),
    country: Yup.string(),
    password: Yup.string(),
    passwordConfirm: Yup.string(),
    h_key: Yup.string(),
    h_email: Yup.string(),
    h_id: Yup.string(),
    h_password: Yup.string(),
    h_code: Yup.string(),
    apis: Yup.array(),
    b_username: Yup.string(),
    b_password: Yup.string(),
  });

  // formik
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    sex: "Male",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "US",
    password: "",
    passwordConfirm: "",
    h_id: "",
    h_email: "",
    h_password: "",
    h_key: "",
    h_code: "",
    b_username: "",
    b_password: "",
    apis: []
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log(values);
    if(!selectedAPI.includes('Heart Cloud')) {
      values.h_email = '';
      values.h_id = '';
      values.h_key = '';
      values.h_password = '';
    }
    if(!selectedAPI.includes('Biowell API')) {
      values.b_email = '';
      values.b_password = '';
    }
    if(values.password !== values.passwordConfirm) {
      toast.error("Password should be matched", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSubmitting(false);
      return;
    }
    const response = await axios.post(
      `${API_URL}customer_new`,
      JSON.stringify({...values, apis: selectedAPI.join(',')}),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`
        },
      }
    );

    const result = response.data;
      if (result == "duplicated") {
        toast.error("Customer already exists!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      else {
        toast.success("Customer registered successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        addCustomer({...values, apis: selectedAPI.join(','), id: response.data});
      } 
      setIsSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });


  return (
    <Grid
      container
      spacing={4}
      justifyContent={"center"}
      component={"form"}
      onSubmit={formik.handleSubmit}
    >
      <Grid item md={6} gap={4} display={"flex"} flexDirection={"column"}>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="firstname"
            label="First Name"
            name="firstname"
            autoComplete="firstname"
            autoFocus
            type="text"
            onChange={formik.handleChange}
            value={formik.values.firstname}
            required
          />
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="lastname"
            label="Last Name"
            name="lastname"
            autoComplete="lastname"
            autoFocus
            type="text"
            onChange={formik.handleChange}
            value={formik.values.lastname}
            required
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            type="email"
            required
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            autoComplete="phone"
            autoFocus
            type="text"
            required
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            autoFocus
            type="password"
            required
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="passwordConfirm"
            label="Confirm Password"
            name="passwordConfirm"
            autoComplete="passwordConfirm"
            autoFocus
            type="password"
            required
            onChange={formik.handleChange}
            value={formik.values.passwordConfirm}
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sex</InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Sex"
              name="sex"
              onChange={formik.handleChange}
              value={formik.values.sex}
            >
              <MenuItem value="Male" selected>
                Male
              </MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Grid>
      <Grid item md={6} gap={4} display={"flex"} flexDirection={"column"}>
        <Stack>
          <TextField
            size="small"
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            autoFocus
            type="text"
            onChange={formik.handleChange}
            value={formik.values.address}
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <TextField
            size="small"
            fullWidth
            id="city"
            label="City"
            name="city"
            autoComplete="city"
            autoFocus
            type="text"
            onChange={formik.handleChange}
            value={formik.values.city}
          />
          <TextField
            size="small"
            fullWidth
            id="state"
            label="State"
            name="state"
            autoComplete="state"
            autoFocus
            type="text"
            onChange={formik.handleChange}
            value={formik.values.state}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            fullWidth
            id="zipcode"
            label="Zipcode"
            name="zipcode"
            autoComplete="zipcode"
            autoFocus
            type="text"
            onChange={formik.handleChange}
            value={formik.values.zipcode}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              size="small"
              fullWidth
              id="country"
              label="Country"
              name="country"
              autoComplete="country"
              placeholder="Select Country"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.country}
            >
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.value}>
                  {country.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <FormControl fullWidth>
            <InputLabel size="small" id="demo-multiple-checkbox-label">API List</InputLabel>
            <Select
              fullWidth
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              size="small"
              value={selectedAPI}
              onChange={apiListhandleChange}
              input={<OutlinedInput label="API List" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {apiList.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={selectedAPI.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Grid>
      {
        selectedAPI.includes('Heart Cloud') && (
          <>
            <Typography
              sx={{ fontWeight: "bold", color: "black", width: "100%", mt: "3rem" }}
              variant={"h5"}
              align="center"
            >
              Add Heart Cloud Information
            </Typography>
            <Grid item md={6} gap={4} display={"flex"} flexDirection={"column"}>
              <Stack direction="row" spacing={2} justifyContent={"center"}>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  id="h_email"
                  label="Email"
                  name="h_email"
                  autoComplete="h_email"
                  autoFocus
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.h_email}
                  required = {selectedAPI.includes('Heart Cloud')}
                />
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  id="h_password"
                  label="Password"
                  name="h_password"
                  autoComplete="h_password"
                  autoFocus
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.h_password}
                  required = {selectedAPI.includes('Heart Cloud')}
                />
              </Stack>
            </Grid>
            <Grid item md={6} gap={4} display={"flex"} flexDirection={"column"}>
              <Stack direction="row" spacing={2} justifyContent={"center"}>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  id="h_key"
                  label="API Key"
                  name="h_key"
                  autoComplete="h_key"
                  autoFocus
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.h_key}
                  required = {selectedAPI.includes('Heart Cloud')}
                />
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  id="h_id"
                  label="Client ID"
                  name="h_id"
                  autoComplete="h_id"
                  autoFocus
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.h_id}
                  required = {selectedAPI.includes('Heart Cloud')}
                />
              </Stack>
            </Grid>
          </>
        )
      }
      {
        selectedAPI.includes('Biowell API') && (
          <>
            <Typography
              sx={{ fontWeight: "bold", color: "black", width: "100%", mt: "3rem" }}
              variant={"h5"}
              align="center"
            >
              Add Bio Well Information
            </Typography>
            <Grid item md={12} gap={4} display={"flex"} flexDirection={"column"}>
              <Stack direction="row" spacing={2} justifyContent={"center"}>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  id="b_username"
                  label="Username"
                  name="b_username"
                  autoComplete="b_username"
                  autoFocus
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.b_username}
                  required = {selectedAPI.includes('Biowell API')}
                />
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  id="b_password"
                  label="Password"
                  name="b_password"
                  autoComplete="b_password"
                  autoFocus
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.b_password}
                  required = {selectedAPI.includes('Biowell API')}
                />
              </Stack>
            </Grid>
          </>
        )
      }
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <Button
          type="submit"
          variant="contained"
          sx={{ m: 4, py: 2, px: 4 }}
          disabled={!formik.isValid || isSubmitting}
          size="large"
        >
          {isSubmitting ? "Submitting..." : "Add"}
        </Button>
      </Box>
    </Grid>
  );
}