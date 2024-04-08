"use client";

import { API_URL } from "@/constants/constants";
import { useFormik } from "formik";
import { use, useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const apiList = [
  'Heart Cloud',
  'Biowell API',
  'Apple Health'
];

const {
  Modal,
  Box,
  Divider,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} = require("@mui/material");

export default function EditCustomerModal({
  open,
  handleConfirm,
  handleClose,
  isSubmitting,
  user
}) {
  const [countries, setCountries] = useState([]);
  const [selectedAPI, setSelectedAPI] = useState([]);

  const apiListhandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAPI(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

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

  const formik = useFormik({
    initialValues: {...user, password: ''},
    onSubmit: (values) => {
      if(!selectedAPI.includes('Heart Cloud')) {
        values.h_email = '';
        values.h_id = '';
        values.h_key = '';
        values.h_password = '';
        values.h_token = '';
      }
      if(!selectedAPI.includes('Biowell API')) {
        values.b_username = '';
        values.b_password = '';
      }
      handleConfirm({...values, id: user.id, apis: selectedAPI.join(',')});
    },
  });

  useEffect(() => {
    formik.setValues({...user, password: ''});
    if (user?.country?.length > 2) {
      formik.setFieldValue(
        "country",
        countries.find((c) => c.text === user.country).value
      );
    }
    if(user.apis) {
      setSelectedAPI(user.apis.split(','));
    }
  }, [user]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        color: "black",
        py: 10,
        overflow: "scroll",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, 0)",
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: 24,
          width: 500,
        }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <h3
          id="parent-modal-title"
          style={{
            padding: "20px",
          }}
        >
          Edit Customer
        </h3>
        <Divider component={"div"} />
        <Box
          px={4}
          py={3}
          sx={{
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
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
          
          <Stack spacing={2} direction="row">
            <TextField
              size="small"            
              id="password"
              label="Password"
              name="password"
              autoComplete="password"
              autoFocus
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <FormControl sx={{width: '50%'}}>
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
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.address}
            />
            <TextField
              size="small"
              id="city"
              label="City"
              name="city"
              autoComplete="city"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.city}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              id="zipcode"
              label="Zipcode"
              name="zipcode"
              autoComplete="zipcode"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.zipcode}
            />
            <TextField
              size="small"
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
            <FormControl
              sx={{
                width: "48%",
              }}
            >
              <InputLabel id="demo-simple-select-label">Country</InputLabel>
              <Select
                size="small"
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
            <TextField
              size="small"
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              id="phone"
              label="Phone"
              name="phone"
              autoComplete="phone"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.phone}
              required
            />
            <FormControl sx={{width: '50%'}}>
              <InputLabel size="small" id="demo-multiple-checkbox-label">API List</InputLabel>
              <Select
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
          {
            selectedAPI.includes('Heart Cloud') && (
              <>
                <Typography
                  sx={{ color: "black", width: "100%" }}
                  variant={"h6"}
                  align="center"
                >
                  Heart Cloud Information
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
                  sx={{ color: "black", width: "100%" }}
                  variant={"h6"}
                  align="center"
                >
                  Bio Well Information
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
        </Box>
        <Divider component={"div"}/>
        <Stack
          direction="row"
          spacing={1}
          alignItems={"center"}
          justifyContent={"flex-end"}
          p={2}
        >
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!formik.isValid || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
