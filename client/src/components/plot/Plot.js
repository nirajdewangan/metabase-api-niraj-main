import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

const Plot = () => {
  const data = [
    {
      type: '10',
      value: 0.16,
    },
    {
      type: '20',
      value: 0.125,
    },
    {
      type: '30',
      value: 0.24,
    },
    {
      type: '40',
      value: 0.19,
    },
    {
      type: '50',
      value: 0.22,
    },
    {
      type: '60',
      value: 0.05,
    },
    {
      type: '70',
      value: 0.01,
    },
    {
      type: '80',
      value: 0.015,
    },
  ];
  const paletteSemanticRed = '#F4664A';
  const brandColor = '#5B8FF9';

  useEffect(()=>{
    console.log("inside plot");
    console.log(props);
  },[])
  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    color: ({ type }) => {
      if (type === '10-30分' || type === '30+分') {
        return paletteSemanticRed;
      }

      return brandColor;
    },
    label: {
      content: (originData) => {
        const val = parseFloat(originData.value);

        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }
      },
      offset: 2,
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return <Column {...config} />;
};

export default Plot;