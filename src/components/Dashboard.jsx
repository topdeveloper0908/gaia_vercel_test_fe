"use client";
import * as React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

import FileSaver from 'file-saver';
import { toast } from "react-toastify";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Button, Stack } from "@mui/material";

import RefreshIcon from '@mui/icons-material/Refresh';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import { Add, House, Logout } from "@mui/icons-material";

import CustomTable from "@/components/CustomTable";
import Loading from "@/components/Loading";
import { API_URL } from "@/constants/constants";
import EditModal from "@/components/EditModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import AddPractitioner from "@/components/AddPractitioener";
import AddCustomer from "@/components/customer/AddCustomer";
import EditCustomerModal from "@/components/customer/EditCustomerModal";
import CustomerTable from "@/components/customer/CustomerTable";
import UploadModal from "./UploadModal";

// import sampleData from '@/Json/data.json';
// import products from '@/Json/products.json';
// import meridianData from '@/Json/meridian.json';


const drawerWidth = 300;
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

export default function Dashboard({ isUser, isCustomer }) {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [customerData, setCustomerData] = React.useState([]);
  const [dataTmp, setDataTmp] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [userProfile, setuserProfile] = React.useState({});
  const token = Cookies.get("token");
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editUser, setEditUser] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deleteUser, setDeleteUser] = React.useState({});
  const [deleteCustomer, setDeleteCustomer] = React.useState({});
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [policyCheck, setPolicyCheck] = React.useState(false);
  const [page, setPage] = React.useState("home");

  const [excelKeys, setExcelKeys] = React.useState([]);
  const [excelData, setExcelData] = React.useState([]);
  const [fileCount, setFileCount] = React.useState(0);

  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [replace, setReplace] = React.useState(false);

  const handleEditModal = (user) => {
    setEditUser(user);
    setOpenEditModal(true);
  };

  const handleDeleteModal = (user) => {
    if(!isUser) {
      setDeleteUser(user);
    } else {
      setDeleteCustomer(user);
    }
    setOpenDeleteModal(true);
  };

  function handleUpload(e) {
    try {
      if (!file) {
        toast.error("Please select a file");
        return;
      }
      setIsUploading(true);
      var reader = new FileReader();
      var excelCheck = true;
      var excelTypes = {
        TYPE1: "1",
        TYPE2: "2",
      };
      var excelType = "";
      var excelTemplate = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Address",
        "City",
        "State",
        "Zipcode",
        "Country",
        "ImageURL",
        "Specialty",
        "Tags",
        "MeetingLink",
        "Sex",
      ];
      var excelTemplate2 = [
        // Customer ID,First Name,Last Name,Email,Accepts Email Marketing,Company,Address1,Address2,City,Province,Province Code,Country,Country Code,Zip,Phone,Accepts SMS Marketing,Total Spent,Total Orders,Tags,Note,Tax Exempt
        "Customer ID",
        "First Name",
        "Last Name",
        "Email",
        "Accepts Email Marketing",
        "Company",
        "Address1",
        "Address2",
        "City",
        "Province",
        "Province Code",
        "Country",
        "Country Code",
        "Zip",
        "Phone",
        "Accepts SMS Marketing",
        "Total Spent",
        "Total Orders",
        "Tags",
        "Note",
        "Tax Exempt",
      ];
      reader.onload = async function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var sheetName = workbook.SheetNames[0];
        var sheet = workbook.Sheets[sheetName];
        var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // excelTemplate.forEach((element, index) => {
        //   if (element != jsonData[0][index]) {
        //     excelCheck = false;
        //   }
        // });
        if (
          jsonData[0].length == 21 &&
          jsonData[0].every((value, index) => value === excelTemplate2[index])
        ) {
          excelCheck = true;
          excelType = excelTypes.TYPE2;
        } else if (
          jsonData[0].length == 14 &&
          jsonData[0].every((value, index) => value === excelTemplate[index])
        ) {
          excelCheck = true;
          excelType = excelTypes.TYPE1;
        } else {
          excelCheck = false;
        }
        if (excelCheck == false) {
          toast.error("Invalid Excel Template");
          return;
        } else {
          var objectData = jsonData.map((row) => {
            var obj = {};
            jsonData[0].forEach((key, i) => (obj[key] = row[i]));
            return obj;
          });
          if (excelType == excelTypes.TYPE2) {
            objectData = objectData.map((row) => {
              return {
                "First Name": row["First Name"],
                "Last Name": row["Last Name"],
                Email: row["Email"],
                Phone: row["Phone"],
                Address: row["Address1"],
                City: row["City"],
                State: row["Province"],
                Zipcode: row["Zip"],
                Country: row["Country"],
                ImageURL: "",
                Specialty: "",
                Tags: row["Tags"],
                MeetingLink: "",
              };
            });
          }
          const response = await axios.post(`${API_URL}updateDB`, {
            data: objectData,
            replace: replace,
          }, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`
            },
          });
          const result = response.data;
          if (result == "success") {
            toast.success("Data uploaded successfully");
            setOpenUploadModal(false);

            getData();
          }
        }
        setIsUploading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  }

  const handleSaveUser = async (newuser) => {
    setIsSubmitting(true);
    await axios
      .post(`${API_URL}update`, newuser, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        toast.success(
          `${isUser ? "Profile" : "Practitioner"} updated successfully`
        );
        if (!isUser) {
          setOpenEditModal(false);
          // set new data
          let newData = data.map((user) => {
            if (user.id == newuser.id) {
              return newuser;
            }
            return user;
          });
          setData(newData);
          setDataTmp(newData);
          setOpenEditModal(false);
        } else {
          setuserProfile(newuser);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update user");
      });
    setIsSubmitting(false);
  };

  const handleDeleteUser = async (userId) => {
    setIsDeleting(true);
    await axios
      .post(
        `${API_URL}remove`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("User deleted successfully");
        setOpenDeleteModal(false);
        // set new data
        let newData = data.filter((user) => user.id != userId);
        setData(newData);
        setDataTmp(newData);
        setOpenDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete user");
      });
    setIsDeleting(false);
  };

  const getData = async () => {
    await axios
      .get(`${API_URL}all`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        console.log('res', res.data);
        setData(res.data);
        setDataTmp(res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          window.location.href = "/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  const getUser = async () => {
    await axios
      .get(`${API_URL}user`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setuserProfile(res.data[0]);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          window.location.href = "/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  React.useEffect(() => {
    if(!isUser) {
      getData();
    } else {
      getUser();
      getCustomers();
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  function addPractitioner(practitioner) {
    setData([...data, practitioner]);
    setDataTmp([...dataTmp, practitioner]);
  }

  const searchPractitioner = (event) => {
    setData(dataTmp);
    setSearch(event.target.value)
  }

  React.useEffect(() => {
    if(search === '') {
      return;
    } else {
      var tmp = [];
      data.forEach(element => {
        if( element.firstname.toLowerCase().indexOf(search) > -1 || 
            element.lastname.toLowerCase().indexOf(search) > -1 ||
            element.specialty.toLowerCase().indexOf(search) > -1 || 
            element.tags.toLowerCase().indexOf(search) > -1 ||
            element.city.toLowerCase().indexOf(search) > -1 || 
            element.address.toLowerCase().indexOf(search) > -1) {
          tmp.push(element);
        }
      });
      setData(tmp);
    }
  }, [search]);

  // Customer

  const getCustomers = async () => {
    await axios
      .get(`${API_URL}user/customers`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        console.log('customers', res.data);
        setCustomerData(res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          window.location.href = "/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  function addCustomer(customer) {
    setCustomerData([...customerData, customer]);
  }

  const handleSaveCustomer = async (newCustomer) => {
    setIsSubmitting(true);
    await axios
      .post(`${API_URL}customer/update`, newCustomer, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`
        },
      })
      .then((res) => {
        newCustomer.b_token = res.data;
        toast.success(
          `Customer updated successfully`
        );
        if (isUser) {
          setOpenEditModal(false);
          // set new data
          let newData = customerData.map((user) => {
            if (user.id == newCustomer.id) {
              return newCustomer;
            }
          });
          setCustomerData(newData);
        } else {
          setuserProfile(newCustomer);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update user");
      });
    setIsSubmitting(false);
  };

  const handleDeleteCustomer = async (customerId) => {
    setIsDeleting(true);
    console.log('selected', customerId);
    await axios
      .post(
        `${API_URL}customer/remove`,
        {
          id: customerId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Customer deleted successfully");
        setOpenDeleteModal(false);
        // set new data
        let newData = customerData.filter((user) => user.id != customerId);
        setCustomerData(newData);
        setOpenDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete customer");
      });
    setIsDeleting(false);
  };

  React.useEffect(() => {
    if(page=='home') {
      setData(dataTmp);
    }
  }, [page]);


  // Practitioner

  const generateAndDownloadExcel = () => {
    var data = [];
    excelKeys.forEach((element, index) => {
      data.push([element, excelData[index] < 0 ? '' : Number(excelData[index]/fileCount).toFixed(2)])
    });
    console.log('result', excelKeys);
    console.log('result', fileCount);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
  
    FileSaver.saveAs(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
      'average.xlsx'
    );
  };

  const generateAndDownloadPDF = () => {

    const pdf = new PDFDocument();
    const buffers = [];

    pdf.on('data', buffers.push.bind(buffers));
    pdf.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Create a downloadable link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tuto1.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up after download
    });l

    pdf.fontSize(16).font('Arial').text(firstName + ' ' + lastName, 20, 20);
    pdf.text(email, 20, 30);

    let setY = 40;
    sampleData.forEach(tmp => {
        let activeIndex = 0;
        tmp.products.forEach(subTmp => {
            let averageValue;
            if (data.length === 1483 && tmp.index > 127) {
                averageValue = Math.round(data[tmp.index] / fileCount, 2);
            } else {
                averageValue = Math.round(data[tmp.index + 1] / fileCount, 2);
            }

            if (subTmp.condition === 'under' && subTmp.value >= averageValue) {
                if (setY + 29 > 250) {
                    setY = 20;
                    pdf.addPage();
                }

                if (activeIndex === 0) {
                    pdf.fontSize(20).font('Arial').underline(12, setY + 8, tmp.key);
                    pdf.fillColor(averageValue < 1 ? 'red' : 'black');
                    setY += 15;
                }

                pdf.image(`../img/static/products/${products[subTmp.id].img}`, 10, setY, { width: 40, height: 40 });
                pdf.fontSize(16).font('Arial').fillColor('blue').text(products[subTmp.id].name, 55, setY + 8);
                pdf.fontSize(12).font('Arial').fillColor('black').text(distID === '' ? `https://lifewave.com/gaiahealers${products[subTmp.id].link}` : `https://lifewave.com/${distID}${products[subTmp.id].link}`, 55, setY + 13);
                pdf.fontSize(10).font('Arial').x = 55;
                setY += 16;
                pdf.y = setY;
                pdf.multiCell(130, 4, subTmp.description, { border: 0, align: 'left', fill: false });
                setY += 29;
                activeIndex++;
            } else if (subTmp.condition === 'over' && subTmp.value <= averageValue) {
                if (setY + 29 > 250) {
                    setY = 20;
                    pdf.addPage();
                }

                if (activeIndex === 0) {
                    pdf.fontSize(20).font('Arial').underline(12, setY + 8, tmp.key);
                    pdf.fillColor(averageValue > 7 ? '#ffab10' : 'black');
                    setY += 15;
                }

                pdf.image(`../img/products/${products[subTmp.id].img}`, 10, setY, { width: 40, height: 40 });
                pdf.fontSize(16).font('Arial').fillColor('blue').text(products[subTmp.id].name, 55, setY + 8);
                pdf.fontSize(12).font('Arial').fillColor('black').text(distID === '' ? `https://lifewave.com/gaiahealers${products[subTmp.id].link}` : `https://lifewave.com/${distID}${products[subTmp.id].link}`, 55, setY + 13);
                pdf.fontSize(10).font('Arial').x = 55;
                setY += 16;
                pdf.y = setY;
                pdf.multiCell(130, 4, subTmp.description, { border: 0, align: 'left', fill: false });
                setY += 29;
                activeIndex++;
            } else if (subTmp.condition === 'under or over' && (averageValue <= subTmp.value[0] || subTmp.value[1] <= averageValue)) {
                if (setY + 29 > 250) {
                    setY = 20;
                    pdf.addPage();
                }

                if (activeIndex === 0) {
                    pdf.fontSize(20).font('Arial');
                    if (averageValue <= subTmp.value[0]) {
                        pdf.fillColor(averageValue < 1 ? 'red' : 'black');
                    } else if (subTmp.value[1] <= averageValue) {
                        pdf.fillColor(averageValue > 7 ? '#ffab10' : 'black');
                    } else {
                        pdf.fillColor('black');
                    }
                    pdf.underline(12, setY + 8, tmp.key);
                    setY += 15;
                }

                pdf.image(`../img/products/${products[subTmp.id].img}`, 10, setY, { width: 40, height: 40 });
                pdf.fontSize(16).font('Arial').fillColor('blue').text(products[subTmp.id].name, 55, setY + 8);
                pdf.fontSize(12).font('Arial').fillColor('black').text(distID === '' ? `https://lifewave.com/gaiahealers${products[subTmp.id].link}` : `https://lifewave.com/${distID}${products[subTmp.id].link}`, 55, setY + 13);
                pdf.fontSize(10).font('Arial').x = 55;
                setY += 16;
                pdf.y = setY;
                const desc = Buffer.from(subTmp.description, 'utf-8').toString();
                pdf.multiCell(130, 4, desc, { border: 0, align: 'left', fill: false });
                setY += 29;
                activeIndex++;
            }
        });
    });

    pdf.addPage();
    setY = 20;
    pdf.fontSize(18).font('Arial').text('Meridian Charts', 190, { align: 'center' });
    setY += 10;

    for (let tmp = 0; tmp < 3; tmp++) {
        pdf.image(`../img/img/${meridianData[tmp * 4].img}`, 10, setY, { width: 40, height: 60 });
        pdf.text(10, setY + 70, meridianData[tmp * 4].name);
        pdf.image(`../img/img/${meridianData[tmp * 4 + 1].img}`, 60, setY, { width: 40, height: 60 });
        pdf.text(60, setY + 70, meridianData[tmp * 4 + 1].name);
        pdf.image(`../img/img/${meridianData[tmp * 4 + 2].img}`, 110, setY, { width: 40, height: 60 });
        pdf.text(110, setY + 70, meridianData[tmp * 4 + 2].name);
        pdf.image(`../img/img/${meridianData[tmp * 4 + 3].img}`, 160, setY, { width: 40, height: 60 });
        pdf.text(160, setY + 70, meridianData[tmp * 4 + 3].name);
        setY += 80;
    }

    pdf.addPage();
    setY = 20;
    pdf.fontSize(18).font('Arial').text('Disclaimer', 190, { align: 'center' });
    setY += 10;
    pdf.fontSize(12).font('Arial').text(`The statements on LifeWave products on its websites or associated materials have not been evaluated by any regulatory authority and are not intended to diagnose, treat, cure or prevent any disease or medical condition. The content provided by LifeWave is presented in summary form, general in nature, and provided for informational purposes only. Do not disregard any medical advice you have received or delay in seeking it because of something you have read on our websites or associated materials. Please consult your own physician or appropriate health care provider about the applicability of any opinions or recommendations with respect to your own symptoms or medical conditions as these diseases commonly present with variable signs and symptoms. Always consult with your physician or other qualified health care provider before embarking on a new treatment, diet, or fitness program. We assume no liability or responsibility for damage or injury to persons or property arising from any use of any product, information, idea, or instruction contained in the materials provided to you. LifeWave reserves the right to change or discontinue at any time any aspect or feature containing our information.`, 190, { align: 'center' });

    pdf.end();
    return true;
  };

  // File Input
  const handleFileChange = (event) => {
    const uploadedFiles = event.target.files;

    let fileIndex = 0;
    let averageKeyData = [];
    let averageData = [];
    setFileCount(uploadedFiles.length);

    const processFile = (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        const rows = fileContent.split('\n');
        rows.forEach((row, rowIndex) => {
          const data = row.split(',');

          if (fileIndex === 0) {
            averageKeyData.push(getKey(data));
            averageData.push(getValue(data));
          } else {
            averageData[rowIndex] += getValue(data);
          }
        });
        fileIndex++;
        if(fileIndex === uploadedFiles.length) {
          setExcelKeys(averageKeyData);
          setExcelData(averageData);
        }
        console.log(averageData, averageKeyData);
      };

      reader.readAsText(file);
    };

    // Process each uploaded file
    for (let i = 0; i < uploadedFiles.length; i++) {
      processFile(uploadedFiles[i]);
    }
  };
  
  function getValue(rowData) {
    function isFloat(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    if (rowData.length === 1) {
        const arr = rowData[0].split(';');
        if (arr[2] === '') {
            return -100;
        } else if (isFloat(arr[2])) {
            return Math.round(parseFloat(arr[2]) * 100) / 100;
        } else {
            return -100;
        }
    } else if (rowData.length > 1) {
        let tmpIndex = 0;
        for (const tmp of rowData) {
            const arr = tmp.split(';');
            for (const subTmp of arr) {
                if (isFloat(subTmp) && tmpIndex > 0) {
                    return Math.round(parseFloat(subTmp) * 100) / 100;
                }
            }
            tmpIndex++;
        }
        return -100;
    }
  }
  function getKey(rowData) {
    function isFloat(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    if (rowData.length === 1) {
        const arr = rowData[0].split(';');
        let str = '';
        for (const tmp of arr) {
            if (isFloat(tmp)) {
                return str.trim();
            } else {
                str += tmp + ' ';
            }
        }
        return str.trim();
    } else if (rowData.length > 1) {
        let str = '';
        for (const tmp of rowData) {
            const arr = tmp.split(';');
            for (const subTmp of arr) {
                if (isFloat(subTmp)) {
                    return str.trim();
                } else {
                    str += subTmp + ' ';
                }
            }
        }
        return str.trim();
    }
  }



  return loading ? (
    <Loading />
  ) : (
    <Box sx={{ display: "flex" }}>
      {!isUser && (
        <>
          <EditModal
            open={openEditModal}
            handleConfirm={handleSaveUser}
            handleClose={() => setOpenEditModal(false)}
            user={editUser}
            setUser={setEditUser}
            isSubmitting={isSubmitting}
          />
          <UploadModal
            open={openUploadModal}
            handleClose={() => setOpenUploadModal(false)}
            isUploading={isUploading}
            handleUpload={handleUpload}
            setFile={setFile}
            setReplace={setReplace}
          />
          <ConfirmDeleteModal
            open={openDeleteModal}
            handleConfirm={handleDeleteUser}
            handleClose={() => setOpenDeleteModal(false)}
            isDeleting={isDeleting}
            user={deleteUser}
          />
        </>
      )}
      {isUser && (
        <>
          <EditCustomerModal
            open={openEditModal}
            handleConfirm={handleSaveCustomer}
            handleClose={() => setOpenEditModal(false)}
            user={editUser}
            setUser={setEditUser}
            isSubmitting={isSubmitting}
          />
          <ConfirmDeleteModal
            open={openDeleteModal}
            handleConfirm={handleDeleteCustomer}
            handleClose={() => setOpenDeleteModal(false)}
            isDeleting={isDeleting}
            user={deleteCustomer}
          />
        </>
      )}
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerOpen}
        theme={theme}
        setPage={setPage}
        page={page}
        isUser={isUser}
        isCustomer={isCustomer}
        userProfile={userProfile}
      />
      <Main open={open}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            p: 1,
            backgroundColor: "#237EEE",
            color: "white",
            ":hover": {
              backgroundColor: "#237EEE",
            },
            borderRadius: "7px",
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Box
          sx={{
            mt: 3,
            px: 3,
          }}
        >
          {!isUser && page === "home" ? (
            <>
              <Stack direction="row" justifyContent={"space-between"}>
                <h3>Practitioner List</h3>

                <Stack alignItems={'center'} direction="row">
                  <TextField
                    size="small"
                    id="searchWord"
                    label="Search...."
                    name="searchWord"
                    autoComplete="searchWord"
                    autoFocus
                    type="text"
                    onChange={searchPractitioner}
                    value={search}
                  />
                  <Box mr={1}></Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpenUploadModal(true);
                    }}
                    style={{whiteSpace: 'nowrap', width: '10rem'}}
                  >
                    Upload Excel
                  </Button>
                </Stack>
              </Stack>
              <Box sx={{ my: 2 }}>
                <CustomTable
                  data={data}
                  handleEditModal={handleEditModal}
                  handleDeleteModal={handleDeleteModal}
                />
              </Box>
            </>
          ) : (
            page === 'customers' || page === 'lifewave' ?
              <>
                {
                  page === 'customers' && 
                (<>
                  <Stack direction="row" justifyContent={"center"} mb={11}>
                    <Typography
                      sx={{ fontWeight: "bold", color: "black" }}
                      variant={"h5"}
                    >
                      Customer List
                    </Typography>
                  </Stack>
                  <Box sx={{ my: 2 }}>
                    <CustomerTable
                      data={customerData}
                      handleEditModal={handleEditModal}
                      handleDeleteModal={handleDeleteModal}
                    />
                  </Box>
                </>)
                }
              </>
              : 
            <>
              <Stack direction="row" justifyContent={"center"} mb={11}>
                {
                  page === 'addCustomer' ? 
                    <Typography
                      sx={{ fontWeight: "bold", color: "black" }}
                      variant={"h5"}
                    >
                      Add a Customer
                    </Typography> : 
                    <Typography
                      sx={{ fontWeight: "bold", color: "black" }}
                      variant={"h5"}
                    >
                      {isUser ? "Edit Profile" : "Add a Practitioner"}
                    </Typography>
                    
                }
              </Stack>
              <Box sx={{ my: 2 }}>
                {
                  page === 'addCustomer' ?
                  <AddCustomer  addCustomer={addCustomer}/> : <AddPractitioner
                      addPractitioner={addPractitioner}
                      userProfile={userProfile}
                      isUser={isUser}
                      handleUpdateProfile={handleSaveUser}
                    />
                }
              </Box>
            </>
          )}
        </Box>
      </Main>
    </Box>
  );
}

const Sidebar = ({
  open,
  handleDrawerClose,
  theme,
  setPage,
  page,
  userProfile,
  isUser,
  isCustomer
}) => {
  const buttons = !isUser
    ? ( isCustomer ? [
      {
        name: "Dashboard",
        icon: House,
      },
      {
        name: "Recommendations",
        icon: House,
      },
      {
        name: "Nutrition",
        icon: House,
      },
      {
        name: "Essential Oils",
        icon: House,
      },
      {
        name: "Crystals",
        icon: House,
      },
      {
        name: "LifeStyle",
        icon: House,
      },
      {
        name: "Psycho Emotional",
        icon: House,
      },
      {
        name: "Physical",
        icon: House,
      },
    ] : [
        {
          name: "Home",
          icon: House,
          onClick: () => setPage("home"),
          active: page === "home",
        },
        {
          name: "Add Practitioner",
          icon: Add,
          onClick: () => setPage("add"),
          active: page === "add",
        },
        {
          name: "Sign out",
          icon: Logout,
          onClick: () => {
            Cookies.remove("token");
            window.location.href = "/login";
          },
        },
      ])
    : [
        {
          name: "Home",
          icon: House,
          onClick: () => setPage("home"),
          active: page === "home",
        },
        {
          name: "Add Customer",
          icon: Add,
          onClick: () => setPage("addCustomer"),
          active: page === "addCustomer",
        },
        {
          name: "Customers",
          icon: MenuIcon,
          onClick: () => setPage("customers"),
          active: page === "customers",
        },
        {
          name: "Sign out",
          icon: Logout,
          onClick: () => {
            Cookies.remove("token");
            window.location.href = "/login";
          },
        }
      ];
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#32373d",
          color: "white",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          backgroundColor: "#24262A",
          p: 5,
          pt: 9,
        }}
      >
        {isUser &&
          (userProfile.upload == 0 ? (
            !userProfile.imageURL || userProfile.imageURL == "" ? (
              userProfile.sex == "Male" ? (
                <Avatar
                  src={
                    "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34a0dbca137ef4f425e.png"
                  }
                  sx={{ width: 150, height: 150 }}
                />
              ) : (
                <Avatar
                  src={
                    "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34ab7ea181193716085.png"
                  }
                  sx={{ width: 150, height: 150 }}
                />
              )
            ) : (
              <Avatar
                src={userProfile.imageURL}
                alt={userProfile.firstname}
                sx={{ width: 150, height: 150 }}
              />
            )
          ) : (
            <Avatar
              src={API_URL + "src/" + userProfile.imageURL}
              alt={userProfile.firstname}
              sx={{ width: 150, height: 150 }}
            />
          ))}
        {!isUser && (
          <Avatar
            alt="Remy Sharp"
            src="https://biohackingcongress.com/storage/users/June2023/9Q67Ebbs5rPLWWmWGZET.png"
            sx={{ width: 150, height: 150 }}
          />
        )}

        <Typography
          variant="h1"
          color="white"
          sx={{
            fontSize: "1.1em",
            fontWeight: "500",
            color: "white",
          }}
        >
          {isUser ? `${userProfile.firstname} ${userProfile.lastname}` : "Administrator"}
        </Typography>
      </Box>
      <List
        sx={{
          p: 0,
        }}
      >
        {buttons.map((btn, index) => (
          <ListItem key={btn.name} disablePadding>
            <ListItemButton
              sx={{
                py: 1.5,
                ":hover": {
                  backgroundColor: "dodgerblue",
                },
                justifyContent: "flex-start",
                borderBottom: "1px solid #F0F7FF16",
                backgroundColor: btn.active ? "#237EEE" : "transparent",
              }}
              onClick={btn.onClick}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <btn.icon />
              </ListItemIcon>
              <ListItemText primary={btn.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
