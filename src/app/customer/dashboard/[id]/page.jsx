"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button  
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import { Avatar } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { FaStar } from "react-icons/fa6";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from 'dayjs';

import { House } from "@mui/icons-material";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

import Loading from "@/components/Loading";
import RecommendationTable from "@/components/customer/RecommendationTable";
import RecommendData from "@/Json/data.json"


const drawerWidth = 300;
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: '300px',
    }),
  })
);

export default function Profile({ params }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const theme = useTheme();
  const token = Cookies.get("token");
  const [modalDateIsOpen, setModalDateIsOpen] = useState(false)
  const [clickedInput, setClickedInput] = useState(null);
  const [excelData, setExcelData] = React.useState([]);
  const [date, setDate] = React.useState(dayjs());
  const [data, setData] = React.useState([]);
  const [currentData, setCurrentData] = React.useState();
  const [rangeType, setRangeType] = React.useState('day');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(true);
  const [page, setPage] = React.useState("profile");
  const [countries, setCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [heart_startDate, setHeartStartDate] = React.useState(dayjs());
  const [heart_endDate, setHeartEndDate] = React.useState(dayjs());
  const [heartRangeType, setHeartRangeType] = React.useState('day');
  const [heartData, setHeartData] = React.useState([]);

  
  
  const seriesA = {
    data: [50, 40, 30, 20, 10, 50, 40, 30, 20, 10], // Updated data values for seriesA
    label: 'High',
    color: '#5abf1f'
  };
  const seriesB = {
    data: [30, 20, 40, 10, 50, 30, 20, 40, 10, 5], // Updated data values for seriesB
    label: 'Medium',
    color: '#307ae0'
  };
  const seriesC = {
    data: [20, 30, 10, 40, 30, 20, 30, 10, 40, 50],
    label: 'Low',
    color: '#e5454d'
  };

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
    h_email: Yup.string() || null,
    h_password: Yup.string() || null,
    h_id: Yup.string() || null,
    h_key: Yup.string() || null
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
    h_email: "",
    h_password: "",
    h_id: "",
    h_key: ""
  };

  const handleSubmit = async (values) => {
    if(values.password !== values.passwordConfirm) {
      toast.error("Password should be matched", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    } else {
      setIsSubmitting(true);
      await axios
        .post(`${API_URL}customer/update`, values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
          },
        })
        .then((res) => {
          toast.success(
            `Customer updated successfully`
          );
          setCustomer(values);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update user");
        });
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    fetchData();
    axios
      .get("https://trial.mobiscroll.com/content/countries.json")
      .then((res) => {
        const data = res.data;
        data.push({ value: "CA", text: "Canada", group: "C" });
        data.sort((a, b) => a.text.localeCompare(b.text));
        setCountries(data);
      });
  }, []);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const convertDate = (currentSeconds) => {
    const date = new Date(currentSeconds * 1000); // Convert timestamp to milliseconds
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedDate = monthNames[date.getMonth()] + ' ' + ('0' + date.getDate()).slice(-2);

    return formattedDate;
  }

  
  // Bio - Well API
  
  const handleDatePicker = (e) => {
    setClickedInput(e.target.id)
    setModalDateIsOpen(true)
  }

  const dateRangeChange = (event) => {
    setRangeType(event.target.value);
  };
  // File Input
  const handleFileChange = async (event) => {
    const uploadedFiles = event.target.files;
    let averageData = [];

    const processFile = (file) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const rows = fileContent.split('\n');
        if(customer.sex == 'Male') {
          if(rows.length !== 1485) {
            toast.error("Uploaded File is not correct");
            return;
          }
        }
        else if(rows.length !== 1484) {
          toast.error("Uploaded File is not correct");
          return;
        }
        RecommendData.forEach(element => {
          if(customer.sex == 'Male' && element.index > 127) {
            averageData.push(rows[element.index + 2]);
          } else {
            averageData.push(rows[element.index + 1]);
          }
        });
        const formData = {
          customer_id: params.id,
          data: averageData.join(','),
          date: date.format('YYYY-MM-DD')
        };
        try {
          const response = await axios.post(`${API_URL}customer/data/save`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
          },
        });
          var tmp = data;
          formData.id = response.data;
          if(data.length == 0) {
            toast.success("Created successfully");
            tmp.push(formData);
          }
          else if(response.data > data[data.length-1].id) {
            toast.success("Created successfully");
            tmp.push(formData);
          } else {
            toast.success("Updated successfully");
            tmp[response.data].data = formData.data;
          }
          setData(tmp);
          setCurrentData(formData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      };

      reader.readAsText(file);
    };

    // Process each uploaded file
    for (let i = 0; i < uploadedFiles.length; i++) {
      processFile(uploadedFiles[i]);
    }
  };

  const fetchData = async () => {
    const formData = {
      id: params.id,
    };
    try {
        const response = await axios.post(`${API_URL}customer`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
          },
        });
        formik.setValues({...response.data[0][0], password: ''});
        setCustomer(response.data[0][0]);
        setData(response.data[1]);
        setHeartData(response.data[2]);
        if(response.data[1].length > 0) {
          response.data[1].forEach(element => {
            if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
              setCurrentData(element);
            }
          });
        }
        setLoading(false);
    } catch (error) {
        if (err?.response?.status === 403) {
          window.location.href = "/login";
        }
        console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    var found = false;
    data.forEach(element => {
      if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
        setCurrentData(element);
        found = true;
      }
    });
    if(found == false) {
      setCurrentData(null);
    }
  }, [date]);

  React.useEffect(() => {
    if(rangeType === 'week') {
      const endDate = dayjs();
      const startDate = endDate.subtract(7, 'day');
      var tmp1 = [];
      var tmp2 = [];
      var tmpAverage1;
      var found = 0;
      data.forEach(element => {
        tmpAverage1 = element;
        const selectedDate = dayjs(element.date);
        if(selectedDate.isBetween(startDate, endDate)) {
          element.data.split(',').forEach((subElement, subIndex) => {
            if(found == 0) {
              tmp1.push(parseFloat(subElement.split(';')[2]));
              tmp2.push(parseFloat(subElement.split(';')[3]));
            } else {
              tmp1[subIndex] += parseFloat(subElement.split(';')[2]);
              tmp2[subIndex] += parseFloat(subElement.split(';')[3]);
            }
          });
          found++;
        }
      });
      var tmpAverage2 = [];
      tmpAverage1.data.split(',').forEach((element, index) => {
        var tmp = element.split(';');
        tmp[2] = parseFloat((tmp1[index]/found).toFixed(2));
        tmp[3] = parseFloat((tmp2[index]/found).toFixed(2));
        tmpAverage2.push(tmp.join(';'));
      });
      setCurrentData({data: tmpAverage2.join(',')});
    }
    if(rangeType === 'month') {
      const endDate = dayjs();
      const startDate = endDate.subtract(30, 'day');
      var tmp1 = [];
      var tmp2 = [];
      var tmpAverage1;
      var found = 0;
      data.forEach(element => {
        tmpAverage1 = element;
        const selectedDate = dayjs(element.date);
        if(selectedDate.isBetween(startDate, endDate)) {
          element.data.split(',').forEach((subElement, subIndex) => {
            if(found == 0) {
              tmp1.push(parseFloat(subElement.split(';')[2]));
              tmp2.push(parseFloat(subElement.split(';')[3]));
            } else {
              tmp1[subIndex] += parseFloat(subElement.split(';')[2]);
              tmp2[subIndex] += parseFloat(subElement.split(';')[3]);
            }
          });
          found++;
        }
      });
      var tmpAverage2 = [];
      tmpAverage1.data.split(',').forEach((element, index) => {
        var tmp = element.split(';');
        tmp[2] = parseFloat((tmp1[index]/found).toFixed(2));
        tmp[3] = parseFloat((tmp2[index]/found).toFixed(2));
        tmpAverage2.push(tmp.join(';'));
      });
      setCurrentData({data: tmpAverage2.join(',')});
    }
    if(rangeType === 'day') {
      data.forEach(element => {
        if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
          setCurrentData(element);
          found = true;
        }
      });
      if(found == false) {
        setCurrentData(null);
      }
    }
  }, [rangeType]);

  // HeartCloud API
  const dateHeartRangeChange = (event) => {
    setHeartRangeType(event.target.value);
  }

  return (
    <Box>
      {loading == false ? (
        <Box>
            <Sidebar
                open={open}
                handleDrawerClose={handleDrawerOpen}
                theme={theme}
                customer={customer}
                page={page}
                setPage={setPage}
            />
            <Main open={open}>
         
              <Box
                sx={{
                  mt: 3,
                  px: 3,
                }}
              >
                <Container className="container">
                  {
                      page === 'profile' && (
                        <Box>
                          <Stack direction="row" justifyContent={"center"} mt={10} mb={4}>
                            <Typography
                              sx={{ fontWeight: "bold", color: "black" }}
                              variant={"h5"}
                            >
                              Edit Customer
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent={"center"} mt={6} mb={4}>
                            <Typography
                              sx={{ fontWeight: "bold", color: "black" }}
                              variant={"h5"}
                            >
                              Edit Profile
                            </Typography>
                          </Stack>
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
                            </Grid>
                            <Grid item md={12}>
                              <Stack direction="row" justifyContent={"center"} mt={3}>
                                <Typography
                                  sx={{ fontWeight: "bold", color: "black" }}
                                  variant={"h5"}
                                >
                                  Edit HeartCloud API Information
                                </Typography>
                              </Stack>
                            </Grid>
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
                                />
                              </Stack>
                            </Grid>
                            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                              <Button
                                type="submit"
                                variant="contained"
                                sx={{ m: 4, py: 2, px: 4 }}
                                disabled={isSubmitting}
                                size="large"
                              >
                                {isSubmitting ? "Submitting..." : "Update"}
                              </Button>
                            </Box>
                          </Grid>
                        </Box>
                      )
                  }
                  {
                      page === 'home' && (
                          <>
                            <Typography
                              textAlign='center'
                              sx={{ fontWeight: "bold", color: "black" }}
                              variant={"h5"}
                            >
                              Recommendation Dashboard
                            </Typography>
                            <Box mt={6} pb={4} display='flex' alignItems='center' justifyContent='space-between'>
                              <Box display='flex'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            label="Date picker"
                                            value={date}
                                            disabled={rangeType != 'day'}
                                            onChange={(newValue) => setDate(newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                                <FormControl sx={{mt: '.5rem', ml: '1rem', width: '10rem'}}>
                                  <InputLabel id="demo-simple-select-label">Select Range</InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Date Range"
                                    value={rangeType}
                                    onChange={dateRangeChange}
                                  >
                                    <MenuItem value="day" selected>
                                      One Day
                                    </MenuItem>
                                    <MenuItem value="week">Last Week</MenuItem>
                                    <MenuItem value="month">Last Month</MenuItem>
                                  </Select>
                                </FormControl>
                              </Box>
                              <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                disabled={rangeType != 'day'}
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} accept=".csv, .xlsx"/>
                              </Button>
                            </Box>
                            {
                              currentData === null ? 
                                <>
                                  <Typography
                                    align="center"
                                    variant={"h5"}
                                    mt={4}
                                  >
                                    There is no data to display
                                  </Typography>
                                </> : <RecommendationTable data={currentData?.data}/>
                            }
                          </>
                      )
                  }
                  {
                      page === 'heartCloud' && (
                          <>
                            <Typography
                              textAlign='center'
                              sx={{ fontWeight: "bold", color: "black" }}
                              variant={"h5"}
                              mt={10}
                              mb={4}
                            >
                              HeartCloud Data
                            </Typography>
                            <Typography
                              variant={"h5"}
                              mb={1}
                            >
                              Latest Sessions
                            </Typography>
                            <table className="customTable">
                              <tbody>
                                  <tr>
                                    <td>Level</td>
                                    <td style={{textAlign:'center', background: '#913ac2', color: 'white', borderColor: 'white'}}>{[...Array(Number(heartData[heartData.length-1].ChallengeLevel))].map((_, i) => (
                                        <FaStar size={14} />
                                    ))}</td>
                                    <td style={{textAlign:'center', background: '#913ac2', color: 'white', borderColor: 'white'}}>{[...Array(Number(heartData[heartData.length-2].ChallengeLevel))].map((_, i) => (
                                        <FaStar size={14} />
                                    ))}</td>
                                    <td style={{textAlign:'center', background: '#913ac2', color: 'white', borderColor: 'white'}}>{[...Array(Number(heartData[heartData.length-3].ChallengeLevel))].map((_, i) => (
                                        <FaStar size={14} />
                                    ))}</td>
                                    <td style={{textAlign:'center', background: '#913ac2', color: 'white', borderColor: 'white'}}>{[...Array(Number(heartData[heartData.length-4].ChallengeLevel))].map((_, i) => (
                                        <FaStar size={14} />
                                    ))}</td>
                                  </tr>
                                  <tr>
                                    <td>Achievement</td>
                                    <td style={{textAlign:'center', background: '#5abf1f', color: 'white', borderColor: 'white'}}>{heartData[heartData.length-1].Achievement}</td>
                                    <td style={{textAlign:'center', background: '#5abf1f', color: 'white', borderColor: 'white'}}>{heartData[heartData.length-2].Achievement}</td>
                                    <td style={{textAlign:'center', background: '#5abf1f', color: 'white', borderColor: 'white'}}>{heartData[heartData.length-3].Achievement}</td>
                                    <td style={{textAlign:'center', background: '#5abf1f', color: 'white', borderColor: 'white'}}>{heartData[heartData.length-4].Achievement}</td>
                                  </tr>
                                  <tr>
                                    <td>AvgCoherence</td>
                                    <td style={{textAlign:'center', background: '#ff8400', color: 'white', borderColor: 'white'}}>{parseFloat(heartData[heartData.length-1].AvgCoherence).toFixed(2)}</td>
                                    <td style={{textAlign:'center', background: '#ff8400', color: 'white', borderColor: 'white'}}>{parseFloat(heartData[heartData.length-2].AvgCoherence).toFixed(2)}</td>
                                    <td style={{textAlign:'center', background: '#ff8400', color: 'white', borderColor: 'white'}}>{parseFloat(heartData[heartData.length-3].AvgCoherence).toFixed(2)}</td>
                                    <td style={{textAlign:'center', background: '#ff8400', color: 'white', borderColor: 'white'}}>{parseFloat(heartData[heartData.length-4].AvgCoherence).toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                    <td>Device</td>
                                    <td style={{textAlign:'center', background: '#f4c61b', color: 'white', borderColor: 'white'}}><PhoneAndroidIcon sx={{mt: '.4rem'}} /></td>
                                    <td style={{textAlign:'center', background: '#f4c61b', color: 'white', borderColor: 'white'}}><PhoneAndroidIcon sx={{mt: '.4rem'}} /></td>
                                    <td style={{textAlign:'center', background: '#f4c61b', color: 'white', borderColor: 'white'}}><PhoneAndroidIcon sx={{mt: '.4rem'}} /></td>
                                    <td style={{textAlign:'center', background: '#f4c61b', color: 'white', borderColor: 'white'}}><PhoneAndroidIcon sx={{mt: '.4rem'}} /></td>
                                  </tr>
                                  <tr>
                                    <td>Date</td>
                                    <td style={{textAlign:'center'}}>{convertDate(parseFloat(heartData[heartData.length-1].IBIStartTime))}</td>
                                    <td style={{textAlign:'center'}}>{convertDate(parseFloat(heartData[heartData.length-2].IBIStartTime))}</td>
                                    <td style={{textAlign:'center'}}>{convertDate(parseFloat(heartData[heartData.length-3].IBIStartTime))}</td>
                                    <td style={{textAlign:'center'}}>{convertDate(parseFloat(heartData[heartData.length-4].IBIStartTime))}</td>
                                  </tr>
                              </tbody>
                            </table>
                            <Box mt={6} display='flex' alignItems='center' justifyContent='space-between'>
                              <Box display='flex'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            label="From"
                                            value={heart_startDate}
                                            disabled={heartRangeType != 'custom'}
                                            onChange={(newValue) => setHeartStartDate(newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                                <Box mx={1}></Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            label="To"
                                            value={heart_endDate}
                                            disabled={heartRangeType != 'custom'}
                                            onChange={(newValue) => setHeartEndDate(newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                              </Box>
                              <FormControl sx={{mt: '.5rem', ml: '1rem', width: '10rem'}}>
                                  <InputLabel id="demo-simple-select-label">Select Range</InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Date Range"
                                    value={heartRangeType}
                                    onChange={dateHeartRangeChange}
                                  >
                                    <MenuItem value="day" selected>Today</MenuItem>
                                    <MenuItem value="week">Last Week</MenuItem>
                                    <MenuItem value="month">Last Month</MenuItem>
                                    <MenuItem value="custom">Custom</MenuItem>
                                  </Select>
                                </FormControl>
                            </Box>
                            <Box mt={1}></Box>
                            <LineChart
                              xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                              series={[
                                {
                                  data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8]
                                },
                              ]}
                              width={1200}
                              height={300}
                            />
                          </>
                      )
                  }
                </Container>
              </Box>
            </Main>
        </Box>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
const Sidebar = ({
    open,
    theme,
    page,
    setPage,
    customer
  }) => {
    const buttons = [
        {
          name: "Profile",
          icon: House,
          onClick: () => setPage("profile"),
          active: page === "profile"
        },
        {
          name: "Recommendations",
          icon: House,
          onClick: () => setPage("home"),
          active: page === "home"
        },
        {
          name: "Heart Cloud",
          icon: House,
          onClick: () => setPage("heartCloud"),
          active: page === "heartCloud"
        }
      ] ;
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#32373d",
            color: "white",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            backgroundColor: "#24262A",
            p: 5,
            pt: 9,
          }}
        >
          {
            customer.sex == "Male" ? (
              <Avatar
                src={
                  "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34a0dbca137ef4f425e.png"
                }
                sx={{ width: 150, height: 150 }}
              />
            ) : (
              <Avatar
                src={
                  "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34ab7ea181193716085.png"
                }
                sx={{ width: 150, height: 150 }}
              />
            )
          }
          <Typography
            variant="h1"
            color="white"
            sx={{
              fontSize: "1.3em",
              fontWeight: "500",
              color: "white",
              mt: '1rem'
            }}
          >
            {customer.firstname} {customer.lastname}
          </Typography>
        </Box>
        <List
          sx={{
            p: 0,
          }}
        >
          {buttons.map((btn, index) => (
            <ListItem key={btn.name} disablePadding>
              <ListItemButton
                sx={{
                  py: 1.5,
                  ":hover": {
                    backgroundColor: "dodgerblue",
                  },
                  justifyContent: "flex-start",
                  borderBottom: "1px solid #F0F7FF16",
                  backgroundColor: btn.active ? "#237EEE" : "transparent",
                }}
                onClick={btn.onClick}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  <btn.icon />
                </ListItemIcon>
                <ListItemText primary={btn.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  };
  