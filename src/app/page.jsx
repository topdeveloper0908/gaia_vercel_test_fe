"use client";
import React, { useEffect, useRef, useState } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import axios from "axios";

import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import Loading from "@/components/Loading";
import countries from "../../countries.json";
import { Avatar } from "@mui/material";
import UserInfoModal from "@/components/UserInfoModal";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#67bc46",
  },
});

const miles = [
  {
    value: "0",
    label: "0",
  },
  {
    value: "5",
    label: "5",
  },
  {
    value: "10",
    label: "10",
  },
  {
    value: "20",
    label: "20",
  },
];

const types = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "In-person",
    label: "In-person",
  },
  {
    value: "Remote",
    label: "Remote",
  },
];

export default function Home() {
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [viewport, setViewport] = useState({
    latitude: 28.49447,
    longitude: -81.534555,
    zoom: 10,
  });

  // Value
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [practitioners, setPractitioners] = useState([]);
  const [zipcode, setZipcode] = useState(null);
  const [mile, setMile] = useState(0);
  const [practitionerType, setPractitionerType] = useState("All");
  const [filter, setFilter] = useState([]);
  const [totalSpecs, setTotalSpecs] = useState([]);
  const [totalTags, setTotalTags] = useState([]);
  const [filterSpecs, setFilterSpecs] = useState([]);
  const [filterTags, setFilterTags] = useState([]);

  // State
  const [loading, setLoading] = useState(true);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userInModal, setUserInModal] = useState({});

  const mapRef = useRef();

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}data`);
      // Tmp values
      var tmp = [];
      var totalSpecs_tmp = [];
      var totalTags_tmp = [];

      // Get Data
      tmp = response.data;
      tmp.sort(function (a, b) {
        return Number(b.rank) - Number(a.rank);
      });
      tmp.forEach(async (element, index) => {
        // Get all specalities
        var specialty = element.specialty.split(",");
        specialty.forEach((item, itemIndex) => {
          if (item.charAt(0) == " ") {
            specialty[itemIndex] = item.slice(1);
          }
          if (totalSpecs_tmp.indexOf(specialty[itemIndex]) == -1) {
            totalSpecs_tmp.push(specialty[itemIndex]);
          }
        });

        // Get all tags
        var tags = element.tags.split(",");
        tags.forEach((item, itemIndex) => {
          if (item.charAt(0) == " ") {
            tags[itemIndex] = item.slice(1);
          }
          if (totalTags_tmp.indexOf(tags[itemIndex]) == -1) {
            totalTags_tmp.push(tags[itemIndex]);
          }
        });
        tmp[index].specialty = specialty;
        tmp[index].tags = tags;

        // use short code for the country, such as 'us' for 'United States'
        // there are countries in form of {"code": "full name"} in countries.js
        countries.countries.forEach((subElement) => {
          if (
            subElement.key == element.country ||
            subElement.value == element.country
          ) {
            tmp[index].country = subElement.key;
          }
        });
        // Get lang and long
        var geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${element.zipcode}.json?country=${element.country}&access_token=${MAPBOX_TOKEN}`;
        // Make a GET request to the Mapbox Geocoding API
        await fetch(geocodingUrl)
          .then((response) => response.json())
          .then((data) => {
            // Extract latitude and longitude from the response
            const features = data.features;
            if (features.length > 0) {
              const coordinates = features[0].center;
              const latitude = coordinates[1];
              const longitude = coordinates[0];
              tmp[index].latitude = latitude;
              tmp[index].longitude = longitude;
            } else {
              console.log("No coordinates found for the zipcode");
            }
          })
          .catch((error) => {
            console.error(
              "Error fetching data from Mapbox Geocoding API:",
              error
            );
          });
      });

      console.log("data", tmp);
      setPractitioners(tmp);
      setFilter(tmp);
      setTotalSpecs(totalSpecs_tmp);
      setTotalTags(totalTags_tmp);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // When you click the toggle button of header
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // When you click specialty of sidebar
  const specClicked = (clicked) => {
    const tmp = filterSpecs;
    if (filterSpecs.indexOf(clicked) > -1) {
      tmp.splice(filterSpecs.indexOf(clicked), 1);
    } else {
      tmp.push(clicked);
    }
    setFilterSpecs([...tmp]);
  };

  // When you click tag of sidebar
  const tagClicked = (clicked) => {
    const tmp = filterTags;
    if (filterTags.indexOf(clicked) > -1) {
      tmp.splice(filterTags.indexOf(clicked), 1);
    } else {
      tmp.push(clicked);
    }
    setFilterTags([...tmp]);
  };

  const filterUser = async () => {
    var tmp = [];

    // Filter By Type
    if (practitionerType == null || practitionerType == "All") {
      tmp = [...practitioners];
    } else {
      practitioners.forEach((element) => {
        if (element.availability == practitionerType) {
          tmp.push(element);
        }
      });
    }

    // Filter By zipcode
    if (zipcode != "" && mile == 0) {
      var tmp1 = [];
      tmp.forEach((element, index) => {
        if (element.zipcode.indexOf(zipcode) > -1) {
          tmp1.push(element);
        }
      });
      tmp = [...tmp1];
    }

    // Filter By miles
    if (zipcode != "" && mile != 0 && zipcode.length == 5) {
      // Check if the zipcode is correct
      await fetch(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          zipcode +
          ".json?access_token=" +
          MAPBOX_TOKEN
      )
        .then((response) => response.json())
        .then(async (data) => {
          // Check the response to determine if the zip code is valid and obtain location details
          if (data.features.length > 0) {
            // The zip code is valid, you can access the location information
            var tmp1 = [];
            await Promise.all(
              tmp.map(async (element) => {
                var dis = await getDistance(zipcode, element.zipcode);
                if (dis <= mile) {
                  if (isDuplicated(tmp1, element) == false) {
                    tmp1.push(element);
                  }
                }
              })
            );
            tmp = [...tmp1];
          } else {
            // The zip code is invalid or no results were found
            console.log("Invalid or not found zip code");
            return;
          }
        })
        .catch((error) => {
          // Handle any errors in the request
          console.error("Error querying Mapbox Geocoding API:", error);
        });
    }

    // Filter By Specialty
    if (filterSpecs.length > 0) {
      var tmp1 = [];
      tmp.forEach((element, index) => {
        element.specialty.forEach((subElement) => {
          if (filterSpecs.indexOf(subElement) > -1) {
            if (isDuplicated(tmp1, element) == false) {
              tmp1.push(element);
            }
          }
        });
      });
      tmp = [...tmp1];
    }

    // Filter By Tag
    if (filterTags.length > 0) {
      var tmp1 = [];
      tmp.forEach((element, index) => {
        element.tags.forEach((subElement) => {
          if (filterTags.indexOf(subElement) > -1) {
            if (isDuplicated(tmp1, element) == false) {
              tmp1.push(element);
            }
          }
        });
      });
      tmp = [...tmp1];
    }

    if (tmp.length == 0) {
      practitioners.forEach((element) => {
        if (element.availability == "Remote") {
          tmp.push(element);
        }
      });
    }

    setFilter([...tmp]);
  };

  const getDistance = async (zipCode1, zipCode2) => {
    var tmp = 100000000;
    // Call Mapbox Geocoding API to obtain coordinates for the zip codes
    await fetch(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        zipCode1 +
        ".json?access_token=" +
        MAPBOX_TOKEN
    )
      .then((response1) => response1.json())
      .then(async (data1) => {
        var coordinates1 = data1.features[0].center; // Latitude and longitude for zip code 1
        await fetch(
          "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            zipCode2 +
            ".json?access_token=" +
            MAPBOX_TOKEN
        )
          .then((response2) => response2.json())
          .then((data2) => {
            var coordinates2 = data2.features[0].center; // Latitude and longitude for zip code 2
            // Calculate distance using the obtained coordinates (Haversine formula or other methods)
            tmp = calculateDistance(coordinates1, coordinates2);
          })
          .catch((error) => {
            console.error("Error obtaining coordinates for zip code 2:", error);
          });
      })
      .catch((error) => {
        console.error("Error obtaining coordinates for zip code 1:", error);
      });
    return tmp;
  };

  // Function to convert degrees to radians
  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Function to calculate distance using Haversine formula and return the result in miles
  const calculateDistance = (coords1, coords2) => {
    const earthRadiusMiles = 3958.8; // Radius of the Earth in miles
    const lat1 = coords1[1];
    const lon1 = coords1[0];
    const lat2 = coords2[1];
    const lon2 = coords2[0];

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusMiles * c; // Distance in miles

    return distance;
  };

  // Check if the practitioner is duplicated
  const isDuplicated = (list, value) => {
    var tmp = false;
    list.forEach((element) => {
      if (element.id == value.id) {
        tmp = true;
      }
    });
    return tmp;
  };

  // Click the practitioner

  const practitionerClicked = (index) => {
    if (
      filter[index].latitude != undefined &&
      filter[index].longitude != undefined
    ) {
      handleMarkerClick(filter[index].latitude, filter[index].longitude);
      document.querySelector("#profile-" + filter[index].id).scrollIntoView({
        behavior: "smooth",
      });
    }
    console.log({ filter, index });
    setSelectedPractitioner(filter[index]);
  };

  const handleMarkerClick = (markerLatitude, markerLongitude) => {
    mapRef.current?.flyTo({
      center: [markerLongitude, markerLatitude],
      duration: 5000,
      zoom: 12,
    });
  };

  useEffect(() => {
    filterUser();
  }, [filterSpecs, filterTags, zipcode, mile, practitionerType]);

  const clearFilter = () => {
    setFilterSpecs([]);
    setFilterTags([]);
    setZipcode("");
    setMile(0);
    setPractitionerType("All");
  };

  return (
    <main>
      {loading == false ? (
        <>
          <Box sx={{ m: 1 }}>
            <Paper elevation={3}>
              <Box sx={{ p: 1 }}>
                <Stack
                  className="header"
                  co="correctValue"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  direction="row"
                >
                  <Link
                    co="correctValue"
                    sx={{ mb: 0, ml: 2 }}
                    href="#"
                    underline="none"
                  >
                    <img
                      style={{ display: "block" }}
                      src="./img/logo-1.png"
                      alt="logo"
                      width="160"
                    />
                    {/* <Image src='/logo-1.png' alt='logo' width={1125} height={450} /> */}
                  </Link>
                  <Stack
                    spacing={1}
                    co="correctValue"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    direction="row"
                  >
                    <Button
                      onClick={() => toggleSidebar()}
                      variant={sidebarActive ? "contained" : "outlined"}
                      co="correctValue"
                      startIcon={<FormatListBulletedIcon />}
                    >
                      <span className="text">Filter</span>
                    </Button>
                    <Button
                      href="/register"
                      variant="contained"
                      co="correctValue"
                      startIcon={<AddIcon />}
                    >
                      <span className="text">Join as Practitioner</span>
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Box>
          <Box m={1}>
            <Box
              marginLeft={sidebarActive ? "0" : "-310px"}
              className="sidebar shadow scrollBar-hidden"
              width={"300px"}
              position={"fixed"}
              zIndex={1000}
              top={"6rem"}
              bottom={".5rem"}
              bgcolor={"white"}
              padding={"1.5rem"}
              left={".5rem"}
            >
              <Button
                fullWidth={true}
                variant="contained"
                color="error"
                onClick={clearFilter}
              >
                Clear Filter
              </Button>
              <TextField
                onChange={(e) => setZipcode(e.target.value)}
                sx={{ mt: 4 }}
                fullWidth={true}
                size="small"
                id="outlined-basic"
                label="Zipcode"
                variant="outlined"
                value={zipcode}
              />
              <TextField
                sx={{ mt: 3 }}
                id="outlined-select-currency"
                select
                label="Select Mile"
                defaultValue="0"
                size="small"
                onChange={(e) => setMile(Number(e.target.value))}
                fullWidth={true}
                value={mile}
              >
                {miles.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                sx={{ mt: 3 }}
                id="outlined-select-currency"
                select
                label="Select Type"
                defaultValue="All"
                size="small"
                onChange={(e) => setPractitionerType(e.target.value)}
                fullWidth={true}
                value={practitionerType}
              >
                {types.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Typography mt={3} mb={1}>
                Specialty
              </Typography>
              <Stack
                flexWrap="wrap"
                alignItems={"center"}
                co="correctValue"
                direction={"row"}
              >
                {totalSpecs.map((item, index) => {
                  return (
                    <Box
                      className="cursor-pointer"
                      onClick={() => specClicked(item)}
                      key={index}
                      bgcolor={
                        filterSpecs.indexOf(item) > -1
                          ? "primary.main"
                          : "white"
                      }
                      color={
                        filterSpecs.indexOf(item) > -1
                          ? "white"
                          : "primary.main"
                      }
                      border={1}
                      co="correctValue"
                      borderColor="primary.main"
                      borderRadius={1}
                      px={1}
                      py={0.5}
                      m={0.2}
                    >
                      <Typography fontSize=".9rem" co="correctValue">
                        {item}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
              <Typography mt={3} mb={1}>
                Tags
              </Typography>
              <Stack
                flexWrap="wrap"
                alignItems={"center"}
                co="correctValue"
                direction={"row"}
              >
                {totalTags.map((item, index) => {
                  return (
                    <Box
                      className="cursor-pointer"
                      onClick={() => tagClicked(item)}
                      key={index}
                      bgcolor={
                        filterTags.indexOf(item) > -1 ? "primary.main" : "white"
                      }
                      color={
                        filterTags.indexOf(item) > -1 ? "white" : "primary.main"
                      }
                      border={1}
                      co="correctValue"
                      borderColor="primary.main"
                      borderRadius={1}
                      px={1}
                      py={0.5}
                      m={0.2}
                    >
                      <Typography fontSize=".9rem" co="correctValue">
                        {item}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
            <Box
              onClick={() => setSidebarActive(false)}
              position={"fixed"}
              top={"6rem"}
              right={".5rem"}
              bottom={".5rem"}
              left={"1rem"}
              zIndex={sidebarActive ? 999 : -1}
              bgcolor={"rgba(0,0,0,.3)"}
            ></Box>
            <Paper elevation={3}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={6} sx={{ minHeight: "350px" }}>
                  <Box id="map">
                    {filter && (
                      <CustomMap
                        MAPBOX_TOKEN={MAPBOX_TOKEN}
                        viewport={viewport}
                        practitioners={filter}
                        mapRef={mapRef}
                        practitionerClicked={practitionerClicked}
                        setUserInModal={(user) => {
                          setUserInModal(user);
                          setUserModalOpen(true);
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid co="correctValue" item md={6}>
                  <div className="main-content scrollBar-hidden">
                    <Box></Box>
                    <Box
                      id="page-top"
                      position={"relative"}
                      mx={{ md: 4 }}
                      co="correctValue"
                    >
                      <Typography
                        variant="h5"
                        co="correctValue"
                        fontWeight={700}
                        mt={3}
                        ml={1}
                        mb={1}
                      >
                        {filter.length} Services found
                      </Typography>
                      {filter.map((element, index) => {
                        return (
                          <Box
                            onClick={() => practitionerClicked(index)}
                            key={index}
                            co="correctValue"
                            className={`profile-wrapper ${
                              selectedPractitioner?.id == element.id
                                ? "active-profile"
                                : ""
                            }`}
                            borderTop={1}
                            borderBottom={1}
                            borderColor={"#eee"}
                            px={3}
                            py={3}
                            id={"profile-" + element.id}
                          >
                            <Stack
                              alignItems={"center"}
                              spacing={2}
                              co="correctValue"
                              direction={{ md: "row" }}
                            >
                              <Box position={"relative"}>
                                {element.upload == 0 ? (
                                  !element.imageURL ||
                                  element.imageURL == "" ? (
                                    element.sex == "Male" ? (
                                      <Avatar
                                        src={
                                          "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34a0dbca137ef4f425e.png"
                                        }
                                        sx={{ width: 250, height: 250 }}
                                      />
                                    ) : (
                                      <Avatar
                                        src={
                                          "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34ab7ea181193716085.png"
                                        }
                                        sx={{ width: 250, height: 250 }}
                                      />
                                    )
                                  ) : (
                                    <Avatar
                                      src={element.imageURL}
                                      sx={{ width: 250, height: 250 }}
                                    />
                                  )
                                ) : (
                                  <Avatar
                                    src={API_URL + "src/" + element.imageURL}
                                    sx={{ width: 250, height: 250 }}
                                  />
                                )}
                                {element.rank == 3 ? (
                                  <Stack
                                    direction={"row"}
                                    boxShadow={"0px 1px 8px #888888"}
                                    co="correctValue"
                                    borderRadius={".3rem"}
                                    border={"2px solid #fff"}
                                    borderColor={'#fff'}
                                    position={"absolute"}
                                    top={-0.7}
                                    left={'-.5rem'}
                                    p={0.4}
                                    bgcolor={"primary.main"}
                                    alignItems={"center"}
                                    pl={0.5}
                                    pr={1}
                                  >
                                    <img
                                      src="./img/logo.png"
                                      width="20"
                                      height="20"
                                      alt="Uploaded Image"
                                    />
                                    <Typography
                                      co="correctValue"
                                      fontSize={".8rem"}
                                      color={"#fff"}
                                      ml={0.2}
                                      textTransform={'uppercase'}
                                      letterSpacing={"-.05em"}
                                    >
                                      Recommended
                                    </Typography>
                                  </Stack>
                                ) : (
                                  ""
                                )}
                                {element.availability == "Remote" ? (
                                  <Stack
                                    direction={"row"}
                                    boxShadow={"0px 1px 8px #888888"}
                                    co="correctValue"
                                    borderRadius={".3rem"}
                                    border={"2px solid #fff"}
                                    borderColor={'#fff'}
                                    position={"absolute"}
                                    top={element.rank === 3 ? '1.5rem' : -0.7}
                                    left={'-.5rem'}
                                    p={0.4}
                                    bgcolor={"primary.main"}
                                    alignItems={"center"}
                                    pl={0.5}
                                    pr={1}
                                  >
                                    <img
                                      src="./img/logo.png"
                                      width="20"
                                      height="20"
                                      alt="Uploaded Image"
                                    />
                                    <Typography
                                      co="correctValue"
                                      fontSize={".8rem"}
                                      textTransform={'uppercase'}
                                      color={"#fff"}
                                      ml={0.2}
                                      letterSpacing={"-.05em"}
                                    >
                                      Remote
                                    </Typography>
                                  </Stack>
                                ) : (
                                  ""
                                )}
                              </Box>
                              <Box>
                                <Typography
                                  variant="h5"
                                  co="correctValue"
                                  fontWeight={700}
                                >
                                  {element.firstname + " " + element.lastname}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  co="correctValue"
                                  fontWeight={500}
                                  mb={0.5}
                                >
                                  {element.city +
                                    " " +
                                    element.state +
                                    " " +
                                    element.zipcode +
                                    " " +
                                    element.country}
                                </Typography>
                                <StyledRating
                                  co="correctValue"
                                  color="primary.main"
                                  name="size-medium"
                                  defaultValue={
                                    element.review == null ? 0 : element.review
                                  }
                                  readOnly
                                  emptyIcon={
                                    <StarIcon
                                      style={{ opacity: 0.55 }}
                                      fontSize="inherit"
                                    />
                                  }
                                />
                                <Stack
                                  spacing={1}
                                  co="correctValue"
                                  direction={"row"}
                                >
                                  <Typography
                                    fontSize="1rem"
                                    co="correctValue"
                                    color="primary.main"
                                    fontWeight={700}
                                  >
                                    Specialty:
                                  </Typography>
                                  <Stack
                                    flexWrap="wrap"
                                    alignItems={"center"}
                                    co="correctValue"
                                    direction={"row"}
                                  >
                                    {element.specialty.map((item, subIndex) => {
                                      return (
                                        <Box
                                          key={subIndex}
                                          color="primary.main"
                                          border={1}
                                          co="correctValue"
                                          borderColor="primary.main"
                                          borderRadius={1}
                                          px={0.5}
                                          m={0.2}
                                        >
                                          <Typography
                                            fontSize=".7rem"
                                            co="correctValue"
                                          >
                                            {item}
                                          </Typography>
                                        </Box>
                                      );
                                    })}
                                  </Stack>
                                </Stack>
                                <Stack
                                  mt={0.5}
                                  spacing={1}
                                  direction={"row"}
                                  co="correctValue"
                                >
                                  <Typography
                                    fontSize="1rem"
                                    color="primary.main"
                                    fontWeight={700}
                                    co="correctValue"
                                  >
                                    Tags:
                                  </Typography>
                                  <Stack
                                    flexWrap="wrap"
                                    alignItems={"center"}
                                    direction={"row"}
                                    co="correctValue"
                                  >
                                    {element.tags.map((item, subIndex) => {
                                      return (
                                        <Box
                                          key={subIndex}
                                          color="primary.main"
                                          border={1}
                                          co="correctValue"
                                          borderColor="primary.main"
                                          borderRadius={1}
                                          px={0.5}
                                          m={0.2}
                                        >
                                          <Typography
                                            co="correctValue"
                                            fontSize=".7rem"
                                          >
                                            {item}
                                          </Typography>
                                        </Box>
                                      );
                                    })}
                                  </Stack>
                                </Stack>
                                <Stack
                                  alignItems={"center"}
                                  spacing={1}
                                  co="correctValue"
                                  direction={"row"}
                                  sx={{ mt: 2 }}
                                >
                                  <Button
                                    href={element.meetinglink}
                                    variant="contained"
                                    co="correctValue"
                                    onClick={(e) => {
                                      // stop propagation to prevent the page from scrolling to the top
                                      e.stopPropagation();
                                    }}
                                  >
                                    Schedule a Meeting
                                  </Button>
                                  <Button
                                    href={element.profileLink === '' ? `/practitioner/profile/${element.id}` : element.profileLink}
                                    variant="outlined"
                                    co="correctValue"
                                    onClick={(e) => {
                                      // stop propagation to prevent the page from scrolling to the top
                                      e.stopPropagation();
                                    }}
                                  >
                                    View Profile
                                  </Button>
                                </Stack>
                              </Box>
                            </Stack>
                          </Box>
                        );
                      })}
                      <Box position={"fixed"} bottom={"2rem"} right={"2rem"}>
                        <AnchorLink
                          offset="100"
                          href="#page-top"
                          onClick={() => {
                            document
                              .querySelector(
                                filter.length > 0 && "#profile-" + filter[0].id
                              )
                              .scrollIntoView({
                                behavior: "smooth",
                              });
                          }}
                        >
                          <Button
                            variant="contained"
                            aria-label="delete"
                            sx={{ py: 2 }}
                          >
                            <ArrowUpwardIcon />
                          </Button>
                        </AnchorLink>
                      </Box>
                    </Box>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          <UserInfoModal
            open={userModalOpen}
            handleClose={() => setUserModalOpen(false)}
            user={userInModal}
          />
        </>
      ) : (
        <Loading />
      )}
    </main>
  );
}

const CustomMap = ({
  MAPBOX_TOKEN,
  initViewport,
  practitioners,
  mapRef,
  practitionerClicked,
  setUserInModal,
}) => {
  const [viewport, setViewport] = useState(initViewport);
  const [mapFinishedLoading, setMapFinishedLoading] = useState(false);
  const makeMarkers = () => {
    return (
      mapFinishedLoading &&
      practitioners.map((element, index) => {
        return element.latitude == undefined ||
          element.longitude == undefined ? (
          <></>
        ) : (
          <Marker
            key={index}
            latitude={element.latitude}
            longitude={element.longitude}
          >
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                outline: "none",
              }}
            >
              <img
                onClick={() => {
                  practitionerClicked(index);
                  setUserInModal(element);
                }}
                src="./img/pin.png"
                alt="Marker"
                style={{ width: 30, height: 30 }}
              />
            </button>
          </Marker>
        );
      })
    );
  };
  return (
    practitioners && (
      <Map
        co="correctValue"
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        initialViewState={viewport}
        maxZoom={20}
        minZoom={1}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
        ref={mapRef}
        onLoad={() => {
          setMapFinishedLoading(true);
        }}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
        {makeMarkers()}
      </Map>
    )
  );
};
