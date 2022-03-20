import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Gauge } from '@ant-design/plots';

const Drift = (props) => {

useEffect(()=>{
 
},[props])

  const config = {
    percent:  props.driftData,
    radius: 80,
    range: {
      ticks: [0, 1 / 3, 2 / 3, 1],
      color: ['#30BF78','#FAAD14','#F4664A'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
          fontSize:'8px'
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
          fontSize:'8px'
        },
      },

    },
    
  };
  return <Gauge {...config} />;
};

export default Drift;
