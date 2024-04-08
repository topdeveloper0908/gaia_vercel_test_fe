
"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";




export default function RecommendationTable({
  data
}) {

    var colors = ["#ff6d86", "#ff5050", "#97ff3a", "yellow", "#fbc155", "#fff"];
 if(data) {
     var tableData = [];
     var tmp = data.split(',');
     
     console.log('data', tmp);
     tmp.forEach((element, index) => {
        if(index == 24) {
            let newStr = element.slice(1);
            newStr += ';' + tmp[25];
            tableData.push(newStr.split(';'));
        }
        else if(index != 25) {
            if(index == 1 || index == 9) {
                tableData.push(['', element.split(';')[1], '', element.split(';')[2]]);
            } else {
                tableData.push(element.split(';'));
            }
        }
     });
 }
  return (
    <Box sx={{ width: "100%" }}>
        <table className="customTable">
            <tbody>
                {tableData.map((element)=>{
                    return(
                        <tr>
                            <td>{element[0]}</td>
                            <td>{element[1]}</td>
                            <td style={{background: colors[(Math.floor(element[2] === '' ? 6 : (element[2]/2 === 5 ? 4 : element[2]/2)))]}}>{element[2] == 'NaN' ? '' : element[2]}</td>
                            <td style={{background: colors[2]}}>{element[3] == 'NaN' ? '' : element[3]}</td>
                        </tr>
                    );  
                })}
            </tbody>
        </table>
      <Stack direction='row' mt={4} spacing={4} justifyContent='center'>
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
    </Box>
  );
}
