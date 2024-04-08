
"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { Avatar, Button, Chip, IconButton, Stack } from "@mui/material";
import { Delete, Edit, Star } from "@mui/icons-material";
import { FaRegEdit, FaEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import Link from "next/link";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "User Name",
    numeric: false,
  },
  {
    id: "Address",
    numeric: false,
  },
  {
    id: "Email",
    numeric: false,
  },
  {
    id: "Phone",
    numeric: false,
  },
  {
    id: "Action",
    numeric: false,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead
      sx={{
        borderBottom: "2px solid black",
        fontWeight: "bold",
      }}
    >
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{ fontWeight: "bold" }}
            >
              {headCell.id}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function CustomerTable({
  data = [],
  handleEditModal,
  handleDeleteModal  
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={"medium"}
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={data?.length}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="left">
                    <span
                        style={{
                        marginBottom: ".4rem",
                        lineHeight: "1.3rem",
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        }}
                    >
                        {row.firstname} {row.lastname}
                    </span>
                  </TableCell>
                  <TableCell align="left">
                    <span>
                        {row.address} {row.city} {row.state} {row.zipcode}
                        {row.country}
                    </span>
                  </TableCell>
                  <TableCell align="left">
                    <span>{row.email}</span>
                  </TableCell>
                  <TableCell align="left">
                    <span>{row.phone}</span>
                  </TableCell>
                  <TableCell align="left">
                    <Stack direction="row" spacing={2}>
                    <IconButton
                        variant="contained"
                        sx={{
                          backgroundColor: "#237EEE",
                          color: "white",
                          borderRadius: "7px",
                          width: "35px",
                          height: "35px",
                          ":hover": {
                            backgroundColor: "#1C60B5",
                          },
                        }}
                        href={`/practitioner/customer/${row.id}`}
                      >
                        <FaEye size={20} />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        sx={{
                          backgroundColor: "#67bc46",
                          color: "white",
                          borderRadius: "7px",
                          width: "35px",
                          height: "35px",
                          ":hover": {
                            backgroundColor: "#348514",
                          },
                        }}
                        onClick={() => handleEditModal(row)}
                      >
                        <FaRegEdit size={20} />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        sx={{
                          backgroundColor: "#DD3444",
                          color: "white",
                          borderRadius: "7px",
                          width: "35px",
                          height: "35px",
                          ":hover": {
                            backgroundColor: "#A2111F",
                          },
                        }}
                        onClick={() => handleDeleteModal(row)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>

              );
            })}
            {visibleRows.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        sx={{
          alignItems: "center",
        }}
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
