import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { globalUri } from '../../app.config';
import axios from 'axios';  
import {  message } from 'antd';

const ThirdGraph = ()=>{
    
    const [data,setData] = useState([])
    
  useEffect(()=>{
    axios.get(globalUri+"plotAnamolyCountGraph")
    .then((res) => {
       if(res.data.response!=null)
       {
        setData(res.data.response)
       }
    })
    .catch((error)=>{
        message.error(error.message);
    })
    },[])
   
    
  const config = {
    data,
    padding: 'auto',
    xField: 'capture_date',
    yField: 'anomoly',
    xAxis: {
      tickCount: 3,
    },
   
  };

  return <Line {...config} />;
};


export default ThirdGraph;