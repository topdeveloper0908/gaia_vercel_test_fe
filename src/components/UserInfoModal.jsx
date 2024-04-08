"use client";

import { API_URL } from "@/constants/constants";
import styled from "@emotion/styled";
import { Close, CloseOutlined, Star } from "@mui/icons-material";

const {
  Modal,
  Box,
  Divider,
  Button,
  Stack,
  Typography,
  Avatar,
  Rating,
  IconButton,
} = require("@mui/material");

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#67bc46",
  },
});

export default function UserInfoModal({ open, handleClose, user }) {
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
        border: "none",
        outline: "none",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 4,
          p: 10,
          outline: "none",
          boxShadow: 24,
          width: "fit-content",
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            color: "black",
          }}
        >
          <CloseOutlined />
        </IconButton>
        <Box
          sx={{
            gap: 7,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {user.upload == 0 ? (
            !user.imageURL || user.imageURL == "" ? (
              user.sex == "Male" ? (
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
              <Avatar src={user.imageURL} sx={{ width: 250, height: 250 }} />
            )
          ) : (
            <Avatar
              src={API_URL + "src/" + user.imageURL}
              sx={{ width: 250, height: 250 }}
            />
          )}
          <Box
            sx={{
              maxWidth: "350px",
            }}
          >
            <Typography variant="h5" co="correctValue" fontWeight={700}>
              {user.firstname + " " + user.lastname}
            </Typography>
            <Typography
              variant="h6"
              co="correctValue"
              fontWeight={500}
              mb={0.5}
            >
              {user.city +
                " " +
                user.state +
                " " +
                user.zipcode +
                " " +
                user.country}
            </Typography>
            <StyledRating
              co="correctValue"
              color="primary.main"
              name="size-medium"
              defaultValue={user.review == null ? 0 : user.review}
              readOnly
              emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            <Stack spacing={1} co="correctValue" direction={"row"}>
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
                {user?.specialty?.map((item, subIndex) => {
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
                      <Typography fontSize=".7rem" co="correctValue">
                        {item}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
            <Stack mt={0.5} spacing={1} direction={"row"} co="correctValue">
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
                {user?.tags?.map((item, subIndex) => {
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
                      <Typography co="correctValue" fontSize=".7rem">
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
                href={user.meetinglink}
                variant="contained"
                co="correctValue"
              >
                Schedule a Meeting
              </Button>
              <Button
                href={`/practitioner/profile/${user.id}`}
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
        </Box>
      </Box>
    </Modal>
  );
}
