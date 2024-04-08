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
  Switch,
  InputLabel,
} = require("@mui/material");

export default function UploadModal({
  open,
  handleClose,
  isUploading,
  handleUpload,
  setFile,
  setReplace,
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
          Upload Practitioners
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
          <FormControl>
            <FormControlLabel
              control={
                <Switch onChange={(e) => setReplace(e.target.checked)} />
              }
              label="Replace"
            />
          </FormControl>
          <TextField
            id="file"
            type="file"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setFile(e.target.files[0])}
          />
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
            disabled={isUploading}
            type="submit"
            onClick={() => handleUpload()}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
