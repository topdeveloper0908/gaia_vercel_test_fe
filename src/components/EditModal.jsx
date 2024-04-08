"use client";

import { API_URL } from "@/constants/constants";
import { useFormik } from "formik";
import { use, useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { SelectModal } from "@/app/register/page";

const {
  Modal,
  Box,
  Divider,
  Button,
  Stack,
  TextField,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
} = require("@mui/material");

export default function EditModal({
  open,
  handleConfirm,
  handleClose,
  isSubmitting,
  user,
  setUser,
}) {
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

  const formik = useFormik({
    initialValues: user,
    onSubmit: (values) => {
      handleConfirm(values);
    },
  });

  useEffect(() => {
    console.log({ user });
    formik.setValues(user);
    setSelectedSpecialty(user?.specialty?.split(", ") || []);
    setSelectedTags(user?.tags?.split(", ") || []);
    if (user?.country?.length > 2) {
      formik.setFieldValue(
        "country",
        countries.find((c) => c.text === user.country).value
      );
    }
  }, [user]);

  useEffect(() => {
    formik.setFieldValue("specialty", selectedSpecialty.join(", "));
  }, [selectedSpecialty]);

  useEffect(() => {
    formik.setFieldValue("tags", selectedTags.join(", "));
  }, [selectedTags]);

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
          Edit Practitioner
        </h3>
        <Divider component={"div"} fullWidth />
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
          <Stack>
            <TextField
              size="small"
              fullWidth
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
          <Stack spacing={2} direction="row">
            <FormControl
              sx={{
                width: "33%",
              }}
            >
              <InputLabel id="demo-simple-select-label">
                Hide Profile Info
              </InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="hide"
                label="Hide Profile"
                name="hide"
                onChange={formik.handleChange}
                value={formik.values.hide}
              >
                <MenuItem value="0">Show</MenuItem>
                <MenuItem value="1">Hide</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: "33%",
              }}
            >
              <InputLabel id="type-select-label" size="small">
                Type
              </InputLabel>
              <Select
                size="small"
                labelId="type-select-label"
                id="type-select"
                name="availability"
                onChange={formik.handleChange}
                value={formik.values.availability}
              >
                <MenuItem value="In-person">In-Person</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: "33%",
              }}
            >
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
          <TextField
            size="small"
            fullWidth
            id="specialty"
            name="specialty"
            label="Specialty"
            autoFocus
            type="text"
            onClick={() => {
              handleSelectType(SELECT_TYPES.SPECIALTY);
            }}
            value={formik.values.specialty}
          />
          <TextField
            size="small"
            fullWidth
            id="tags"
            name="tags"
            label="Tags"
            autoComplete="tags"
            type="text"
            onClick={() => {
              handleSelectType(SELECT_TYPES.TAGS);
            }}
            value={formik.values.tags}
          />
          <Stack>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Account Type
              </InputLabel>
              <Select
                size="small"
                label="Account Type"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="type"
                onChange={formik.handleChange}
                value={formik.values.type}
              >
                <MenuItem value="Practitioner">Practitioner</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <TextField
            size="small"
            id="profileLink"
            label="Profile Link"
            name="profileLink"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.profileLink}
          />
          <TextField
            size="small"
            id="meetinglink"
            label="Meeting Link"
            name="meetinglink"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.meetinglink}
          />
          <Stack direction="row" spacing={2}>
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
                margin="normal"
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
            />
            <FormControl
              sx={{
                width: "48%",
              }}
            >
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                size="small"
                labelId="status-select-label"
                id="status"
                label="Status"
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl
              sx={{
                width: "48%",
              }}
            >
              <InputLabel id="rank-select-label" size="small">
                Rank
              </InputLabel>
              <Select
                size="small"
                labelId="rank-select-label"
                id="rank"
                label="Rank"
                name="rank"
                onChange={formik.handleChange}
                value={formik.values.rank}
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: "48%",
              }}
            >
              <InputLabel id="review-select-label" size="small">
                Review
              </InputLabel>
              <Select
                size="small"
                labelId="review-select-label"
                id="review"
                label="Review"
                name="review"
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
        </Box>
        <Divider component={"div"} fullWidth />
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
      </Box>
    </Modal>
  );
}
