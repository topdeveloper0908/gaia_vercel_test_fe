"use client";

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
  Typography,
} = require("@mui/material");

export default function ConfirmDeleteModal({
  open,
  handleConfirm,
  handleClose,
  isDeleting,
  user,
}) {
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
      >
        <h3
          id="parent-modal-title"
          style={{
            padding: "20px",
          }}
        >
          Delete {user.credentials ? 'API' : user.practitioner ? 'Customer' : 'Practitioner'}
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
          <Typography component={"p"}>
            Are you sure you want to delete this {user.credentials ? 'API' : user.practitioner ? 'customer' : 'practitioner'}? <br />
            <strong>
              {user?.firstname} {user?.lastname}
            </strong>
          </Typography>
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
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isDeleting}
            type="submit"
            onClick={() => handleConfirm(user?.id)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
