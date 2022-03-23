import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

const ConfidencePlot = (props) => {
  const [data,setData] = useState([])
  let data1 = [];
  let count = 0;
  const paletteSemanticRed = '#F4664A';
  const brandColor = '#5B8FF9';
 
  const InitialLoad = ()=>{
    //let values = { type: "",value: ""};
    //let draftData = [];
    // let i = new Date().getDate();
    // i=parseInt(i);
    // i= i-5;
    for(let i=0;i<props.confidenceData.length;i++){
      let values = { type: "",value: ""};
      values.type = props.date[i];
      values.value = props.confidenceData[i];
      data1.push(values);
    }
    // props.confidenceData.forEach((item)=>{
    //   let values = { type: "",value: ""};
    //   if(i==14){
    //     values.type= 14;
    //     i++;
    //   }
    //   else{
        
    //     values.type= i;
    //     i++;
        
    //   }
      
    //   values.value=item;

    //   data1.push(values);
    // })
    setData(data1);
  }
  useEffect(()=>{
    if(count == 0){
      InitialLoad();
      count++;
    }
  },[props])
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
      line: { style: { stroke: '#aaa' } },
    },
    yAxis: {
      grid: { line: { style: { stroke: '#fff' } } },
      line: { style: { stroke: '#aaa' } },
    },

  };
  return <Column {...config} />;
};

export default ConfidencePlot;