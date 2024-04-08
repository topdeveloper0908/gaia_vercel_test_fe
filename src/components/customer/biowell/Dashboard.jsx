
"use client";
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import axios from "axios";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { IconButton, Stack, Typography } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import Loading from "@/components/Loading";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import PersonIcon from '@mui/icons-material/Person';
import CircularProgress from '@mui/material/CircularProgress';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Button from '@mui/material/Button';

import patchData from '@/Json/data.json'
import patchProducts from '@/Json/products.json'
import earData from '@/Json/ear.json'

import convert from 'xml-js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  borderRadius: '.4rem',
  boxShadow: 24,
  p: 4,
};

export default function Dashboard({
  customer, data, b_token
}) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get("token");

    const  colors = ["#ff6d86", "#ff5050", "#97ff3a", "yellow", "#fbc155", "#fff"];

    const canvasRef = useRef(null);
    const auriculoCanvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState(null);
    const [date, setDate] = useState(null);
    const [dateList, setDateList] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [recommendData, setRecommendData] = useState([]);
    const [contentloading, setContentLoading] = useState(false);
    const [displayType, setDisplayType] = React.useState('patch');

    const [chakraAnimal, setChakraAnimal] = React.useState('cat');
    const [chakraAlignment, setChakraAlignment] = React.useState(null);
    const [chakraAvgEngery, setChakraAvgEngery] = React.useState(null);
    const [chakraModalOpen, setChakraModalOpen] = React.useState(false);
    const [chakraSelected, setChakraSelected] = React.useState(null);
    const chakraNames = ['Muladhara', 'Svadhisthana', 'Manipura', 'Anahata', 'Vishuddha', 'Ajna', 'Sahasrara'];

    const [auriculoMapDots, setAuriculoMapDots] = React.useState(null);
    const [auriculoMapDotsX, setAuriculoMapDotsX] = React.useState(null);
    const [auriculoMapDotsY, setAuriculoMapDotsY] = React.useState(null);

    // Chakras
    var energy = [];
    var alignment = [];
    var asymmetry = [];
    
    var rows = [];
    data.forEach((element) => {
        rows.push({
            id: element.id,
            name: element.name
        })
    });

    const VirtuosoTableComponents = {
        Scroller: React.forwardRef((props, ref) => (
          <TableContainer component={Paper} {...props} ref={ref} />
        )),
        Table: (props) => (
          <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };
    function fixedHeaderContent1() {
        return (
          <TableRow>
              <TableCell
                key='name'
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Customer Name
              </TableCell>
          </TableRow>
        );
    }
    function rowContent1(_index, row) {
        return (
          <React.Fragment>
              <TableCell
                key='date'
                align='left'
                onClick={() => setCard(_index)}
                className="hover-cursor"
                sx={{
                    backgroundColor: _index == card ? "primary.main" : 'white',
                    color: _index == card ? "white" : '#333',
                    fontWeight: '600'
                }}
              >
                <Box display='flex' alignItems='center'>
                  <PersonIcon sx={{mr: '.3rem'}}></PersonIcon>{row['name']}

                </Box>
              </TableCell>
          </React.Fragment>
        );
    }

    function fixedHeaderContent2() {
        return (
          <TableRow>
              <TableCell
                key='date'
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Date
              </TableCell>
          </TableRow>
        );
    }
    function rowContent2(_index, row) {
        return (
          <React.Fragment>
              <TableCell
                key='date'
                align='left'
                onClick={() => setDate(_index)}
                className="hover-cursor"
                sx={{
                    backgroundColor: _index == date ? "primary.main" : 'white',
                    color: _index == date ? "white" : '#333',
                    fontWeight: '600'
                }}
              >
                {convertDate(row['dt'])}
              </TableCell>
          </React.Fragment>
        );
    }

    const generatePDF = async () => {
      setLoading(true);
      const element = document.getElementById('patchWrapper'); // Replace with the ID of the element you want to export to PDF
  
      // Store the original height of the element
      const originalHeight = element.style.height;
      
      // Set the height of the element to match its scrollable size
      element.style.height = `${element.scrollHeight}px`;

      try {
        const pdfOptions = {
          margin: 10,
          filename: 'generated.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, windowWidth: document.getElementById('patchWrapper').scrollWidth },
          jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
        };
        setTimeout(async () => {
          const pdf = await html2pdf().from(element).set(pdfOptions).save();
          element.style.height = originalHeight;
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }

      // Restore the original height of the element after generating the PDF
    };

    function fixedHeaderContent3() {
        return (
          <TableRow>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                {displayType}
              </TableCell>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Sub-Category
              </TableCell>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Value
              </TableCell>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Sub Value
              </TableCell>
          </TableRow>
        );
    }
    function rowContent3(_index, row) {
        return (
          <React.Fragment>
              <TableCell
                align='center'
                sx={{
                    fontWeight: '600'
                }}
              >
                {row[0]}
              </TableCell>
              <TableCell
                align='center'
                sx={{
                    fontWeight: '600'
                }}
              >
                {row[1]}
              </TableCell>
              <TableCell
                align='center'
                sx={{
                    backgroundColor: colors[(Math.floor(row[2] === '' ? 6 : (row[2]/2 === 5 ? 4 : row[2]/2)))],
                    fontWeight: '600'
                }}
              >
                {row[2]}
              </TableCell>
              <TableCell
                align='center'
                sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: '600'
                }}
              >
                {row[3]}
              </TableCell>
          </React.Fragment>
        );
    }

    useEffect(()=>{
      getExpList();
      setDate(null);
    }, [card])

    useEffect(()=>{
      getFullScan();
    }, [date])

    useEffect(()=>{
      if(apiData != null) {
        getPatchData();
        if(displayType == 'chakras') {
          getChakraData(0)
        } else if(displayType == 'auriculo') {
          getAuriculoData(-100);
        }
      }
    }, [apiData])

    useEffect(()=>{
      if(apiData != null) {
        getPatchData();
        if(displayType == 'chakras') {
          getChakraData(0)
        } else if(displayType == 'auriculo') {
          getAuriculoData(-100);
        }
      }
    }, [displayType])

    useEffect(()=>{
      if(apiData != null) {
        getPatchData();
        if(displayType == 'chakras') {
          getChakraData(chakraSelected)
        }
      }
    }, [chakraAnimal])

    useEffect(()=>{
      if(chakraSelected != null) {
        setChakraModalOpen(true);
      }
    }, [chakraSelected])

    const getExpList = async () => {
      if(card != null) {
        console.log('customer', data[card]);
        const formData = {
          b_token: b_token,
          id: data[card].id
        };
        try {
          const response = await axios.post(`${API_URL}customer/bio/explist`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        setDateList(response.data.result.explist);
        } catch (error) {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
              window.location.href = "/login";
            }
            console.error("Error fetching data:", error);
        }
      } 
    }

    const getFullScan = async () => {
      setContentLoading(true);
      if(date != null) {
        if(dateList[date].exptype != 2) {
          toast.error("This exptype does not support Patch Recommend", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setContentLoading(false);
          return;
        } else {
          const formData = {
            b_name: customer.b_username,
            b_password: customer.b_password,
            expID: dateList[date].id
          };
          try {
            const response = await axios.post(`${API_URL}customer/bio/fullscan`, formData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          });
          const options = { compact: true, spaces: 4 };
          const jsonObj = convert.xml2json(response.data, options);
          // Parse the JSON object
          const parsedObj = JSON.parse(jsonObj);
          console.log('apiData', parsedObj);
          setApiData(parsedObj);
          // setDateList(response.data.result.explist);
          } catch (error) {
              if (error?.response?.status === 403 || error?.response?.status === 401) {
                window.location.href = "/login";
              }
              console.error("Error fetching data:", error);
          }
        }
      }
      setContentLoading(false);
    }

    function convertDate(timestamp) {
      const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
      return formattedDateTime;
    }

    const getPatchData = async () => {
      // Stress
      var patchTmp = [];
      var attributes = [
        {
          key: 'Stress',
          value: parseFloat(apiData.biowell.energy.params.common.Stress._attributes.value).toFixed(2),
        },
        {
          key: 'Energy',
          value: parseFloat(apiData.biowell.energy.params.common.Energy._attributes.value).toFixed(2),
        },
        {
          key: 'Muladhara',
          value: parseFloat(apiData.biowell.energy.chakras.common.Value0._attributes.value).toFixed(2),
        },
        {
          key: 'Svadhisthana',
          value: parseFloat(apiData.biowell.energy.chakras.common.Value1._attributes.value).toFixed(2),
        },
        {
          key: 'Manipura',
          value: parseFloat(apiData.biowell.energy.chakras.common.Value2._attributes.value).toFixed(2),
        },
        {
          key: 'Anahata',
          value: parseFloat(apiData.biowell.energy.chakras.common.Value3._attributes.value).toFixed(2),
        },
        {
          key: 'Vishuddha',
          value: parseFloat(apiData.biowell.energy.chakras.common.Value4._attributes.value).toFixed(2),
        },
        {
          key: 'Ajna',
          value: parseFloat(apiData.biowell.energy.chakras.common.Value5._attributes.value).toFixed(2),
        },
        {
          key: 'Sahasrara',
          value: parseFloat(apiData.biowell.energy.chakras.common.Value6._attributes.value).toFixed(2),
        },
        {
          key: 'Alignment',
          value: ((parseFloat(apiData.biowell.energy.chakras.common.Align0._attributes.value) + 
                  parseFloat(apiData.biowell.energy.chakras.common.Align1._attributes.value) + 
                  parseFloat(apiData.biowell.energy.chakras.common.Align2._attributes.value) + 
                  parseFloat(apiData.biowell.energy.chakras.common.Align3._attributes.value) + 
                  parseFloat(apiData.biowell.energy.chakras.common.Align4._attributes.value) + 
                  parseFloat(apiData.biowell.energy.chakras.common.Align5._attributes.value) + 
                  parseFloat(apiData.biowell.energy.chakras.common.Align6._attributes.value)) / 7).toFixed(2),
        },
        {
          key: 'Yin of Heart',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance0._attributes.value).toFixed(2),
        },
        {
          key: 'Yin of Lungs',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance1._attributes.value).toFixed(2),
        },
        {
          key: 'Yin of Liver',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance2._attributes.value).toFixed(2),
        },
        {
          key: 'Yin of Spleen',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance3._attributes.value).toFixed(2),
        },
        {
          key: 'Yin of Kidneys',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance4._attributes.value).toFixed(2),
        },
        {
          key: 'Yin of Pericardium',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance5._attributes.value).toFixed(2),
        },
        {
          key: 'Yang of Small intestine',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance6._attributes.value).toFixed(2),
        },
        {
          key: 'Yang of Large intestine',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance7._attributes.value).toFixed(2),
        },
        {
          key: 'Yang of Gallbladder',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance8._attributes.value).toFixed(2),
        },
        {
          key: 'Yang of Stomach',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance9._attributes.value).toFixed(2),
        },
        {
          key: 'Yang of Triple warmer',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance10._attributes.value).toFixed(2),
        },
        {
          key: 'Yang of Bladder',
          value: parseFloat(apiData.biowell.energy.organs.meridians.Disbalance11._attributes.value).toFixed(2),
        },
        {
          key: 'Cardiovascular system',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance0._attributes.value).toFixed(2),
        },
        {
          key: 'Heart',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance1._attributes.value).toFixed(2),
        },
        {
          key: 'Colon - descending',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance2._attributes.value).toFixed(2),
        },
        {
          key: 'Colon - sigmoid',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance3._attributes.value).toFixed(2),
        },
        {
          key: 'Blind Gut',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance5._attributes.value).toFixed(2),
        },
        {
          key: 'Blind Gut',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance5._attributes.value).toFixed(2),
        },
        {
          key: 'Pancreas',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance11._attributes.value).toFixed(2),
        },
        {
          key: 'Liver',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance12._attributes.value).toFixed(2),
        },
        {
          key: 'Gallbladder',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance13._attributes.value).toFixed(2),
        },
        {
          key: 'Pituitary gland',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance14._attributes.value).toFixed(2),
        },
        {
          key: 'Thyroid gland',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance15._attributes.value).toFixed(2),
        },
        {
          key: 'Adrenals',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance16._attributes.value).toFixed(2),
        },
        {
          key: 'Spine - cervical zone',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance17._attributes.value).toFixed(2),
        },
        {
          key: 'Spine - thorax zone',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance18._attributes.value).toFixed(2),
        },
        {
          key: 'Spine - lumbar zone',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance19._attributes.value).toFixed(2),
        },
        {
          key: 'Sacrum',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance20._attributes.value).toFixed(2),
        },
        {
          key: 'Urogenital system',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance22._attributes.value).toFixed(2),
        },
        {
          key: 'Kidneys',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance23._attributes.value).toFixed(2),
        },
        {
          key: 'Head',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance0._attributes.value).toFixed(2),
        },
        {
          key: 'Eyes',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance41._attributes.value).toFixed(2),
        },
        {
          key: 'Jaw, Teeth',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance38._attributes.value).toFixed(2),
        },
        {
          key: 'Cerebral zone (cortex)',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance39._attributes.value).toFixed(2),
        },
        {
          key: 'Hypothalamus',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance32._attributes.value).toFixed(2),
        },
        {
          key: 'Epiphysis',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance31._attributes.value).toFixed(2),
        },
        {
          key: 'Respiratory system',
          value: parseFloat(apiData.biowell.energy.organs.organs.Disbalance28._attributes.value).toFixed(2),
        },
        {
          key: 'Mammary glands Respiratory system',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance2._attributes.value).toFixed(2),
        },
        {
          key: 'Endocrine system',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance3._attributes.value).toFixed(2),
        },
        {
          key: 'Musculoskeletal system',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance4._attributes.value).toFixed(2),
        },
        {
          key: 'Digestive system',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance5._attributes.value).toFixed(2),
        },
        {
          key: 'Urogenital system',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance6._attributes.value).toFixed(2),
        },
        {
          key: 'Nervous system',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance7._attributes.value).toFixed(2),
        },
        {
          key: 'Immune system',
          value: parseFloat(apiData.biowell.energy.organs.systems.Disbalance8._attributes.value).toFixed(2),
        },
      ];
      await attributes.forEach(async attribute => {
        var found = await patchData.find(element => element.key == attribute.key)
        var tmp = {key: attribute.key, products: []};
        found.products.forEach(element => {
          if(element.condition == 'over') {
            if(attribute.value > element.value) {
              tmp.products.push({
                key: element.id,
                description: element.description
              })
            }
          } else if(element.condition == 'under') {
            if(attribute.value < element.value) {
              tmp.products.push({
                key: element.id,
                description: element.description
              })
            }
          } else if(element.condition == 'under or over') {
            if(attribute.value < element.value[0] || attribute.value > element.value[1]) {
              tmp.products.push({
                key: element.id,
                description: element.description
              })
            }
          }
        });
        patchTmp.push(tmp);
      });
      setRecommendData(patchTmp);
    }

    const getChakraData = async (value) => {
      setContentLoading(true);
      var tmpAlignment = 0;
      var tmpEnergy = 0;
      for (let index = 0; index < 7; index++) {
        energy.push(parseFloat(apiData.biowell.energy.chakras.common[`Value${index}`]._attributes.value).toFixed(2))
        tmpEnergy += parseFloat(apiData.biowell.energy.chakras.common[`Value${index}`]._attributes.value);
        alignment.push(parseFloat(apiData.biowell.energy.chakras.common[`Align${index}`]._attributes.value).toFixed(2))
        tmpAlignment += parseFloat(apiData.biowell.energy.chakras.common[`Align${index}`]._attributes.value);
        asymmetry.push(parseFloat(apiData.biowell.energy.chakras.common[`Asymmetry${index}`]._attributes.value).toFixed(2))
      }

      setChakraAlignment((tmpAlignment / 7).toFixed(0));
      setChakraAvgEngery((tmpEnergy / 7).toFixed(2));

      const width =  900;
      const height = 700;

      const colors = ['#9979C8', '#396EAA', '#32ADE1', 'green', 'yellow', 'orange', 'red'];

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
  
      var animalImage=new Image();
      animalImage.onload=function(){
        
        // Draw on the canvas
        ctx.fillStyle = "#FCF0F3";
        ctx.fillRect(0, 0, width/6, height);
        ctx.fillRect(width*5/6, 0, width, height);
  
        ctx.fillStyle = "#FFFEF3";
        ctx.fillRect(width/6, 0, width/6, height);
        ctx.fillRect(width*2/3, 0, width/6, height);
  
        ctx.fillStyle = "#F5FAF2";
        ctx.fillRect(width/3, 0, width/3, height);
  
        ctx.drawImage(animalImage, 50, -50);
  
        // Draw middle line
        ctx.beginPath();
        ctx.setLineDash([10, 5]);
        ctx.lineWidth = 1;
  
        ctx.strokeStyle = "black";
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2, height);
        ctx.stroke();
  
        ctx.strokeStyle = "grey";
        ctx.moveTo(width/3, 0);
        ctx.lineTo(width/3, height);
        ctx.stroke();
  
        ctx.moveTo(width*2/3, 0);
        ctx.lineTo(width*2/3, height);
        ctx.stroke();   
        for (let index = 1; index < 8; index++) {
  
          // Draw Text
          ctx.font = "20px Arial";
          ctx.fillStyle = "black";
          ctx.fillText(8-index, 20, height/8*index+8);
          ctx.fillText(8-index, width-30, height/8*index+8);
  
          // Draw line
          ctx.beginPath();
          ctx.setLineDash([10, 3]);
          ctx.lineWidth = 2;
          ctx.strokeStyle = colors[index-1];
          ctx.moveTo(50, height/8*index);
          ctx.lineTo(width-50, height/8*index);
          ctx.stroke();
  
          // Draw Circle
          ctx.beginPath();
      
          var x = width/2-width/6.5*asymmetry[7-index],
              y = height/8*index+height/900*(100-alignment[7-index]),
              // Radii of the white glow.
              innerRadius = 5,
              outerRadius = 30,
              // Radius of the entire circle.
              radius = 15;
  
          var gradient = ctx.createRadialGradient(x - (energy[7-index]/8*40)/2, y - (energy[7-index]/8*40)/2, innerRadius, x - (energy[7-index]/8*40)/2, y - (energy[7-index]/8*40)/2, outerRadius);
          gradient.addColorStop(0, 'white');
          gradient.addColorStop(1, colors[index-1]);
  
          ctx.arc(x, y, (energy[7-index]/8*40), 0, 2 * Math.PI, false);
          ctx.fillStyle = gradient;
          ctx.fill();
  
          if(index == value) {
              ctx.beginPath();
              ctx.setLineDash([5, 0]);
              ctx.arc(x, y, (energy[7-index]/8*40)+5, 0, 2 * Math.PI, false);
              ctx.strokeStyle = colors[index-1];
              ctx.stroke();
          }
        }
      }
      animalImage.src="../../../../img/chakra/animal/" + chakraAnimal + ".png";
      setContentLoading(false);
    }
    function calculatePos(mouseX, mouseY) {
      const width =  900;
      const height = 700;
      for (let index = 1; index < 8; index++) {
          var x = width/2-width/6.5*asymmetry[7-index],
              y = height/8*index+height/900*(100-alignment[7-index]);
          var radius = energy[7-index]/8*40;
          if( (x-radius) < mouseX && mouseX < (x+radius) && (y-radius) < mouseY &&  mouseY < (y+radius)) {
              return index;
          }
      }
      return -100;
    }

    const openChakraModal = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const canvasElement = canvasRef.current;
      const rect = canvasElement.getBoundingClientRect();
      var offsetX = rect.left;
      var offsetY = rect.top;
      var mouseX = parseInt(e.clientX - offsetX + window.pageXOffset);
      var mouseY = parseInt(e.clientY - offsetY + window.pageYOffset);
      var selected = calculatePos(mouseX, mouseY);
      if(selected > -1) {
        setChakraSelected(7 - selected);
      }
    }
    function handleMouseMove(e) {
      e.preventDefault();
      e.stopPropagation();
      const canvasElement = canvasRef.current;
      const rect = canvasElement.getBoundingClientRect();
      var offsetX = rect.left;
      var offsetY = rect.top;
      var mouseX = parseInt(e.clientX - offsetX + window.pageXOffset);
      var mouseY = parseInt(e.clientY - offsetY + window.pageYOffset);
      var selected = calculatePos(mouseX, mouseY);
      getChakraData(selected);
    }

    const getAuriculoData = async (value) => {
      setContentLoading(true);

      const canvas = auriculoCanvasRef.current;
      const ctx = canvas.getContext('2d');

      var keyData = [];
      var energyData = [];
      var balanceData = [];

      var mapDots = []
      var mapDotsX = []
      var mapDotsY = []
      var mapDotsColors = []

      for (let index = 0; index < 43; index++) {
        keyData.push(apiData.biowell.energy.organs.organs[`Name${index}`]._attributes.value);
        energyData.push((parseFloat(apiData.biowell.energy.organs.organs[`Left_value${index}`]._attributes.value) + parseFloat(apiData.biowell.energy.organs.organs[`Right_value${index}`]._attributes.value))/2);
        balanceData.push(100 - parseFloat(apiData.biowell.energy.organs.organs[`Disbalance${index}`]._attributes.value));
      }
      for (let index = 0; index < 9; index++) {
        keyData.push(apiData.biowell.energy.organs.systems[`Name${index}`]._attributes.value);
        energyData.push((parseFloat(apiData.biowell.energy.organs.systems[`Left_value${index}`]._attributes.value) + parseFloat(apiData.biowell.energy.organs.organs[`Right_value${index}`]._attributes.value))/2);
        balanceData.push(100 - parseFloat(apiData.biowell.energy.organs.organs[`Disbalance${index}`]._attributes.value));
      }

      var keyIndex = 0;
      for (let key of keyData) {
        if (0 < balanceData[keyIndex] && balanceData[keyIndex] < 70 && 4 < energyData[keyIndex] && energyData[keyIndex] < 6) {
            for (let element of earData) {
                if ('category' in element) {
                    if (categoryCheck(element['category'], key) && isExist(mapDotsX, element['x'], mapDotsY, element['y'])) {
                        mapDots.push(element['name']);
                        mapDotsX.push(element['x']);
                        mapDotsY.push(element['y']);
                        mapDotsColors.push('blue');
                    }
                }
            }
        }
        if (0 < energyData[keyIndex] && energyData[keyIndex] < 4) {
            for (let element of earData) {
                if ('category' in element) {
                    if (categoryCheck(element['category'], key) && isExist(mapDotsX, element['x'], mapDotsY, element['y'])) {
                        mapDots.push(element['name']);
                        mapDotsX.push(element['x']);
                        mapDotsY.push(element['y']);
                        mapDotsColors.push('black');
                    }
                }
            }
        }
        if (energyData[keyIndex] > 6) {
            for (let element of earData) {
                if ('category' in element) {
                    if (categoryCheck(element['category'], key) && isExist(mapDotsX, element['x'], mapDotsY, element['y'])) {
                        mapDots.push(element['name']);
                        mapDotsX.push(element['x']);
                        mapDotsY.push(element['y']);
                        mapDotsColors.push('white');
                    }
                }
            }
        }
      keyIndex = keyIndex + 1;
      }

      var earImage=new Image();
      earImage.onload=function() {
        ctx.drawImage(earImage, 0, 0);

        for (let i = 0; i < mapDots.length; i++) {          
          ctx.beginPath();
          ctx.arc(mapDotsX[i], mapDotsY[i], 4, 0, 2 * Math.PI, false);
          ctx.fillStyle = mapDotsColors[i];
          ctx.fill();
        }
        if(value > -1) {
          ctx.beginPath();
          var x = mapDotsX[value],
              y = mapDotsY[value],
              // Radii of the white glow.
              innerRadius = 2,
              outerRadius = 7,
              // Radius of the entire circle.
              radius = 5;

          var gradient = ctx.createRadialGradient(x - 3, y - 3, innerRadius, x - 3, y - 3, outerRadius);
          gradient.addColorStop(0, 'white');
          gradient.addColorStop(1, 'green');

          ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = gradient;
          ctx.fill();

          x = x + 5;
          y = y + 5;
          const width = mapDots[value].length * 11;
          const height = 40;
          const radius = 5;
  
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.arcTo(x + width, y, x + width, y + radius, radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
          ctx.lineTo(x + radius, y + height);
          ctx.arcTo(x, y + height, x, y + height - radius, radius);
          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y, x + radius, y, radius);
          ctx.fillStyle = 'white'; // Set the background color
          ctx.fill();

          // Write text inside the square
          ctx.font = '16px Arial';
          ctx.fillStyle = 'black'; 
          ctx.fillText(mapDots[value], x+mapDots[value].length * 1.4, y + 25); // (text, x, y)
        }
      }
      earImage.src="../../../../img/auriculo/ear.png";

      function categoryCheck(categories, category) {
        if (typeof categories === 'string') {
            if (categories.replace(/\s/g, '') === category.replace(/\s/g, '')) {
                return true;
            }
        } else if (categories.includes(category)) {
            return true;
        }
        return false;
      }
    
      function isExist(array1, value1, array2, value2) {
        if (array1.includes(value1) && array2.includes(value2)) {
            return false;
        }
        return true;
      }
      setAuriculoMapDots(mapDots);
      setAuriculoMapDotsX(mapDotsX);
      setAuriculoMapDotsY(mapDotsY);
      setContentLoading(false);
    }
    const openAuriculoModal = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const canvasElement = auriculoCanvasRef.current;
      const rect = canvasElement.getBoundingClientRect();
      var offsetX = rect.left;
      var offsetY = rect.top;
      var mouseX = parseInt(e.clientX - offsetX + window.pageXOffset);
      var mouseY = parseInt(e.clientY - offsetY + window.pageYOffset);
      var selected = calculateAuriculoPos(mouseX, mouseY);
      getAuriculoData(selected);
    }
    function calculateAuriculoPos(mouseX, mouseY) {
      for (let index = 0; index < auriculoMapDots.length; index++) {
          var x = parseInt(auriculoMapDotsX[index]),
          y = parseInt(auriculoMapDotsY[index]);
          if( (x-5) < mouseX && mouseX < (x + 5) && (y-5) < mouseY &&  mouseY < (y+5)) {
              return index;
          }
      }
      return -100;
  }

    const selectData = () => {
      // if(current != null) {
      //   if(data[current]) {
      //       var tmpTableData = [];
      //       var tmp = data[current].data.split(',');
      //       tmp.forEach((element, index) => {
      //           if(index == 24) {
      //               let newStr = element.slice(1);
      //               newStr += ';' + tmp[25];
      //               tmpTableData.push(newStr.split(';'));
      //           }
      //           else if(index != 25) {
      //               if(index == 1 || index == 9) {
      //                   tmpTableData.push(['', element.split(';')[1], '', element.split(';')[2]]);
      //               } else {
      //                   tmpTableData.push(element.split(';'));
      //               }
      //           }
      //       });
      //       setTableData(tmpTableData);
      //   }
      // }
    }

    const changeDisplayType = (event) => {
      setDisplayType(event.target.value);
    }

    const changechakraAnimal = (event) => {
      setChakraAnimal(event.target.value);
    }

    return (
      <>
      {loading == true ? (<Loading />) : (
        <>
            <Modal
              open={chakraModalOpen}
              onClose={()=>setChakraModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Fade in={chakraModalOpen}>
                <Box sx={style}>
                  {
                    (!(apiData == null || chakraSelected == null)) && (
                      <Box>
                        <Box display='flex'>
                          <img width='156' height='128' src={`../../../../img/chakra/${chakraSelected+1}.png`}></img>
                          <Box sx={{ ml: '1rem'}}>
                            <Typography
                              sx={{ color: "black" }}
                              variant={"h6"}
                            >
                              Number of chakra: {chakraSelected+1}
                            </Typography>
                            <Typography
                              sx={{ color: "black" }}
                              variant={"h6"}
                            >
                              Name of chakra: {chakraNames[chakraSelected]}
                            </Typography>
                            <Typography
                              sx={{ color: "black" }}
                              variant={"h6"}
                            >
                              Energy: {parseFloat(apiData.biowell.energy.chakras.common[`Value${chakraSelected}`]._attributes.value).toFixed(2)}
                            </Typography>
                            <Typography
                              sx={{ color: "black" }}
                              variant={"h6"}
                            >
                              Alignment: {parseFloat(apiData.biowell.energy.chakras.common[`Align${chakraSelected}`]._attributes.value).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box mt={2}>
                          {
                            chakraSelected == 0 && (
                              <Typography
                                sx={{ color: "black" }}
                              >
                                Color: Red <br></br>
                                Projection onto physical level: Spine ending between anus and genitals, perineum area<br></br>
                                Key words: vital force, power, stamina<br></br>
                                Element: Earth<br></br>
                                Energy: energy of Earth<br></br>
                                Controlled feeling: sense of smell<br></br><br></br>
                                Physical aspects: adrenal gland, skeleton, backbone, spinal cord, kidney, rectum<br></br>
                                Psychological aspects: safety, prudence, patience, vigilance, selfishness, self-defense, struggle<br></br>
                                Functional manifestations: movement functions, endurance, vital capacity, inner strength, love of living via body fitness<br></br>
                                An effect from working with chakra: strengthening of the immunity, cheerfulness, endurance, decisiveness, optimism, regaining the zest for life
                              </Typography>
                            )
                          }
                          {
                            chakraSelected == 1 && (
                              <Typography
                                sx={{ color: "black" }}
                              >
                                Color: Orange <br></br>
                                Projection onto physical level: 4-6 cm below the navel, at pubic bone level<br></br>
                                Key words: attractiveness, material creativity<br></br>
                                Element: Water<br></br>
                                Energy: energy of life<br></br>
                                Controlled feeling: taste<br></br><br></br>
                                Physical aspects: digestive apparatus, bowels, urogenital system<br></br>
                                Psychological aspects: passion, self-appraisal, fear, authority, aggressiveness, contempt, egoism, thrift<br></br>
                                Functional manifestations: sexual power, will of destruction, high sensitivity of taste<br></br>
                                An effect from working with chakra: spiritual growth, an ability to transform greediness, lust, anger, jealousy, enables to be a success
                              </Typography>
                            )
                          }
                          {
                            chakraSelected == 2 && (
                              <Typography
                                sx={{ color: "black" }}
                              >
                                Color: Yellow <br></br>
                                Projection onto physical level: 5-7 cm above the navel, solar plexus<br></br>
                                Key words: will, persistence, power, resolution<br></br>
                                Element: Fire<br></br>
                                Energy: morality<br></br>
                                Controlled feeling: vision<br></br><br></br>
                                Physical aspects: stomach, pancreas, excretory glands, liver, solar plexus<br></br>
                                Psychological aspects: self-expression, self-affirmation, courage, emotionality, enthusiasm, guile, fear<br></br>
                                Functional manifestations: coordination of movements, one's own body perception, the drive to achieve self-satisfaction<br></br>
                                An effect from working with chakra: enhancement of viability and healing of many diseases, acquisition of longevity and good health, development of management and organizing capabilities, improvement of speech control and an ability to clearly formulate one's ideas, to exert one's influence on people with words
                              </Typography>
                            )
                          }
                          {
                            chakraSelected == 3 && (
                              <Typography
                                sx={{ color: "black" }}
                              >
                                Color: Green <br></br>
                                Projection onto physical level: thorax centre<br></br>
                                Key words: love, kindness, compassion, harmony<br></br>
                                Element: Air<br></br>
                                Energy: Love<br></br>
                                Controlled feeling: tactile organs<br></br><br></br>
                                Physical aspects: cardiovascular system, circulation of the blood, lungs, thyroid gland, mammary glands<br></br>
                                Psychological aspects: obligation, responsibility, empathy, love for one's neighbour, indecision<br></br>
                                Functional manifestations: love to oneself and others, tactile sensitivity through the motor activity of nerves, capability to obtain the desirable<br></br>
                                An effect from working with chakra: feelings and emotions control, self-control, wisdom and inner strength, overcoming obstacles and difficulties, acquiring confidence, an ability to harmonize the surroundings, acquiring power over one's self, equipoising of Yang and Yin, harmonization of the intention and action, development of creative inspiration
                              </Typography>
                            )
                          }
                          {
                            chakraSelected == 4 && (
                              <Typography
                                sx={{ color: "black" }}
                              >
                                Color: Azure <br></br>
                                Projection onto physical level: base of neck, thymus<br></br>
                                Key words: creativity, harmony, composure, self-actualization<br></br>
                                Element: Ether<br></br>
                                Energy: creativity<br></br>
                                Controlled feeling: hearing<br></br><br></br>
                                Physical aspects: spinal cord, throat, neck, oesophagus, heart, lungs<br></br>
                                Psychological aspects: emotion, inspiration, creation, sociability, emotional-spiritual activity<br></br>
                                Functional manifestations: breathing, sigh and utterance of sound, swallowing, represents creativity of all kinds, the last zone related to time and space<br></br>
                                An effect from working with chakra: calmness, purity, clearness, melodiousness of voice, an ability to spiritual poetry, prophetic gift
                              </Typography>
                            )
                          }
                          {
                            chakraSelected == 5 && (
                              <Typography
                                sx={{ color: "black" }}
                              >
                                Color: Blue <br></br>
                                Projection onto physical level: the centre of brain, epiphysis<br></br>
                                Key words: wisdom, will<br></br>
                                Element: Light<br></br>
                                Energy: mind, intuition<br></br>
                                Controlled feeling: intuition<br></br><br></br>
                                Physical aspects: brain, hypophysis, hypothalamus, head, nervous system<br></br>
                                Psychological aspects: reason, will, intellect, logic, empathy, inspiration, directivity, analysis, imagination<br></br>
                                Functional manifestations: ability to create visions (creative imagination) and to understand the significance (responsibility) of one's abilities, understanding of concepts, clairvoyance, responsible for the sixths feeling (instinct)<br></br>
                                An effect from working with chakra: understanding the essence of things, wisdom, will, clairvoyance, an ability to know the past, present and future, the burden of previous lives is burnt during the work with the sixth chakra
                              </Typography>
                            )
                          }
                          {
                            chakraSelected == 6 && (
                              <Typography
                                sx={{ color: "black" }}
                              >
                                Color: Violet <br></br>
                                Projection onto physical level: top of the head, vertex<br></br>
                                Key words: cosmic perception, super consciousness, unity<br></br>
                                Element: Light<br></br>
                                Energy: will, consciousness, creativity<br></br>
                                Controlled feeling: collective mind<br></br><br></br>
                                Physical aspects: brain, pineal gland, skin, reproduction, hormone balance<br></br>
                                Psychological aspects: spirituality, wisdom, enlightenment, self-actualization, unselfishness, integrity<br></br>
                                Functional manifestations: superior abstract and philosophical thinking, super-consciousness, pure intuition, unites the notion of reason (geometrical figures of mental body), transformation of thought into energy via brain activation<br></br>
                                An effect from working with chakra: acquisition of abilities to super-consciousness, an all-uniting vision of the world, putting into practice one higher aspirations, complete calm, universal consciousness, joining our spiritual self, realization of the superior plentitude of life
                              </Typography>
                            )
                          }
                          </Box>
                      </Box>
                    )
                  }
                </Box>
              </Fade>
            </Modal>
            <Stack display='none' direction='row' mt={-7.5} mb={4} spacing={4}>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[0], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Very Low</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[1], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Low</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[2], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Normal</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[3], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Increased</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[4], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>High</span>
                </Box>
            </Stack>
            <Box mt={5}></Box>
            <Box display='flex' justifyContent='end'>
              {
                displayType == 'patch' ? 
                <Button
                  sx={{mr: '.5rem'}}
                  variant="contained"
                  onClick={generatePDF}
                  disabled={recommendData.length == 0}
                  startIcon={<PictureAsPdfIcon />}>
                  Save as PDF
                </Button> : <></>
              }
              {
                displayType == 'chakras' ? 
                <FormControl sx={{mr: '.5rem'}}>
                  <InputLabel id="demo-simple-select-label">Select Animal</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select Animal"
                    value={chakraAnimal}
                    onChange={changechakraAnimal}
                    size="small"
                  >
                    <MenuItem value="cat" selected>Cat</MenuItem>
                    <MenuItem value="bird">Bird</MenuItem>
                    <MenuItem value="dog">Dog</MenuItem>
                    <MenuItem value="horse">Horse</MenuItem>
                  </Select>
                </FormControl> : <></>
              }
              <FormControl>
                <InputLabel id="demo-simple-select-label">Display Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Display Type"
                  value={displayType}
                  onChange={changeDisplayType}
                  size="small"
                >
                  <MenuItem value="patch" selected>Patch Recommend</MenuItem>
                  <MenuItem value="energy">Energy</MenuItem>
                  <MenuItem value="chakras">Chakras</MenuItem>
                  <MenuItem value="auriculo">Auriculo</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}></Box>
            <Grid
                container
                spacing={1}
                justifyContent={"center"}
            >
                <Grid item md={2} display={"flex"} flexDirection={"column"}>
                    <Paper style={{ height: 700, width: '100%' }}>
                        <TableVirtuoso
                          className="scrollBar-hidden"
                          data={rows}
                          components={VirtuosoTableComponents}
                          fixedHeaderContent={fixedHeaderContent1}
                          itemContent={rowContent1}
                        />
                    </Paper>
                </Grid>
                <Grid item md={2} display={"flex"} flexDirection={"column"}>
                    <Paper style={{ height: 700, width: '100%' }}>
                        <TableVirtuoso
                          className="scrollBar-hidden"
                          data={dateList}
                          components={VirtuosoTableComponents}
                          fixedHeaderContent={fixedHeaderContent2}
                          itemContent={rowContent2}
                        />
                    </Paper>
                </Grid>
                <Grid item md={8} display={"flex"} flexDirection={"column"}>
                  {
                    contentloading == true ?
                    <Paper className="scrollBar-hidden" sx={{p: '2rem 2rem'}} style={{ height: 700, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress />
                    </Paper>: <>
                    {
                      displayType == 'patch' && (
                        <Paper id="patchWrapper" className="scrollBar-hidden" sx={{p: '2rem 2rem'}} style={{ height: 700, width: '100%' }}>
                            {/* <TableVirtuoso
                                data={tableData}
                                components={VirtuosoTableComponents}
                                fixedHeaderContent={fixedHeaderContent2}
                                itemContent={rowContent2}
                            /> */}
                            {
                              recommendData.map((element, index)=>{
                                return(
                                  element.products.length > 0 ? 
                                  <>
                                    <Typography
                                      sx={{ fontWeight: "bold", color: "black", textDecoration: 'underline', mb: '1rem' }}
                                      variant={"h5"}
                                      key={'data' + index}
                                    >
                                      {element.key}
                                    </Typography>
                                    {
                                      element.products.map((product, subIndex)=>{
                                        return(
                                          <Box display='flex' key={'product' + subIndex}>
                                            <img width='250' height='200' src={"../../../../img/products/" + patchProducts[product.key].img}></img>
                                            <Box sx={{ml:'1rem'}}>
                                              <Typography
                                                sx={{ fontWeight: "bold", color: "black" }}
                                                variant={"h5"}
                                              >
                                                {patchProducts[product.key].name}
                                              </Typography>
                                              <Link
                                                co="correctValue"
                                                href={'https://lifewave.com/gaiahealers/store/product/' + patchProducts[product.key].link}
                                              >
                                                {'https://lifewave.com/gaiahealers/store/product/' + patchProducts[product.key].link}
                                              </Link>
                                              <Typography
                                                sx={{ color: "black" }}
                                              >
                                                {product.description}
                                              </Typography>
                                            </Box>
                                          </Box>
                                        )
                                      })
                                    }
                                  </> : <></>
                                )
                              })
                            }
                        </Paper>
                      )
                    } {
                      displayType == 'chakras' && (
                        <Paper className="scrollBar-hidden" sx={{p: '2rem 2rem'}} style={{ height: 700, width: '100%' }}>
                          <Typography
                            sx={{ color: "black", mb: "1rem", fontWeight: '600' }}
                            variant={"h5"}
                            align="center"
                          >
                            Alignment: {chakraAlignment}% Average energy: {chakraAvgEngery} Joules (× 10²)
                          </Typography>
                          <canvas ref={canvasRef} width={900} height={700} onClick={(e) => openChakraModal(e)} onMouseMove={(e) => handleMouseMove(e)}/>
                        </Paper>
                      )
                    } {
                      displayType == 'auriculo' && (
                        <Paper className="scrollBar-hidden" sx={{p: '2rem 2rem'}} style={{ height: 700, display: 'flex', justifyContent: 'center', alignItems: 'baseline'}}>
                          <canvas ref={auriculoCanvasRef} width={590} height={950} onMouseMove={(e) => openAuriculoModal(e)}/>
                        </Paper>
                      )
                    }
                    </>
                  }
                </Grid>
            </Grid>
        </> )}
      </>
    );
}
