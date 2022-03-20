import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';


function CircularProgressBar(){
    const data = [
        {
          type: 'Model-1',
          value: 27,
        },
        {
          type: 'Model-2',
          value: 25,
        },
        {
          type: 'Model-3',
          value: 18,
        },
        {
          type: 'Model-4',
          value: 15,
        },
        {
          type: 'Model-5',
          value: 10,
        },
        {
          type: 'Model-6',
          value: 5,
        },
      ];
      const config = {
        appendPadding: 5,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        
        innerRadius: 0.5,
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 12,
          },
        },
        interactions: [
          {
            type: 'element-selected',
          },
          {
            type: 'element-active',
          },
        ],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            content: '',
          },
        },
      };
    return(
        <>
            <Pie {...config} />
        </>
    )
}
export default CircularProgressBar;