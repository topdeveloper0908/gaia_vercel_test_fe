"use client";
import React, { use, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import CustomMultiSelect from "@/components/Multiselect";
import axios from "axios";

export default function SignUp() {
  // const { data, error } = useSWR(
  //   "https://trial.mobiscroll.com/content/countries.json",
  //   fetcher
  // );
  const [countries, setCountries] = useState([]);
  const SELECT_TYPES = {
    SPECIALTY: "Specialty",
    TAGS: "Tags",
  };
  const [type, setType] = useState(SELECT_TYPES.SPECIALTY);
  const [selectedSpecialty, setSelectedSpecialty] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios
      .get("https://trial.mobiscroll.com/content/countries.json")
      .then((res) => {
        const data = res.data;
        data.push({ value: "CA", text: "Canada", group: "C" });
        data.sort((a, b) => a.text.localeCompare(b.text));
        setCountries(data);
      });
    axios.get(`${API_URL}metadata`).then((res) => {
      setSpecialtyOptions(res.data.specs);
      setTagsOptions(res.data.tags);
    });
  }, []);

  const handleSelectType = (type) => {
    setType(type);
    setSelectModalOpen(true);
  };

  const [step, setStep] = useState(0);
  const [imageType, setImageType] = useState("linkImage");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // yup
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("First Name is required"),
    lastname: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    phone: Yup.string().required("Phone is required and must be a number"),
    sex: Yup.string(),
    availability: Yup.string().required(),
    address: Yup.string().required(),
    city: Yup.string().required(),
    state: Yup.string(),
    zipcode: Yup.string().required(),
    country: Yup.string().required(),
    imageLink: Yup.string(),
    specialty: Yup.string().required(),
    tags: Yup.string().required(),
  });

  // formik
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    sex: "Male",
    availability: "In-person",
    upload: 0,
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "US",
    imageURL: "",
    specialty: "",
    tags: "",
    type: "Practitioner",
    hide: 0
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    if (imageType === "customImage") {
      const formData = new FormData();
      formData.append("image", selectedImage);
      let res = await axios
        .post(`${API_URL}media`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log("Error uploading file: " + err);
        });
      values.imageURL = res.data;
      values.upload = 1;
    }
    const response = await axios.post(`${API_URL}new`, JSON.stringify(values), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = response.data;
    if (result == "success") {
      setStep(2);
    } else if (result == "duplicated") {
      toast.error("User already exists!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setIsSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    formik.setFieldValue("specialty", selectedSpecialty.join(", "));
  }, [selectedSpecialty]);

  useEffect(() => {
    formik.setFieldValue("tags", selectedTags.join(", "));
  }, [selectedTags]);

  const handleImageField = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <Grid container spacing={0} justifyContent={"center"}>
      <Grid item md={6}>
        <Box
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ padding: 4 }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <img src="../img/logo-1.png" alt="logo" width="300" />
          </Box>
          <Box
            mt={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap={"wrap"}
            sx={{
              color: "black",
            }}
          >
            <img
              style={{
                borderRadius: "50%",
                border: "5px solid rgb(157,157,157)",
                margin: "0 2rem",
              }}
              src="https://biohackingcongress.com/storage/users/June2023/9Q67Ebbs5rPLWWmWGZET.png"
              alt="Avatar"
              width="180"
            />
            <Box>
              <Typography mb={2} variant="h4" fontWeight="600" align="center">
                Nima Farshid, CEO
              </Typography>
              <Typography align="center" maxWidth="30rem">
                "Let's together change the way the world looks at health and
                wellness by creating an integrative holistic network of
                consumers, holistic practitioners, and wellness centers."
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item md={6} bgcolor="#f3f6f8">
        <Box
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {step === 2 ? (
            <Box
              display={"flex"}
              alignContent={"center"}
              flexDirection={"column"}
              justifyContent={"center"}
              sx={{ maxWidth: "30rem" }}
              bgcolor="white"
              className="shadow"
              p={4}
              height={"536px"}
              width={"30rem"}
            >
              <Typography
                my={4}
                variant="h5"
                fontWeight="600"
                align="center"
                color={"black"}
              >
                Thank you for applying! <br /> We'll contact you shortly.
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ maxWidth: "30rem" }}
              bgcolor="white"
              className="shadow"
              p={4}
            >
              {step == 0 ? (
                <>
                  <Typography
                    my={4}
                    variant="h5"
                    fontWeight="600"
                    align="center"
                    color={"black"}
                  >
                    Apply to become a Gaia Healer and feature your practice!
                  </Typography>
                  <TextField
                    size="small"
                    margin="normal"
                    required
                    fullWidth
                    id="firstname"
                    label="First Name"
                    name="firstname"
                    autoComplete="firstname"
                    autoFocus
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.firstname}
                  />
                  <TextField
                    size="small"
                    margin="normal"
                    required
                    fullWidth
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    autoComplete="lastname"
                    autoFocus
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.lastname}
                  />
                  <TextField
                    size="small"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <TextField
                    size="small"
                    margin="normal"
                    required
                    fullWidth
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    autoFocus
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                </>
              ) : (
                <>
                  <Stack direction="row" spacing={2}>
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
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Type
                      </InputLabel>
                      <Select
                        size="small"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Type"
                        name="availability"
                        onChange={formik.handleChange}
                        value={formik.values.availability}
                      >
                        <MenuItem value="In-person">In-Person</MenuItem>
                        <MenuItem value="Remote">Remote</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <TextField
                    size="small"
                    margin="normal"
                    required
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
                  <Stack direction="row" spacing={2} mt={1}>
                    <TextField
                      size="small"
                      margin="normal"
                      required
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
                      margin="normal"
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
                  <Stack direction="row" spacing={2} mt={2}>
                    <TextField
                      size="small"
                      margin="normal"
                      required
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
                      <InputLabel id="demo-simple-select-label">
                        Country
                      </InputLabel>
                      <Select
                        size="small"
                        margin="normal"
                        required
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
                          <MenuItem value={country.value}>
                            {country.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack my={2}>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      defaultValue="linkImage"
                      name="row-radio-buttons-group"
                      onChange={(e) => setImageType(e.target.value)}
                      sx={{
                        color: "black",
                      }}
                    >
                      <FormControlLabel
                        value="linkImage"
                        control={<Radio />}
                        label="Use Image Link"
                        name="imageType"
                        color="black"
                        checked={imageType === "linkImage"}
                      />
                      <FormControlLabel
                        value="customImage"
                        control={<Radio />}
                        label="Use Custom Image"
                        name="imageType"
                        checked={imageType === "customImage"}
                      />
                    </RadioGroup>
                  </Stack>
                  {imageType === "linkImage" ? (
                    <Stack my={2}>
                      <TextField
                        size="small"
                        required
                        fullWidth
                        id="imageURL"
                        name="imageURL"
                        label="Image URL"
                        autoComplete="imageLink"
                        autoFocus
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.imageLink}
                      />
                    </Stack>
                  ) : (
                    <Stack my={2}>
                      <TextField
                        size="small"
                        required
                        fullWidth
                        id="imageURL"
                        name="imageURL"
                        autoComplete="imageLink"
                        autoFocus
                        type="file"
                        onChange={handleImageField}
                      />
                    </Stack>
                  )}
                  <Stack my={2}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Account Type
                      </InputLabel>
                      <Select
                        size="small"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="type"
                        label="Account Type"
                        onChange={formik.handleChange}
                        value={formik.values.type}
                      >
                        <MenuItem value="Practitioner">Practitioner</MenuItem>
                        <MenuItem value="Business">Business</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack my={2}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Hide Profile Info
                      </InputLabel>
                      <Select
                        size="small"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="type"
                        label="Hide Profile Info"
                        onChange={formik.handleChange}
                        value={formik.values.hide}
                      >
                        <MenuItem value="0">Show</MenuItem>
                        <MenuItem value="1">Hide</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack my={2}>
                    <TextField
                      size="small"
                      required
                      fullWidth
                      id="specialty"
                      name="specialty"
                      label="Select Specialty"
                      autoComplete="specialty"
                      autoFocus
                      type="text"
                      onClick={() => {
                        handleSelectType(SELECT_TYPES.SPECIALTY);
                      }}
                      value={selectedSpecialty.join(", ")}
                    />
                  </Stack>
                  <Stack my={2}>
                    <TextField
                      size="small"
                      required
                      fullWidth
                      id="tags"
                      name="tags"
                      label="Tags"
                      autoComplete="tags"
                      autoFocus
                      type="text"
                      onClick={() => {
                        handleSelectType(SELECT_TYPES.TAGS);
                      }}
                      value={selectedTags.join(", ")}
                    />
                  </Stack>
                </>
              )}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <Button
                  type="button"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    setStep(step === 0 ? 1 : 0);
                  }}
                  disabled={
                    formik.errors.firstname ||
                    formik.errors.lastname ||
                    formik.errors.email ||
                    formik.errors.phone
                  }
                >
                  {step === 0 ? "Next" : "Back"}
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!formik.isValid || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
      <SelectModal
        open={selectModalOpen}
        handleClose={() => setSelectModalOpen(false)}
        selected={
          type === SELECT_TYPES.SPECIALTY ? selectedSpecialty : selectedTags
        }
        setSelected={
          type === SELECT_TYPES.SPECIALTY
            ? setSelectedSpecialty
            : setSelectedTags
        }
        type={type}
        options={
          type === SELECT_TYPES.SPECIALTY ? specialtyOptions : tagsOptions
        }
      />
    </Grid>
  );
}

export function SelectModal({
  open,
  handleClose,
  style,
  selected,
  setSelected,
  type,
  options,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        color: "black",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: 24,
          width: 450,
        }}
      >
        <h3
          id="parent-modal-title"
          style={{
            padding: "20px",
          }}
        >
          Select {type}
        </h3>
        <Divider component={"div"} fullWidth />

        <Box
          style={{
            padding: "15px",
          }}
        >
          <CustomMultiSelect
            selected={selected}
            setSelected={setSelected}
            type={type}
            options={options}
          />
        </Box>

        <Divider component={"div"} fullWidth />
        <Stack direction="row" spacing={1} justifyContent={"center"} py={2}>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setSelected([]);
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
