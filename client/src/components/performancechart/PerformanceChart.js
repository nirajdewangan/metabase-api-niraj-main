import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

const PerformanceChart = (props) => {
    const data = [
        {
          type: 'S2-Precision',
          value: props.maindata.precision,
        },
        {
          type: 'S2-Recall',
          value: props.maindata.recall,
        },
        {
          type: 'S2-Accurancy',
          value: props.maindata.confidence,
        },
        {
          type: 'S2-F1 Score',
          value: props.maindata.iou,
        },
        {
          type: 'S2-Specificity',
          value: '',
        },
        {
          type: 'S2-Youden Index',
          value: props.maindata.infer_time,
        },
        
      ];
      const paletteSemanticRed = '#F4664A';
      const brandColor = '#5B8FF9';
      const config = {
        data,
        xField: 'type',
        yField: 'value',
        seriesField: 'type',
        color: ({ type }) => {
          if (type === 'S2-Precision') {
            return '#CBF5EB';
          }
          if (type === 'S2-Recall') {
            return '#F5E1CB';
          }
          if (type === 'S2-Accurancy') {
            return '#F5CBE8';
          }
          if (type === 'S2-F1 Score') {
            return '#CEBBE9';
          }
          if (type === 'S2-Youden Index') {
            return '#F5F3CA';
          }
    
          return brandColor;
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

export default PerformanceChart;
