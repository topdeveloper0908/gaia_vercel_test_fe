"use client";
import React from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { FaStar } from "react-icons/fa6";
import { LineChart } from '@mui/x-charts/LineChart';

export default function DayResult({ data }) {

    function convertDate(params) {
        
        const seconds = params;
        const milliseconds = seconds * 1000; // Convert seconds to milliseconds

        const date = new Date(milliseconds);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    var pData = [];
    var uData = [];
    var xLabels = [];

    if(data.length > 0) {
        data?.forEach((element, index) => {
            pData.push(parseInt(element.AvgCoherence));
            uData.push(parseInt(element.Achievement));
            xLabels.push((index+1).toString());
        });
    }
 
  return (
    <div>
        {
            data.length > 0 && data[0].ChallengeLevel ? 
            <>
                <table className="customTable day-customTable">
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>IBI Start Time</th>
                            <th>AvgCoherence</th>
                            <th>Achievement</th>
                            <th>Device</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((element, index)=>{
                                return(
                                    <tr key={index}>
                                        <td style={{background: '#913ac2'}}>{
                                            [...Array(Number(element.ChallengeLevel))].map((_, i) => (
                                                    <FaStar size={14} key={i}/>
                                                ))
                                            }
                                        </td>
                                        <td style={{background: '#5abf1f'}}>{convertDate(element.IBIStartTime)}</td>
                                        <td style={{background: '#c23a97'}}>{element.AvgCoherence}</td>
                                        <td style={{background: '#ff8400'}}>{element.Achievement}</td>
                                        <td style={{background: '#f4c61b'}}><PhoneAndroidIcon sx={{mt: '.1rem'}}></PhoneAndroidIcon></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <Box mt={5}></Box> {
                    data.length > 0 ? 
                    
                    <>
                        <LineChart
                            width={1200}
                            height={300}
                            series={[
                                { data: uData, label: 'Achievement', color: '#ff8400' },
                            ]}
                            xAxis={[{ scaleType: 'point', data: xLabels }]}
                        />
                        <Box mt={3}></Box>
                        <LineChart
                            width={1200}
                            height={300}
                            series={[
                                { data: pData, label: 'AvgCoherence', color: '#c23a97' },
                            ]}
                            xAxis={[{ scaleType: 'point', data: xLabels }]}
                        />
                    </>
                     : <></>
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
