"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { FaStar } from "react-icons/fa6";
import { BarChart } from '@mui/x-charts/BarChart';

export default function DayResult({ data }) {

    function getLength(params) {
        
        const totalSeconds = params;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        return formattedTime;
    }

    console.log('data', data);

    var mData = [];
    var hData = [];
    var lData = [];
    var xLabels = [];

    if(data.length > 0) {
    
        data?.forEach((element, index) => {
            mData.push(parseInt(element.hm_mediumCoherence));
            hData.push(parseInt(element.hm_highCoherence));
            lData.push(100 - parseInt(element.hm_mediumCoherence) - parseInt(element.hm_highCoherence));
            xLabels.push((index+1).toString());
        });
    }


  return (
    <div>
        {
            data.length > 0 && data[0].hm_highCoherence ? 
            <>
                <table className="customTable day-customTable">
                    <thead>
                        <tr>
                            <th>High %</th>
                            <th>Medium %</th>
                            <th>Low %</th>
                            <th>Level</th>
                            <th>Length</th>
                            <th>Achievement</th>
                            <th>Device</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((element, index)=>{
                                return(
                                    <tr key={index}>
                                        <td style={{background: '#5abf1f'}}>{element.hm_highCoherence}</td>
                                        <td style={{background: '#307ae0'}}>{element.hm_mediumCoherence}</td>
                                        <td style={{background: '#e5454d'}}>{(100-element.hm_mediumCoherence-element.hm_highCoherence)}</td>
                                        <td style={{background: '#913ac2'}}>{
                                            [...Array(Number(element.hm_sessionChallengeLevel))].map((_, i) => (
                                                    <FaStar size={14} key={i}/>
                                                ))
                                            }
                                        </td>
                                        <td style={{background: '#c23a97'}}>{getLength(element.hm_sessionLengthSecs)}</td>
                                        <td style={{background: '#ff8400'}}>{element.hm_sessionAchievement}</td>
                                        <td style={{background: '#f4c61b'}}><PhoneAndroidIcon sx={{mt: '.1rem'}}></PhoneAndroidIcon></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <Box mt={5}></Box> {
                    data.length > 0 ? 
                    <BarChart
                        width={1200}
                        height={300}
                        series={[
                            { data: lData, label: 'Low', id: 'pvId', stack: 'total', color: '#e5454d'},
                            { data: mData, label: 'Medium', id: 'uvId', stack: 'total', color: '#307ae0' },
                            { data: hData, label: 'High', id: 'mvId', stack: 'total', color: '#5abf1f' },
                        ]}
                        xAxis={[{ data: xLabels, scaleType: 'band' }]}
                    /> : <></>
                }
            </> :
            <>
                <Typography
                align="center"
                variant={"h5"}
                mt={10}
                >
                There is no data to display
                </Typography>
            </>
        }
    </div>
  );
}
