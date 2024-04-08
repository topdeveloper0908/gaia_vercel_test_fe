"use client";
import React, { use, useState, useEffect } from "react";
import { useFormik } from "formik";
import Cookies from "js-cookie";
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

export default function AddPractitioner({
  addPractitioner,
  userProfile,
  isUser,
  handleUpdateProfile,
}) {
  const [countries, setCountries] = useState([]);
  const SELECT_TYPES = {
    SPECIALTY: "Specialty",
    TAGS: "Tags",
  };
  const token = Cookies.get("token");
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

  const [imageType, setImageType] = useState("linkImage");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // yup
  const validationSchema = Yup.object().shape({
    firstname: Yup.string(),
    lastname: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),
    sex: Yup.string(),
    availability: Yup.string(),
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipcode: Yup.string(),
    country: Yup.string(),
    specialty: Yup.string(),
    tags: Yup.string(),
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
    rank: 1,
    review: 0,
    meetinglink: "",
    profileLink: "",
    status: "pending",
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
        .catch((err, status) => {
          toast.error("File Upload Failed!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setIsSubmitting(false);
          console.log("Error uploading file: " + err);
        });
      values.imageURL = res.data;
      values.upload = 1;
    }
    if (isUser) {
      values.upload = 0 ;
      await handleUpdateProfile(values);
      setIsSubmitting(false);
      return;
    }
    const response = await axios.post(`${API_URL}admin_new`, JSON.stringify(values),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`
        },
      }
    );

    const result = response.data;
    if (result == "duplicated") {
      toast.error("Practitioner already exists!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.success("Practitioner registered successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      values.id=result;
      addPractitioner(values);
    }
    setIsSubmitting(false);
  };

  const formik = useFormik({
    initialValues: isUser ? userProfile : initialValues,
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

  useEffect(() => {
    if (isUser) {
      formik.setValues(userProfile);
      setSelectedSpecialty(userProfile?.specialty?.split(", ") || []);
      setSelectedTags(userProfile?.tags?.split(", ") || []);
      if (userProfile?.country?.length > 2) {
        formik.setFieldValue(
          "country",
          countries.find((c) => c.text === userProfile.country).value
        );
      }
    }
  }, [userProfile]);

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
            onChange={formik.handleChange}
            value={formik.values.phone}
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
        <Stack direction="row" spacing={2} alignItems={"center"}>
          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
            Avatar
          </InputLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            defaultValue="linkImage"
            name="row-radio-buttons-group"
            onChange={(e) => setImageType(e.target.value)}
            sx={{
              color: "black",
              alignItems: "center",
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
          <Stack>
            <TextField
              size="small"
              id="imageURL"
              name="imageURL"
              label="Image URL"
              autoComplete="imageLink"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.imageURL}
            />
          </Stack>
        ) : (
          <Stack>
            <TextField
              size="small"
              id="imageURL"
              name="imageURL"
              autoComplete="imageLink"
              type="file"
              onChange={handleImageField}
            />
          </Stack>
        )}
        <Stack>
          <TextField
            size="small"
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
        <Stack>
          <TextField
            size="small"
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
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
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
        <Stack>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" size="small">
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
          <TextField
            size="small"
            id="description"
            label="Description"
            name="description"
            type="text"
            sx={{
              visibility: "hidden",
            }}
          />
        </Stack>
        <Stack>
          <FormControl>
            <InputLabel id="review-select-label" size="small">
              Review
            </InputLabel>
            <Select
              fullWidth
              size="small"
              labelId="review-select-label"
              id="review"
              label="Review"
              name="review"
              disabled = {isUser ? true : false}
              onChange={formik.handleChange}
              value={formik.values.review}
            >
              <MenuItem value="0">0</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <FormControl>
            <InputLabel id="rank-select-label" size="small">
              Rank
            </InputLabel>
            <Select
              fullWidth
              size="small"
              labelId="rank-select-label"
              id="rank"
              label="Rank"
              name="rank"
              disabled = {isUser ? true : false}
              onChange={formik.handleChange}
              value={formik.values.rank}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <TextField
            size="small"
            id="meetinglink"
            label="Meeting Link"
            name="meetinglink"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.meetinglink}
          />
        </Stack>
        <Stack>
          <TextField
            size="small"
            id="profileLink"
            label="Profile Link"
            name="profileLink"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.profileLink}
          />
        </Stack>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" size="small">
            Hide Profile Info
          </InputLabel>
          <Select
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="hide"
            label="Hide Profile Info"
            onChange={formik.handleChange}
            value={formik.values.hide}
          >
            <MenuItem value="0">Show</MenuItem>
            <MenuItem value="1">Hide</MenuItem>
          </Select>
        </FormControl>
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
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <Button
          type="submit"
          variant="contained"
          sx={{ m: 4, py: 2, px: 4 }}
          disabled={!formik.isValid || isSubmitting}
          size="large"
        >
          {isSubmitting ? "Submitting..." : isUser ? "Update" : "Add"}
        </Button>
      </Box>
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
