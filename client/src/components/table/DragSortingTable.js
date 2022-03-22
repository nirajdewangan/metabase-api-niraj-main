import React, { useState, useCallback, useRef, useEffect } from "react";
// import { Redirect } from 'react-router-dom';
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Table } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import Drift from "../drift/Drift";
import ConfidencePlot from "../plot/ConfidencePlot";
import InferTimePlot from "../plot/InferTimePlot";
import DataDriftPlot from "../plot/DataDriftPlot"
import UptimePlot from "../plot/UptimePlot"
import { GetSummary } from "../../services/Service";
import { CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import ColorCMP from '../colorcmp/ColorCMP';
import "./DragSortingTable.css"
// import {useHistory} from "react-router-dom";

const type = "DraggableBodyRow";

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  // let history = useHistory();
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward"
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    }
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ cursor: "move", ...style }}
      {...restProps}
    />
  );
};

const columns = [
  {
    title: "Model Name",
    dataIndex: "model_name",
    render: (text) => {
      return (<>
        <button style={{ cursor: "pointer" }} className="btn btn-default" onClick={() => {
          console.log("selected model is ",text)
          localStorage.setItem("selectedModelV", text);
          // return <Redirect to="/IssueMessage"/>
          window.location.href="/IssueMessage"
        }}>
          {text}
        </button>
        {/* <a href="/IssueMessage">{text}</a> */}
      </>)

    },
  },
  {
    title: "Instances",
    dataIndex: "num_instances",

  },
  {
    title: "Health",
    dataIndex: "health",

  },
  {
    title: "Drift",
    dataIndex: "drift",

  },
  {
    title: "Retraining",
    dataIndex: "needs_retraining",

  },
  {
    title: "Confidence",
    dataIndex: "confidence",

  },
  {
    title: "Inference Time",
    dataIndex: "infer_time",

  },
  {
    title: "Up Time",
    dataIndex: "uptime",

  },
  {
    title: "Data Drift",
    dataIndex: "data_drift",

  },
];
// const rowSelection = {
//   // onChange: (selectedRowKeys, selectedRows) => {
//   //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   // },
//   getCheckboxProps: (record) => ({
//     disabled: record.name === 'Disabled User',
//     // Column configuration not to be checked
//     name: record.name,
//   }),
// };
const DragSortingTable = (props) => {
  // let history = useHistory();
  const [data, setData] = useState([]);
  let draft = [];
  const components = {
    body: {
      row: DraggableBodyRow
    }
  };
  const [summaryData, setSummaryData] = useState([])
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow]
          ]
        })
      );
    },
    [data]
  );

  let summary = []
  let count = 0;


  const InitialLoad = async () => {
    console.log("propsnumDays", props.numDays);
    var summary = await GetSummary(props.numDays);
    //console.log("inside dashboard")
    setSummaryData(summary)
    console.log("I am summary :", summary);

    // console.log("drag table");
    console.log("props-summary", props.numDays);

    //  let summary = props.summary;

    summary.forEach((item, index) => {
      let values = {
        model_name: "",
        num_instances: "",
        health: "",
        drift: "",
        needs_retraining: "",
        confidence: "",
        data_drift: "",
        infer_time: "",
        uptime: "",
        key: "",
        enabled: false
      }
      values.key = index + 1;
      if (values.key == 2 || values.key == 3) {
        values.enabled = true;
      }
      values.model_name = item.model_name;
      values.num_instances = item.num_instances;
      values.health = <ColorCMP col={item.health} />;
      values.drift = <Drift driftData={item.drift} />;
      values.needs_retraining = values.needs_retraining = (item.needs_retraining == "yes") ? <CheckCircleFilled style={{ color: 'red', fontSize: "20px" }} /> : <CloseCircleFilled style={{ color: 'green', fontSize: "20px" }} />;
      if (item.confidence != null && item.confidence != undefined) {
        values.confidence = <ConfidencePlot confidenceData={item.confidence} date={item.timestamp} />;
      }
      if (item.data_drift != null && item.data_drift != undefined) {
        values.data_drift = <DataDriftPlot dataDriftData={item.data_drift} date={item.timestamp} />;
      }
      if (item.infer_time != null && item.infer_time != undefined) {
        values.infer_time = <InferTimePlot infer_timeData={item.infer_time} date={item.timestamp} />;
      }
      if (item.uptime != null && item.uptime != undefined) {
        values.uptime = <UptimePlot uptimeData={item.uptime} date={item.timestamp} />;
      }
      draft.push(values)
    })

    setData(draft);
  }


  useEffect(async () => {
    InitialLoad();
  }, [props])

  return (
    <DndProvider backend={HTML5Backend}>
      <Table

        dataSource={data}
        // components={components}
        onRow={(record, index) => ({
          index,
          moveRow
        })}
        rowClassName={record => !record.enabled && "disabled-row"}
        columns={columns}
      />
    </DndProvider>
  );
};

export default DragSortingTable;
