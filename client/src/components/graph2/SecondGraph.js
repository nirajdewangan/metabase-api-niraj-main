import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { globalUri } from '../../app.config';
import axios from 'axios';  
import {  message } from 'antd';
const DualLineGraph1 = (props)=>{
    const [data,setData] = useState([])
   

  useEffect(()=>{
    axios.get(globalUri+"plotLabelCountGraph")
    .then((res) => {
       if(res.data.response!=null)
       {
        setData(res.data.response)
       }
    })
    .catch((error)=>{
        message.error(error.message);
    })
  }, [])
  
 
  const config = {
    data,
    padding: 'auto',
    xField: 'capture_date',
    yField: 'capture_time',
    xAxis: {
      tickCount: 5,
    },seriesField: 'type',
    color: ({ type }) => {
      return type === 'car' ? '#F4664A' : type === 'bike' ? '#30BF78' : '#FAAD14';
    },
    lineStyle: ({ type }) => {
      if (type === 'car') {
        return {
          lineDash: [4, 4],
          opacity: 1,
        };
      }

      return {
        opacity: 0.5,
      };
    },
   
  };

  return <Line {...config} />;
  };
  

   export default DualLineGraph1;