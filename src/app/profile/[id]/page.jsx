"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AnchorLink from "react-anchor-link-smooth-scroll";
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Button,
  Rating,
  styled,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import CheckIcon from "@mui/icons-material/Check";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import LaptopIcon from "@mui/icons-material/Laptop";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import SpaIcon from "@mui/icons-material/Spa";
import PersonIcon from "@mui/icons-material/Person";
import BalanceIcon from "@mui/icons-material/Balance";
import DeblurIcon from "@mui/icons-material/Deblur";
import FlashOnIcon from "@mui/icons-material/FlashOn";

import Loading from "@/components/Loading";
import Link from "next/link";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#67bc46",
  },
});

export default function Profile({ params }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const token = Cookies.get("token");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const formData = {
      id: params.id,
    };
    try {
      const response = await axios.post(`${API_URL}user`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`
        },
      });
      console.log(response.data[0]);
      var tmp = [];
      var dataTmp;
      dataTmp = response.data[0];
      var specialty = response.data[0].specialty.split(",");
      specialty.forEach((item, itemIndex) => {
        if (item.charAt(0) == " ") {
          specialty[itemIndex] = item.slice(1);
        }
        if (tmp.indexOf(specialty[itemIndex]) == -1) {
          tmp.push(specialty[itemIndex]);
        }
      });
      dataTmp.specialty = tmp;
      tmp = [];
      var tags = response.data[0].tags.split(",");
      tags.forEach((item, itemIndex) => {
        if (item.charAt(0) == " ") {
          tags[itemIndex] = item.slice(1);
        }
        if (tmp.indexOf(tags[itemIndex]) == -1) {
          tmp.push(tags[itemIndex]);
        }
      });
      dataTmp.tags = tmp;
      console.log(dataTmp);
      setData(dataTmp);
      setLoading(false);
    } catch (error) {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        window.location.href = "/login";
      }
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main>
      {loading == false ? (
        <Box>
          <Container className="container">
            <Stack alignItems="center" justifyContent="center" mt={4} gap={4}>
              <img
                style={{ display: "block" }}
                src="../img/logo-1.png"
                alt="logo"
                width="250"
              />
              <Typography my={3} fontSize="64px" align="center">
                Check Your Chakra Balance!
              </Typography>
              <Typography
                mb={5}
                fontSize="2rem"
                align="center"
                color="primary.main"
              >
                You Will Receive a 24-Page Report On Your Energy Wellness and
                Get A Custom Meditation Music File...
              </Typography>
              <Grid container spacing={1} mb={10}>
                <Grid item md={6}>
                  <Stack justifyContent="center" alignItems="center">
                    {data.upload == 0 ? (
                      !data.imageURL || data.imageURL == "" ? (
                        data.sex == "Male" ? (
                          <img
                            src={
                              "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34a0dbca137ef4f425e.png"
                            }
                            width={300}
                            height={300}
                            style={{ display: "block", borderRadius: ".3rem" }}
                          />
                        ) : (
                          <img
                            src={
                              "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34ab7ea181193716085.png"
                            }
                            width={300}
                            height={300}
                            style={{ display: "block", borderRadius: ".3rem" }}
                          />
                        )
                      ) : (
                        <img
                          src={data.imageURL}
                          alt={data.firstname[0]}
                          width={300}
                          height={300}
                          style={{ display: "block", borderRadius: ".3rem" }}
                        />
                      )
                    ) : (
                      <img
                        src={API_URL + "src/" + data.imageURL}
                        alt={data.firstname[0]}
                        width={300}
                        height={300}
                        style={{ display: "block", borderRadius: ".3rem" }}
                      />
                    )}
                    <Typography variant="h4" mt={2} mb={1}>
                      {data?.firstname + " " + data?.lastname}
                    </Typography>
                    <StyledRating
                      co="correctValue"
                      color="primary.main"
                      name="size-medium"
                      defaultValue={data?.review}
                      readOnly
                      emptyIcon={
                        <StarIcon
                          style={{ opacity: 0.55 }}
                          fontSize="inherit"
                        />
                      }
                    />
                    <AnchorLink href="#profile-section">
                      <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        co="correctValue"
                      >
                        <Typography fontSize={"30px"}>
                          Reserve Your Biofield Scan
                        </Typography>
                      </Button>
                    </AnchorLink>
                  </Stack>
                </Grid>
                <Grid item md={6}>
                  <Box p={6} border={1} borderColor="#ddd" borderRadius=".3rem">
                    <Typography variant="h4" textAlign="center" mb={3}>
                      Practitioner Information
                    </Typography>
                    <Stack direction="row" alignItems="center" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Name
                      </Typography>
                      <Typography variant="h6">
                        {data?.firstname + " " + data?.lastname}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Address
                      </Typography>
                      <Typography flex={1} variant="h6">
                        {(data?.hide == 1 || data?.availability == "Remote"
                          ? ""
                          : data?.address) +
                          " " +
                          data?.city +
                          " " +
                          data?.state +
                          " " +
                          data?.zipcode +
                          " " +
                          data?.country}
                      </Typography>
                    </Stack>
                    {data?.hide == 1 || data?.availability == "Remote" ? (
                      <></>
                    ) : (
                      <Stack direction="row" alignItems="center" mb={1}>
                        <Typography variant="h6" width="10rem">
                          Email
                        </Typography>
                        <Typography variant="h6">{data?.email}</Typography>
                      </Stack>
                    )}
                    {data?.hide == 1 || data?.availability == "Remote" ? (
                      <></>
                    ) : (
                      <Stack direction="row" alignItems="center" mb={1}>
                        <Typography variant="h6" width="10rem">
                          Phone
                        </Typography>
                        <Typography variant="h6">{data?.phone}</Typography>
                      </Stack>
                    )}
                    <Stack direction="row" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Speciality
                      </Typography>
                      <Stack
                        flex={1}
                        flexWrap="wrap"
                        alignItems={"center"}
                        co="correctValue"
                        direction={"row"}
                      >
                        {data?.specialty.map((item, index) => {
                          return (
                            <Box
                              className="cursor-pointer"
                              key={index}
                              color="primary.main"
                              border={1}
                              co="correctValue"
                              borderColor="primary.main"
                              borderRadius={1}
                              px={0.7}
                              py={0.3}
                              m={0.2}
                            >
                              <Typography fontSize=".9rem" co="correctValue">
                                {item}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Stack>
                    <Stack direction="row" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Tags
                      </Typography>
                      <Stack
                        flex={1}
                        flexWrap="wrap"
                        alignItems={"center"}
                        co="correctValue"
                        direction={"row"}
                      >
                        {data?.tags.map((item, index) => {
                          return (
                            <Box
                              key={index}
                              className="cursor-pointer"
                              color="primary.main"
                              border={1}
                              co="correctValue"
                              borderColor="primary.main"
                              borderRadius={1}
                              px={0.7}
                              py={0.3}
                              m={0.2}
                            >
                              <Typography fontSize=".9rem" co="correctValue">
                                {item}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Reviews
                      </Typography>
                      <StyledRating
                        co="correctValue"
                        color="primary.main"
                        name="size-medium"
                        defaultValue={data?.review}
                        readOnly
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.55 }}
                            fontSize="inherit"
                          />
                        }
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Type
                      </Typography>
                      <Typography variant="h6">
                        {data?.availability == "Remote"
                          ? "Remote"
                          : "In-Person"}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
            <Grid container spacing={4}>
              <Grid item md={6}>
                <Box mb={4}>
                  <img
                    className="w-100"
                    style={{ display: "block" }}
                    src="../img/bio-well-gdv-scan.jpg"
                  />
                </Box>
                <Box mb={2}>
                  <img
                    className="w-100"
                    style={{ display: "block" }}
                    src="../img/chakra-t.png"
                  />
                </Box>
                <Typography mt={3} mb={4} align="center">
                  Influence of meditating with the custom meditation music file.
                </Typography>
                <Box display={"flex"} justifyContent={"center"} mb={2}>
                  <img
                    className="w-100"
                    style={{ maxWidth: "13rem" }}
                    src="../img/bio-well-guarantee.png"
                  />
                </Box>
              </Grid>
              <Grid mt={0} item md={6}>
                <video className="w-100" controls>
                  <source src="../video/intro.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <Box mt={2} pt={2}>
                  <Stack direction={"row"} alignItems={"flex-start"} mt={2}>
                    <Stack
                      alignItems={"center"}
                      justifyContent={"center"}
                      mr={2}
                      borderRadius={"50%"}
                      border={1}
                      borderColor={"#bbb"}
                      p={1.2}
                    >
                      <CheckIcon />
                    </Stack>
                    <Typography fontWeight={500} fontSize={"20px"} mt={1}>
                      Visually see your chakra & meridian balance
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} alignItems={"flex-start"} mt={2}>
                    <Stack
                      alignItems={"center"}
                      justifyContent={"center"}
                      mr={2}
                      borderRadius={"50%"}
                      border={1}
                      borderColor={"#bbb"}
                      p={1.2}
                    >
                      <CheckIcon />
                    </Stack>
                    <Typography fontWeight={500} fontSize={"20px"} mt={1}>
                      ​Check your stress levels and see how your autonomic
                      nervous system is maintaining balance.
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} alignItems={"flex-start"} mt={2}>
                    <Stack
                      alignItems={"center"}
                      justifyContent={"center"}
                      mr={2}
                      borderRadius={"50%"}
                      border={1}
                      borderColor={"#bbb"}
                      p={1.2}
                    >
                      <CheckIcon />
                    </Stack>
                    <Typography fontWeight={500} fontSize={"20px"} mt={1}>
                      Analyze your biofield for disruptions of energy so you can
                      focus on the points of depletion.
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} alignItems={"flex-start"} mt={2}>
                    <Stack
                      alignItems={"center"}
                      justifyContent={"center"}
                      mr={2}
                      borderRadius={"50%"}
                      border={1}
                      borderColor={"#bbb"}
                      p={1.2}
                    >
                      <CheckIcon />
                    </Stack>
                    <Typography fontWeight={500} fontSize={"20px"} mt={1}>
                      Get a full report on your biorhythms for 2023 and 2024 to
                      see how your emotional, physical, and mental cycles can
                      influence your decision-making. This way you can plan your
                      life according to your astrology!
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} alignItems={"flex-start"} mt={2}>
                    <Stack
                      alignItems={"center"}
                      justifyContent={"center"}
                      mr={2}
                      borderRadius={"50%"}
                      border={1}
                      borderColor={"#bbb"}
                      p={1.2}
                    >
                      <CheckIcon />
                    </Stack>
                    <Typography fontWeight={500} fontSize={"20px"} mt={1}>
                      Receive a custom meditation music file based on the
                      alignment of your chakras so you can balance your energy
                      centers.
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <Typography
              className="w-100"
              variant="h2"
              my={5}
              pt={5}
              fontSize="64px"
              align="center"
              color="primary.main"
            >
              DOES THIS SOUND LIKE YOU?
            </Typography>
            <Grid container spacing={4}>
              <Grid item md={6}>
                <Typography
                  fontSize={"24px"}
                  letterSpacing={"1px"}
                  mb={5}
                  py={5}
                >
                  "I have been attending many workshops and seminars but don't
                  know how they have influenced my energy."
                </Typography>
                <Typography
                  fontSize={"24px"}
                  letterSpacing={"1px"}
                  mb={5}
                  py={5}
                >
                  "I feel a bit of discomfort but can't really put my finger on
                  what is bothering me."
                </Typography>
                <Typography
                  fontSize={"24px"}
                  letterSpacing={"1px"}
                  mb={5}
                  py={5}
                >
                  "It would be great if I could visually see how my jewelry is
                  influencing my energy."
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Typography
                  fontSize={"24px"}
                  letterSpacing={"1px"}
                  my={10}
                  py={5}
                >
                  "I have been working on aligning my energy centers but don't
                  have a scientific way to see the alignment."
                </Typography>
                <Typography
                  fontSize={"24px"}
                  letterSpacing={"1px"}
                  mb={5}
                  py={5}
                >
                  "I would like to see how COVID has influenced the energy of my
                  respiratory system."
                </Typography>
                <Typography
                  fontSize={"24px"}
                  letterSpacing={"1px"}
                  mb={5}
                  py={5}
                >
                  "I feel exhausted physically & mentally but don't know how to
                  balance my energy or where to focus."
                </Typography>
              </Grid>
            </Grid>
            <Typography
              className="w-100"
              variant="h2"
              my={5}
              pt={5}
              fontSize="64px"
              align="center"
              color="primary.main"
            >
              We Have The <br></br> Solution for you!
            </Typography>
            <Typography
              className="w-100"
              variant="h2"
              mt={5}
              py={3}
              fontSize="64px"
              align="center"
              color="primary.main"
            >
              Introducing
            </Typography>
            <Stack
              mb={5}
              className="w-100"
              direction={"row"}
              justifyContent={"center"}
            >
              <KeyboardDoubleArrowDownIcon
                sx={{ fontSize: "83px", color: "#2f2f2f9e" }}
              />
            </Stack>
            <img
              className="w-100"
              style={{ display: "block" }}
              src="../img/Screen-Shot-2024-01-05-at-5.18.47-PM.png"
            />
            <Typography
              className="w-100"
              variant="h2"
              mt={5}
              mb={3}
              pt={2}
              fontSize="64px"
              align="center"
              color="primary.main"
            >
              The Bio-Well 3.0
            </Typography>
            <Typography
              className="w-100"
              variant="h2"
              mb={2}
              fontSize="64px"
              align="center"
            >
              Reserve Your Bioenergy Scan Today!
            </Typography>
            <Stack justifyContent={"center"} direction={"row"}>
              <AnchorLink href="#profile-section">
                <Button sx={{ mt: 4 }} variant="contained" co="correctValue">
                  <Typography fontSize={"30px"}>Book An Appointment</Typography>
                </Button>
              </AnchorLink>
            </Stack>
            <Typography
              className="w-100"
              mb={5}
              pb={1}
              variant="h5"
              mt={4}
              align="center"
            >
              Get Your Hands on the Most Advanced, Latest Technology in
              Biophotonics <br></br> That Scientists Are Raving About...
            </Typography>
            <img
              className="w-100"
              style={{ display: "block" }}
              src="../img/BEFOREAFTER.png"
            />
            <Typography
              className="w-100"
              variant="h5"
              letterSpacing={"3px"}
              align="center"
            >
              UNHEALTHY BIOFIELD VS. HEALTHY BIOFIELD
            </Typography>
            <Typography
              className="w-100"
              variant="h6"
              align="center"
              sx={{ fontStyle: "italic", textDecoration: "underline" }}
            >
              We have six months to a year before energetic misbalances manifest
              into the physical form.
            </Typography>
            <Typography
              className="w-100"
              mt={8}
              mb={5}
              variant="h4"
              align="center"
            >
              This is What You Get With Your Reservation:
            </Typography>
            <Grid container spacing={4}>
              <Grid item md={6}>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <WatchLaterIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Express Energy Assessment
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    We will scan your energy and generate a 22-page wellness
                    report about the flow of energy in your vital body.
                  </Typography>
                </Box>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <LibraryMusicIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Custom Solfeggio Music
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    We will email you a custom solfeggio music files created
                    based on your chakra alignment. You can use that file during
                    your meditations. You can also charge your water with it.
                  </Typography>
                </Box>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <PersonIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Emotional & Physiological Analysis
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    You will be able to see what emotions are influencing you
                    negatively so you can start working on your emotional
                    wellness to improve your physical wellness.
                  </Typography>
                </Box>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <DeblurIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Chakra Reports
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    Learn how to make sense of chakra movements and how to bring
                    them in balance. Express assessment of chakras in a
                    scientific way.
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={6}>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <LaptopIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Before & After Analysis
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    You have the option of doing a scan before the conference
                    start and after to see how the session influenced your
                    energy body.
                  </Typography>
                </Box>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <SpaIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Energy & Wellness Analysis
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    We will email you the report so you can keep it for your
                    future reference! <br></br>There are many explanations about
                    the energetic body included in the report.
                  </Typography>
                </Box>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <BalanceIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Sympathetic & Parasympathetic Balance
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    Be able to tell which organs are energetically under stress
                    and out of coherence.<br></br> Our autonomic nervous system
                    influences the hormone production in the body.
                  </Typography>
                </Box>
                <Box mb={10}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <FlashOnIcon
                      sx={{ fontSize: "2.2rem", color: "primary.main" }}
                    />
                    <Typography
                      ml={2}
                      fontSize={"1.6rem"}
                      color={"primary.main"}
                    >
                      Meridian Energy Flow Reports
                    </Typography>
                  </Stack>
                  <Typography fontSize={"1.4rem"} mt={1}>
                    Detailed analysis of the flow of energy through the energy
                    pathways. These are connected to the acupuncture points and
                    you will learn how to draw conclusions.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Stack justifyContent={"center"} direction={"row"}>
              <AnchorLink href="#profile-section">
                <Button sx={{ mt: 4 }} variant="contained" co="correctValue">
                  <Typography fontSize={"30px"}>
                    Let me reserve my spot before they are taken...
                  </Typography>
                </Button>
              </AnchorLink>
            </Stack>
            <Typography
              className="w-100"
              variant="h2"
              my={5}
              fontSize="64px"
              align="center"
              color="primary.main"
            >
              Success Stories!
            </Typography>
            <Stack
              mb={5}
              className="w-100"
              direction={"row"}
              justifyContent={"center"}
            >
              <KeyboardDoubleArrowDownIcon
                sx={{ fontSize: "83px", color: "#2f2f2f9e" }}
              />
            </Stack>
            <Grid container mb={4} spacing={4}>
              <Grid item md={3}>
                <img
                  style={{ display: "block" }}
                  src="../img/Nima_Farshid.png"
                />
              </Grid>
              <Grid item md={9}>
                <Typography mb={2} fontSize={"1.75rem"}>
                  " I used the Bio-Well in my personal healing journey when
                  doctors gave me two weeks to live. I was able to heal myself
                  by paying attention to my energy centers and how different
                  modalities were influencing me in real-time."
                </Typography>
                <Typography>- Nima Farshid</Typography>
                <Typography>Bio-Well Global Educator & Distributor</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item md={3}>
                <img
                  style={{ display: "block" }}
                  src="../img/Screenshot-2021-11-08-114907.jpg"
                />
              </Grid>
              <Grid item md={9}>
                <Typography mb={2} fontSize={"1.75rem"}>
                  " This device has taken my healing practice to a whole new
                  level. Being able to visually show people their before & after
                  has been extremely effective."
                </Typography>
                <Typography>- Paul Lowell</Typography>
                <Typography>Reiki Master, Sound Healer, Shaman</Typography>
              </Grid>
            </Grid>
          </Container>
          <Box bgcolor={"#ead212"} pb={6}>
            <Typography
              className="w-100"
              variant="h3"
              color={"white"}
              pt={10}
              mb={1}
              align="center"
            >
              Plus++
            </Typography>
            <Typography className="w-100" variant="h5" mb={1} align="center">
              Even more bonuses...
            </Typography>
            <Typography className="w-100" variant="h4" mb={1} align="center">
              Free Access To Our Holistic Support App
            </Typography>
            <Typography className="w-100" pb={2} align="center">
              Included with Your Bio-Well Scan
            </Typography>
            <Container>
              <img
                className="w-100"
                style={{ display: "block" }}
                src="../img/top-members2.png"
              />
              <Box mb={3}></Box>
              <img
                className="w-100"
                style={{ display: "block" }}
                src="../img/333888999.png"
              />
              <Box mb={2}></Box>
              <Typography
                className="w-100"
                variant="h3"
                color={"white"}
                pt={10}
                mb={1}
                align="center"
              >
                It doesn't stop there...
              </Typography>
              <Typography
                className="w-100"
                variant="h4"
                mt={4}
                mb={3}
                align="center"
              >
                FREE Access to Our Private Community, Lightworkers App.
              </Typography>
              <Typography
                className="w-100"
                fontSize={"1.4rem"}
                mb={3}
                align="center"
                lineHeight={"1.4rem"}
              >
                You get to mingle with over 500 open-minded wellness
                practitioners, and get access to hundreds of Bio-Well
                researchers.
              </Typography>
              <img
                className="w-100"
                style={{ display: "block" }}
                src="../img/member-collage.png"
              />
            </Container>
          </Box>
          <Container className="container">
            <Typography className="w-100" variant="h4" mt={4} align="center">
              LET'S SUM IT UP -
            </Typography>
            <Typography className="w-100" variant="h5" mb={3} align="center">
              Here's everything you'll get with your reservation!
            </Typography>
            <Box
              borderTop={1}
              borderBottom={1}
              borderColor="#333"
              py={1}
              px={5}
            >
              <Stack
                direction={{ md: "row" }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" fontSize="1.8rem" mt={4}>
                    Bio-Well Scan
                  </Typography>
                  <Typography variant="h6" mb={3}>
                    We will scan your ten fingers and analyze the data so we can
                    generate a report for you.
                  </Typography>
                </Box>
                <Box bgcolor="primary.main">
                  <Typography
                    width="18rem"
                    variant="h4"
                    py={1}
                    textAlign="center"
                    color="white"
                  >
                    ($99.00 value)
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box borderBottom={1} borderColor="#333" py={1} px={5}>
              <Stack
                direction={{ md: "row" }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" fontSize="1.8rem" mt={4}>
                    Custom Solfeggio Music File
                  </Typography>
                  <Typography variant="h6" mb={3}>
                    We will email you a custom meditation music file based on
                    the alignment of your chakras.
                  </Typography>
                </Box>
                <Box bgcolor="primary.main">
                  <Typography
                    width="18rem"
                    variant="h4"
                    py={1}
                    textAlign="center"
                    color="white"
                  >
                    ($99.00 value)
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box borderBottom={1} borderColor="#333" py={1} px={5}>
              <Stack
                direction={{ md: "row" }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" fontSize="1.8rem" mt={4}>
                    22-Page Report on Your Energy Wellness
                  </Typography>
                  <Typography variant="h6" mb={3}>
                    You'll be emailed a 22-page report that explains the scan
                    and gives you more information about different energy
                    centers or meridian pathways.
                  </Typography>
                </Box>
                <Box bgcolor="primary.main">
                  <Typography
                    width="18rem"
                    variant="h4"
                    py={1}
                    textAlign="center"
                    color="white"
                  >
                    ($99.00 value)
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box borderBottom={1} borderColor="#333" py={1} px={5}>
              <Stack
                direction={{ md: "row" }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" fontSize="1.8rem" mt={4}>
                    LIFETIME Access To Our Bio-Well Support App
                  </Typography>
                  <Typography variant="h6" mb={3}>
                    If you have any questions about your report, you can ask
                    them in our support app.
                  </Typography>
                </Box>
                <Box bgcolor="primary.main">
                  <Typography
                    width="18rem"
                    variant="h4"
                    py={1}
                    textAlign="center"
                    color="white"
                  >
                    ($997 value)
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box borderBottom={1} borderColor="#333" py={1} px={5}>
              <Stack
                direction={{ md: "row" }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" fontSize="1.8rem" mt={4}>
                    FREE Access to Our Community "Lightworkers App"
                  </Typography>
                  <Typography variant="h6" mb={3}>
                    You get to mingle with over 500 open-minded wellness
                    practitioners and join regular webinars.
                  </Typography>
                </Box>
                <Box bgcolor="primary.main">
                  <Typography
                    width="18rem"
                    variant="h4"
                    py={1}
                    textAlign="center"
                    color="white"
                  >
                    ($997 value)
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box borderBottom={1} borderColor="#333" py={1} px={5}>
              <Stack
                direction={{ md: "row" }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" fontSize="1.8rem" mt={4}>
                    FREE Access to hundreds of Bio-Well practitioners
                  </Typography>
                  <Typography variant="h6" mb={3}>
                    Get access to hundreds of Bio-Well researchers in fields of
                    water, environment and biofield.
                  </Typography>
                </Box>
                <Box bgcolor="primary.main">
                  <Typography
                    width="18rem"
                    variant="h4"
                    py={1}
                    textAlign="center"
                    color="white"
                  >
                    (Priceless)
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box py={1} px={5}>
              <Typography
                fontSize="1.8rem"
                variant="h6"
                mb={3}
                textAlign={"center"}
                lineHeight="2rem"
              >
                It’s important that you know the enormous value you’ll get with
                your reservation. These numbers are not inflated — they’re an
                honest, actual values, and you can purchase those courses
                separately.
              </Typography>
            </Box>
            <Typography
              variant="h3"
              mb={2}
              textAlign="center"
              color="primary.main"
            >
              Total Value{" "}
              <span style={{ textDecoration: "line-through" }}>$2,291.00</span>
            </Typography>
            <Typography variant="h3" mb={2} textAlign="center">
              Your Early Bird Price
            </Typography>
            <Box bgcolor="#ead212">
              <Typography variant="h2" textAlign="center" fontWeight={600}>
                ONLY $99
              </Typography>
            </Box>
            <div id="profile-section">
              <Typography my={6} variant="h2" textAlign="center">
                BOOK A SESSION NOW
              </Typography>
            </div>
            <Grid container spacing={1}>
              <Grid item md={6}>
                <Stack justifyContent="center" alignItems="center">
                  {data.upload == 0 ? (
                    !data.imageURL || data.imageURL == "" ? (
                      data.sex == "Male" ? (
                        <img
                          src={
                            "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34a0dbca137ef4f425e.png"
                          }
                          width={300}
                          height={300}
                          style={{ display: "block", borderRadius: ".3rem" }}
                        />
                      ) : (
                        <img
                          src={
                            "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34ab7ea181193716085.png"
                          }
                          width={300}
                          height={300}
                          style={{ display: "block", borderRadius: ".3rem" }}
                        />
                      )
                    ) : (
                      <img
                        src={data.imageURL}
                        alt={data.firstname[0]}
                        width={300}
                        height={300}
                        style={{ display: "block", borderRadius: ".3rem" }}
                      />
                    )
                  ) : (
                    <img
                      src={API_URL + "src/" + data.imageURL}
                      alt={data.firstname[0]}
                      width={300}
                      height={300}
                      style={{ display: "block", borderRadius: ".3rem" }}
                    />
                  )}
                  <Typography variant="h4" mt={2} mb={1}>
                    {data?.firstname + " " + data?.lastname}
                  </Typography>
                  <StyledRating
                    co="correctValue"
                    color="primary.main"
                    name="size-medium"
                    defaultValue={data?.review}
                    readOnly
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  <Button
                    href={data.meetinglink}
                    sx={{ mt: 2 }}
                    variant="contained"
                    co="correctValue"
                  >
                    <Typography fontSize={"30px"}>
                      Reserve Your Biofield Scan
                    </Typography>
                  </Button>
                </Stack>
              </Grid>
              <Grid item md={6}>
                <Box p={6} border={1} borderColor="#ddd" borderRadius=".3rem">
                  <Typography variant="h4" textAlign="center" mb={3}>
                    Practitioner Information
                  </Typography>
                  <Stack direction="row" alignItems="center" mb={1}>
                    <Typography variant="h6" width="10rem">
                      Name
                    </Typography>
                    <Typography variant="h6">
                      {data?.firstname + " " + data?.lastname}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" mb={1}>
                    <Typography variant="h6" width="10rem">
                      Address
                    </Typography>
                    <Typography flex={1} variant="h6">
                      {(data?.hide == 1 || data?.availability == "Remote"
                        ? ""
                        : data?.address) +
                        " " +
                        data?.city +
                        " " +
                        data?.state +
                        " " +
                        data?.zipcode +
                        " " +
                        data?.country}
                    </Typography>
                  </Stack>
                  {data?.hide == 1 || data?.availability == "Remote" ? (
                    <></>
                  ) : (
                    <Stack direction="row" alignItems="center" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Email
                      </Typography>
                      <Typography variant="h6">{data?.email}</Typography>
                    </Stack>
                  )}
                  {data?.hide == 1 || data?.availability == "Remote" ? (
                    <></>
                  ) : (
                    <Stack direction="row" alignItems="center" mb={1}>
                      <Typography variant="h6" width="10rem">
                        Phone
                      </Typography>
                      <Typography variant="h6">{data?.phone}</Typography>
                    </Stack>
                  )}
                  <Stack direction="row" mb={1}>
                    <Typography variant="h6" width="10rem">
                      Speciality
                    </Typography>
                    <Stack
                      flex={1}
                      flexWrap="wrap"
                      alignItems={"center"}
                      co="correctValue"
                      direction={"row"}
                    >
                      {data?.specialty.map((item, index) => {
                        return (
                          <Box
                            className="cursor-pointer"
                            key={index}
                            color="primary.main"
                            border={1}
                            co="correctValue"
                            borderColor="primary.main"
                            borderRadius={1}
                            px={0.7}
                            py={0.3}
                            m={0.2}
                          >
                            <Typography fontSize=".9rem" co="correctValue">
                              {item}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Stack>
                  <Stack direction="row" mb={1}>
                    <Typography variant="h6" width="10rem">
                      Tags
                    </Typography>
                    <Stack
                      flex={1}
                      flexWrap="wrap"
                      alignItems={"center"}
                      co="correctValue"
                      direction={"row"}
                    >
                      {data?.tags.map((item, index) => {
                        return (
                          <Box
                            key={index}
                            className="cursor-pointer"
                            color="primary.main"
                            border={1}
                            co="correctValue"
                            borderColor="primary.main"
                            borderRadius={1}
                            px={0.7}
                            py={0.3}
                            m={0.2}
                          >
                            <Typography fontSize=".9rem" co="correctValue">
                              {item}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" mb={1}>
                    <Typography variant="h6" width="10rem">
                      Reviews
                    </Typography>
                    <StyledRating
                      co="correctValue"
                      color="primary.main"
                      name="size-medium"
                      defaultValue={data?.review}
                      readOnly
                      emptyIcon={
                        <StarIcon
                          style={{ opacity: 0.55 }}
                          fontSize="inherit"
                        />
                      }
                    />
                  </Stack>
                  <Stack direction="row" alignItems="center" mb={1}>
                    <Typography variant="h6" width="10rem">
                      Type
                    </Typography>
                    <Typography variant="h6">
                      {data?.availability == "Remote" ? "Remote" : "In-Person"}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <img
              className="w-100"
              style={{ display: "block" }}
              src="../img/cc.jpg"
            />
            <Typography align="center" mt={8}>
              Consumer Testimonials. As with any business-related program, your
              results using the Bio-Well may vary from these consumer
              testimonials. Bio-Well is not a medical instrument, it is not
              designed for medical diagnostics, it measures energy and stress of
              a person. In case of health concerns, please, consult your doctor.
            </Typography>
            <Stack
              flexWrap="wrap"
              direction="row"
              alignItems="center"
              justifyContent="center"
              my={4}
            >
              <Link className="hover-link" href="">
                <Typography align="center" whiteSpace="nowrap">
                  Gaia Healers
                </Typography>
              </Link>
              <Box mx={2} width="1px" height={16} bgcolor="#777"></Box>
              <Link className="hover-link" href="">
                <Typography align="center" whiteSpace="nowrap">
                  Terms of Use
                </Typography>
              </Link>
              <Box mx={2} width="1px" height={16} bgcolor="#777"></Box>
              <Link className="hover-link" href="">
                <Typography align="center" whiteSpace="nowrap">
                  Privacy Policy
                </Typography>
              </Link>
              <Box mx={2} width="1px" height={16} bgcolor="#777"></Box>
              <Link className="hover-link" href="">
                <Typography align="center" whiteSpace="nowrap">
                  Support
                </Typography>
              </Link>
            </Stack>
          </Container>
        </Box>
      ) : (
        <Loading />
      )}
    </main>
  );
}
