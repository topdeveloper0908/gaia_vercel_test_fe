"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import Cookies from "js-cookie";
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
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';

import { House, Logout } from "@mui/icons-material";

import Loading from "@/components/Loading";
import BioWellDashboard from "@/components/customer/biowell/Dashboard";
import RecommendData from "@/Json/data.json"

import DayResult from "@/components/customer/heartcloud/DayResult"
import CustomResult from "@/components/customer/heartcloud/CustomResult"


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

const apiList = [
    'Heart Cloud',
    'Biowell API',
    'Apple Health'
];
  
export default function Profile({ params }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const theme = useTheme();
  const token = Cookies.get("token");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bioData, setBioData] = useState(null);
  const [open, setOpen] = React.useState(true);
  const [page, setPage] = React.useState(null);
  const [countries, setCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAPI, setSelectedAPI] = React.useState([]);
  const [loadingText, setLoadingText] = React.useState('Loading...');

  const [heart_startDate, setHeartStartDate] = React.useState(null);
  const [heart_endDate, setHeartEndDate] = React.useState(null);
  const [heartRangeType, setHeartRangeType] = React.useState(null);
  const [heartData, setHeartData] = React.useState([]);

  const [bCustomers, setbCustomers] = React.useState([]);

  const apiListhandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAPI(value)
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
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          toast.success(
            `Customer updated successfully`
          );
          setCustomer(values);
        })
        .catch((err) => {
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            window.location.href = "/login";
          }
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
  
  // Bio - Well API


  // File Input
  const handleFileChange = async (event) => {
    const uploadedFiles = event.target.files;
    let averageData = [];

    const processFile = (file) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const fileName = file.name;
        const fileNameParts = fileName.split(' - '); // Split the string at ' - '
        const dateString = fileNameParts[0]; // Get the first part
        const formattedDateString = dateString.replace('_', ':'); // Replace underscore with colon
        const dateObject = new Date(formattedDateString);

        const rows = fileContent.split('\n');
        if(customer?.sex == 'Male') {
          if(rows.length !== 1485) {
            toast.error("Uploaded File is not correct");
            return;
          }
        } else if(rows.length !== 1484) {
          toast.error("Uploaded File is not correct");
          return;
        }
        RecommendData.forEach(element => {
          if(customer?.sex == 'Male' && element.index > 127) {
            averageData.push(rows[element.index + 2]);
          } else {
            averageData.push(rows[element.index + 1]);
          }
        });
        var formData = {
          customer_id: customer.id,
          data: averageData.join(','),
          date: formattedDateString
        };
        try {
          const response = await axios.post(`${API_URL}customer/bio/save`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
          formData.id = response.data;
          console.log(bioData);
          setBioData([...bioData, {...formData, date: formattedDateString}]);
        } catch (error) {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
              window.location.href = "/login";
            }
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
    setLoading(true);
    const formData = {
      id: params.id,
    };
    try {
        const response = await axios.post(`${API_URL}customer`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
        setCustomer(response.data[0]);
        setLoading(false);
    } catch (error) {
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          window.location.href = "/login";
        }
        console.error("Error fetching data:", error);
    }
  };

  // React.useEffect(() => {
  //   var found = false;
  //   data.forEach(element => {
  //     if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
  //       setCurrentData(element);
  //       found = true;
  //     }
  //   });
  //   if(found == false) {
  //     setCurrentData(null);
  //   }
  // }, [date]);

  // React.useEffect(() => {
  //   if(rangeType === 'week') {
  //     const endDate = dayjs();
  //     const startDate = endDate.subtract(7, 'day');
  //     var tmp1 = [];
  //     var tmp2 = [];
  //     var tmpAverage1;
  //     var found = 0;
  //     data.forEach(element => {
  //       tmpAverage1 = element;
  //       const selectedDate = dayjs(element.date);
  //       if(selectedDate.isBetween(startDate, endDate)) {
  //         element.data.split(',').forEach((subElement, subIndex) => {
  //           if(found == 0) {
  //             tmp1.push(parseFloat(subElement.split(';')[2]));
  //             tmp2.push(parseFloat(subElement.split(';')[3]));
  //           } else {
  //             tmp1[subIndex] += parseFloat(subElement.split(';')[2]);
  //             tmp2[subIndex] += parseFloat(subElement.split(';')[3]);
  //           }
  //         });
  //         found++;
  //       }
  //     });
  //     var tmpAverage2 = [];
  //     tmpAverage1.data.split(',').forEach((element, index) => {
  //       var tmp = element.split(';');
  //       tmp[2] = parseFloat((tmp1[index]/found).toFixed(2));
  //       tmp[3] = parseFloat((tmp2[index]/found).toFixed(2));
  //       tmpAverage2.push(tmp.join(';'));
  //     });
  //     setCurrentData({data: tmpAverage2.join(',')});
  //   }
  //   if(rangeType === 'month') {
  //     const endDate = dayjs();
  //     const startDate = endDate.subtract(30, 'day');
  //     var tmp1 = [];
  //     var tmp2 = [];
  //     var tmpAverage1;
  //     var found = 0;
  //     data.forEach(element => {
  //       tmpAverage1 = element;
  //       const selectedDate = dayjs(element.date);
  //       if(selectedDate.isBetween(startDate, endDate)) {
  //         element.data.split(',').forEach((subElement, subIndex) => {
  //           if(found == 0) {
  //             tmp1.push(parseFloat(subElement.split(';')[2]));
  //             tmp2.push(parseFloat(subElement.split(';')[3]));
  //           } else {
  //             tmp1[subIndex] += parseFloat(subElement.split(';')[2]);
  //             tmp2[subIndex] += parseFloat(subElement.split(';')[3]);
  //           }
  //         });
  //         found++;
  //       }
  //     });
  //     var tmpAverage2 = [];
  //     tmpAverage1.data.split(',').forEach((element, index) => {
  //       var tmp = element.split(';');
  //       tmp[2] = parseFloat((tmp1[index]/found).toFixed(2));
  //       tmp[3] = parseFloat((tmp2[index]/found).toFixed(2));
  //       tmpAverage2.push(tmp.join(';'));
  //     });
  //     setCurrentData({data: tmpAverage2.join(',')});
  //   }
  //   if(rangeType === 'day') {
  //     data.forEach(element => {
  //       if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
  //         setCurrentData(element);
  //         found = true;
  //       }
  //     });
  //     if(found == false) {
  //       setCurrentData(null);
  //     }
  //   }
  // }, [rangeType]);

  React.useEffect(() => {
    console.log(customer);
    if(page == 'heartCloud') {
      if(customer.h_token == null || customer.h_token == '') {
        integrateHeartAPI();
      } else if(!dayjs().isBefore(dayjs(customer.h_token_expried))) {
        integrateHeartAPI();
      } else {
        setHeartEndDate(dayjs());
        setHeartRangeType('day');
        getHeartData('day');
      }
    } else if(page == 'bio') {
      getBioCards();
    }
  }, [page]);

  const integrateHeartAPI = async () => {
    setLoadingText('Integrating Heart Cloud API. Please Wait...')
    setLoading(true);
    const formData = {
      id: customer.id,
      h_id: customer.h_id,
      h_key: customer.h_key,
      h_password: customer.h_password,
      h_email: customer.h_email
    };
    try {
        const response = await axios.post(`${API_URL}integrate/heart`, formData, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        },
    });
      if(response.data.indexOf('failed_') > -1) {
          toast.error(`${response.data.substring(7)}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
          setPage('home');
      } else {
          toast.success("Integration successful!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
          const now = new Date();
          const after20Days = new Date(now);
          after20Days.setDate(now.getDate() + 20);
          setCustomer({...customer, h_token: response.data, h_token_expried: after20Days})
      }
    } catch (error) {
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          window.location.href = "/login";
        }
        console.error("Error fetching data:", error);
    }
    setLoadingText('Loading...')
    setLoading(false);
  }

  useEffect(()=>{
    if(heartRangeType != null) {
      if(heartRangeType == 'custom') {
        if(!(heart_endDate == null || heart_startDate == null)) {
          getHeartData(heartRangeType);
        }  
      } else {
        getHeartData(heartRangeType);
      }
    }
  }, [heartRangeType])

  useEffect(()=>{
    if(heartRangeType != 'day') {
      if(!(heart_endDate == null || heart_startDate == null)) {
        getHeartData('custom');
      }
    }
    if(heartRangeType == 'day' && heart_endDate != null) {
      getHeartData('day');
    }
  }, [heart_endDate, heart_startDate])

  const getHeartData = async (type) => {
    setLoading(true);
    var formData = {
        type: type,
        token: customer?.h_token,
        key: customer?.h_key,
    }
    if( type == 'day') {
        formData.day = heart_endDate;
    } else if( type == 'custom') {
        formData.startDate = heart_startDate;
        formData.endDate = heart_endDate;
    }
    await axios
      .post(`${API_URL}api/heart`, formData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setHeartData(res.data['Sessions']);
      })
      .catch((err) => {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          window.location.href = "/login";
        }
        console.log(err);
      });
    setLoading(false);
  }

  const getBioCards = async () => {
    setLoading(true);
    const formData = {
      token: customer.b_token,
    };
    try {
        const response = await axios.post(`${API_URL}customer/bio/cards`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      console.log(response.data);
      if(response.data.result.errorcode == 1) {
        // Invalid Credentials
        toast.error("No such User or the password is incorrect!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if(response.data.result.errorcode == 3) {
        // Invalid Credentials
        toast.error("Parameters were set incorrectly", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if(response.data.result.errorcode == 4) {
        // Invalid Credentials
        toast.error("Access is blocked due to expiration", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if(response.data.result.errorcode == 6) {
        // Invalid Credentials
        toast.error("Access with the current software version or account type is blocked", {
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
        setbCustomers(response.data.result.cardslist);
      }
        // setBioData(response.data)
    } catch (error) {
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          window.location.href = "/login";
        }
        console.error("Error fetching data:", error);
    }
    setLoading(false);
  }

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
                <Container maxWidth='1500px'>
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
                      page === 'bio' && (
                          <>
                            <Typography
                              textAlign='center'
                              sx={{ fontWeight: "bold", color: "black", mt: '5rem' }}
                              variant={"h5"}
                            >
                              BioWell Dashboard
                            </Typography>
                            {/* <Box mt={6} pb={4} display='flex' alignItems='center' justifyContent='end'>
                              <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload files
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple accept=".csv, .xlsx"/>
                              </Button>
                            </Box> */}
                            {
                              bCustomers == null || bCustomers.length == 0 ? 
                                <Typography
                                  align="center"
                                  variant={"h5"}
                                  mt={4}
                                >
                                  There is no data to display
                                </Typography> : 
                                <BioWellDashboard customer={customer} data={bCustomers} b_token={customer.b_token}></BioWellDashboard>
                                // <RecommendationTable data={currentData?.data}/>
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
                                            disabled={heartRangeType == 'week' || heartRangeType == 'month'}
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
                                    <MenuItem value="day" selected>One Day</MenuItem>
                                    <MenuItem value="week">Last Week</MenuItem>
                                    <MenuItem value="month">Last Month</MenuItem>
                                    <MenuItem value="custom">Custom</MenuItem>
                                  </Select>
                                </FormControl>
                            </Box>
                            <Box mt={5}></Box>
                            {
                                heartRangeType === 'day' && <DayResult data={heartData}></DayResult>
                            }
                            {
                                (heartRangeType === 'month' || heartRangeType === 'week' || heartRangeType === 'custom') && <CustomResult data={heartData}></CustomResult>
                            }
                            {/* {
                                heartData.length == 0 ? 
                                <Typography
                                    align="center"
                                    variant={"h5"}
                                    mt={10}
                                >
                                    There is no data to display
                                </Typography> : 
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
                            } */}
                          </>
                      )
                  }
                </Container>
              </Box>
            </Main>
        </Box>
      ) : (
        <Loading text={loadingText}/>
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
    var buttons = [
        {
          name: "Bio-Well",
          icon: House,
          onClick: () => setPage("bio"),
          active: page === "bio"
        },
        {
          name: "Heart Cloud",
          icon: House,
          onClick: () => setPage("heartCloud"),
          active: page === "heartCloud"
        },
        {
            name: "Sign out",
            icon: Logout,
            onClick: () => {
              Cookies.remove("token");
              window.location.href = "/login";
            },
        },
    ];
    if(customer?.apis?.split(',').indexOf('Heart Cloud') == -1) {
        buttons.splice(1, 1);
    }
    if(customer?.apis?.split(',').indexOf('Biowell API') == -1) {
      buttons.splice(0, 1);
    }
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
            customer?.sex == "Male" ? (
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
            {customer?.firstname} {customer?.lastname}
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
  