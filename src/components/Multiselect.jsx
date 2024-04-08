import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import { Delete, RemoveCircleOutline } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

function CustomMultiSelect({
  options = [],
  selected = [],
  setSelected,
  type = "",
}) {
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(value);
  };

  const [customText, setCustomText] = useState("");

  return (
    <Stack spacing={1}>
      <FormControl
        style={{
          width: "100%",
        }}
      >
        <InputLabel id="mutiple-select-label">Select {type}</InputLabel>
        <Select
          size="small"
          labelId="mutiple-select-label"
          multiple
          value={selected}
          onChange={handleChange}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          variant={"filled"}
        >
          <MenuItem value="all">
            <ListItemIcon>
              <Checkbox
                checked={isAllSelected}
                indeterminate={
                  selected.length > 0 && selected.length < options.length
                }
              />
            </ListItemIcon>
            <ListItemText
              // classes={{ primary: classes.selectAllText }}
              primary="Select All"
            />
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <ListItemIcon>
                <Checkbox checked={selected.indexOf(option) > -1} />
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack
        spacing={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <FormControl
          sx={{
            flex: 1,
          }}
        >
          <TextField
            fullWidth
            id={"custom-" + type}
            label={"Custom " + type}
            name={"custom-" + type}
            type="text"
            size="small"
            onChange={(e) => setCustomText(e.target.value)}
          />
        </FormControl>
        <Button
          variant="contained"
          sx={{
            width: "fit-content",
            margin: 0,
          }}
          onClick={() => {
            if (customText) {
              setSelected([...selected, customText]);
              setCustomText("");
            }
          }}
        >
          Add
        </Button>
      </Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        height={"250px"}
        borderRadius={1}
        border={"2px solid #9E9E9E"}
        flexWrap={"wrap"}
        overflow={"auto"}
        p={1}
      >
        {selected.map((item) => (
          <Chip
            label={item}
            onDelete={() => {
              setSelected(selected.filter((i) => i !== item));
            }}
            deleteIcon={<RemoveCircleOutline />}
            color="primary"
            variant="outlined"
            sx={{
              margin: 0.2,
              fontWeight: "500",
              borderRadius: "5px",
            }}
            size="medium"
            key={item}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default CustomMultiSelect;
