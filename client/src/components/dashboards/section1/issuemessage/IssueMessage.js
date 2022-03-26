import React, { useState, useRef, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { WarningFilled, PlusCircleOutlined } from "@ant-design/icons";
import Card from "react-bootstrap/Card";
import CircularProgressBar from "../../../circularprogressbar/CircularProgressBar";
import PerformanceChart from '../../../performancechart/PerformanceChart';
import FirstGraph from '../../../gragh1/FirstGraph';
import SecondGraph from '../../../graph2/SecondGraph';
import ThirdGraph from '../../../graph3/ThirdGraph';

import ImageBrowser from '../../../imagebrowser/ImageBrowser';
import ModalPopup from '../../../modalpopup/ModalPopup';
import VideoPlayer from '../../../videoplayer/VideoPlayer';
import Matrix from '../../../confusionmatrix/ConfusionMatrix';
import axios from 'axios';
import { GetMainTableData, GetFrameCount, GetLabelCount, GetAnamolyCount } from "../../../../services/Service"
import { AutoComplete, message } from 'antd';
import { globalUri, globalUri2 } from '../../../../app.config';
import ReactPaginate from 'react-paginate';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "./IssueMessage.css";

function IssueMessage() {
  const [rowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
  ]);

  const [allIssuesData, setAllIssuesData] = useState([]);
  const [columnDefs] = useState([
    { field: 'Serial #', sortable: true, filter: true },
    {
      field: 'configuration', sortable: true, filter: true, cellRenderer: (props) => {
        return (
          <a href="javascript:void(0);" data-toggle="tooltip" data-placement="right" title="Configuration – States or environmental settings in which the issues occurred.

          " onClick={() => {
            // alert(props.value);
            setConfigId(props.value);
            setPage(1);
          }}>{props.value}</a>
        )
      }
    },
    { field: 'Issue Type', sortable: true, filter: true },
    { field: 'Field Estimate', sortable: true, filter: true },
    { field: 'Target Value', sortable: true, filter: true },
    { field: 'Deviance', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    {
      field: 'action', cellRenderer: (props) => {
        console.log("==> ", props)
        return <button onClick={() => {
          console.log("$$$$$$$$$$$$$$ : ", props.value);
          createJiraIssue("Raga Ai Issue-", props.value);
        }} className="btn btn-primary btn-sm" style={{ fontFamily: "georgia" }}>Push to Jira</button>
      }
    }
  ])
  //ReactPaginate
  //   const [offset, setOffset] = useState(0);
  // const [perPage] = useState(10);
  // const [pageCount, setPageCount] = useState(0)


  const [showModel, setShowModel] = useState(false);
  const [page, setPage] = useState(0);

  const handleClose = () => {
    setShowModel(false)

  };
  const handleShow = () => {
    setShowModel(true)

    setTimeout(function () {
      videoReference();
    }, 1000);

  };


  const videoReference = () => {
    var videoRef = document.getElementById("id1");
    console.log("Video time is ", parseInt(videoTm));
    videoRef.currentTime = parseInt(videoTm);
    videoRef.play();

  }
  const [allConfigurationsData, setAllConfigurationData] = useState([]);


  const [imageIdnumber, setImageIdnumber] = useState(0);
  const [configId, setConfigId] = useState(0);
  const [currentImg, setCurrentImg] = useState(null);
  const [nextImg, setNextImg] = useState(null);
  const [videoTm, setVideoTm] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");

  console.log("loading the scatter chart")

  //load configuration data start
  const getConfigurations = async () => {
    return axios.get(globalUri2 + "/api/raga/get_all_configurations");
  }
  //load configuration data end

  //load issues data start
  const getAllIssues = async () => {
    return axios.get(globalUri2 + "/api/raga/get_all_issues");
  }
  //load issues data end

  const getNextImage = async (id, name, configId, selectedModel) => {
    // setCurrentImg(null)
    let nextImg = await axios.get(globalUri2 + "/api/raga/get_next_image/" + id + "/" + name + "/" + configId + "/" + selectedModel)
    if (nextImg && nextImg.data && nextImg.data.payload && nextImg.data.payload.data && nextImg.data.payload.data.rows && nextImg.data.payload.data.rows[0]) {
      console.log("The next image is ", nextImg.data.payload.data.rows[0])
      let imgObj = nextImg.data.payload.data.rows[0];
      setCurrentImg({
        url: imgObj[0],
        videoUrl: imgObj[3],
        nextId: imgObj[2],
        nextName: imgObj[1]
      });
    }
  }

  const getPreImage = async (id, name, configId, selectedModel) => {
    // setCurrentImg(null)
    let nextImg = await axios.get(globalUri2 + "/api/raga/get_pre_image/" + id + "/" + name + "/" + configId + "/" + selectedModel)
    if (nextImg && nextImg.data && nextImg.data.payload && nextImg.data.payload.data && nextImg.data.payload.data.rows && nextImg.data.payload.data.rows[0]) {
      console.log("The next image is ", nextImg.data.payload.data.rows[0])
      let imgObj = nextImg.data.payload.data.rows[0];
      setCurrentImg({
        url: imgObj[0],
        videoUrl: imgObj[3],
        nextId: imgObj[2],
        nextName: imgObj[1]
      });
    }
  }

  const createJiraIssue = async (issueTitle, issueDes) => {
    console.log("inside createIssue ", issueTitle, issueDes);
    let jiraStt = await axios.post(globalUri2 + "/api/raga/create_jira_issue", {
      issueTitle: issueTitle,
      issueDes: issueDes
    })
    console.log('the jira create status is ', jiraStt);
    alert("Jira issue created : " + issueDes);
  }

  useEffect(async () => {
    populateTxt("Issues Table","Summary of performance issues captured from field data");
    //load model start
    setSelectedModel(localStorage.getItem("selectedModelV"));
    //load model end

    //get configuration start
    let allConfigurations = await getConfigurations();
    if (allConfigurations && allConfigurations.data && allConfigurations.data.payload && allConfigurations.data.payload.data && allConfigurations.data.payload.data.rows) {
      console.log('the config start value is ', allConfigurations.data.payload.data.rows[0][0])
      setConfigId(allConfigurations.data.payload.data.rows[0][0])
      setAllConfigurationData(allConfigurations.data.payload.data.rows)
    }
    //get configuration end

    //get issues start
    let allIssues = await getAllIssues();
    console.log("All issues == ", allIssues.data.payload.data.rows);
    if (allIssues && allIssues.data && allIssues.data.payload && allIssues.data.payload.data && allIssues.data.payload.data.rows) {

      let rawData = allIssues.data.payload.data.rows;
      let finalData = [];
      finalData = rawData.map((issue,i) => {
        return {
          "Serial #": (i+1),//issue[0] + "",
          configuration: issue[1] + "",
          "Issue Type": issue[2] + "",
          "Field Estimate": issue[3] + "",
          "Target Value": issue[4] + "",
          "Deviance": issue[5] + "",
          model: issue[6] + "",
          action: `${issue[2]} is ${issue[3].toFixed(2)} ${issue[5]} ${issue[4]} under the rule id ${issue[0]} and configuration id ${issue[1]}`

        }

      })
      console.log("$$$$$$$$$$ ", finalData)
      setAllIssuesData(finalData);
      // rowData
    }
    //get issues end

    //get next image start
    getNextImage(null, null, allConfigurations.data.payload.data.rows[0][0], localStorage.getItem("selectedModelV"));
    //get next image end
  }, [])

  //ReactPaginate
  //   const getData = async() => {
  //     let allIssues = await getAllIssues();
  //     console.log("All issues == ", allIssues.data.payload.data.rows);



  //     if (allIssues && allIssues.data && allIssues.data.payload && allIssues.data.payload.data && allIssues.data.payload.data.rows) {
  //       // setAllIssuesData(allIssues.data.payload.data.rows);

  //     const data = allIssues.data.payload.data.rows;
  //               const slice = data.slice(offset, offset + perPage)
  //               const postData = slice.map(pd => <div key={pd.id}>
  //                   <p>{pd.title}</p>
  //                   <img src={pd.thumbnailUrl} alt=""/>
  //               </div>)
  //               setAllIssuesData(postData)
  //               setPageCount(Math.ceil(data.length / perPage))
  //               }         
  // }

  // useEffect(() => {
  //   getData()
  // }, [offset])

  // const handlePageClick = (e) => {
  //   const selectedPage = e.selected;
  //   setOffset(selectedPage + 1)
  // };

  const populateTxt = (heading,des)=>{
    document.getElementById("desId").innerHTML = heading;
    document.getElementById("desTxt").innerHTML = des;
  }

  return (
    <>
      {
        configId && (
          <>
            {/* <div className="jumbotron" style={{ marginTop: "100px" }}>
              <h6>Config Dashboard</h6>
            </div> */}

            <div className="row">
              <div className="col-lg-12" style={{ display: "flex", flexDirection: "row-reverse" }}>

                <a href="javascript:void(0);" style={{ color: "blue", fontSize: "17px", fontFamily: "georgia", textDecoration: "underline" }} onClick={() => {
                  populateTxt("Smart Analysis","Visualization of field data points as clusters, segregated by states and environmental settings.");
                  setPage(3)
                }}>Smart Analysis</a> &nbsp;&nbsp;|&nbsp;&nbsp;


                <a href="javascript:void(0);" style={{ color: "blue", fontSize: "17px", fontFamily: "georgia", textDecoration: "underline" }} onClick={() => {
                  populateTxt("Images","Sample images from the configurations (states in which the issues occurred)");
                  setPage(2)
                }}>Images</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;

                <a href="javascript:void(0);" style={{ color: "blue", fontSize: "17px", fontFamily: "georgia", textDecoration: "underline" }} onClick={() => {
                  populateTxt("Configuration Dashboard","AI system estimates of states or environmental settings in which the issues occurred");
                  setPage(1)
                }}>Configuration Dashboard</a>

                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="javascript:void(0);" style={{ color: "blue", fontSize: "17px", fontFamily: "georgia", textDecoration: "underline" }} onClick={() => {
                  populateTxt("Issues Table","Summary of performance issues captured from field data");
                  setPage(0)
                }}>Issue List</a>

                {/* <button className="btn btn-default" onClick={() => {
                  setPage(3)
                }} style={{ fontFamily: "georgia", fontSize: "15px", border: "0px solid #cccccc", color: "blue", textDecoration: "underline" }}>Smart Analysis</button> 

                | <button className="btn btn-default" onClick={() => {
                  setPage(2)
                }} style={{ fontFamily: "georgia", fontSize: "15px", border: "0px solid #cccccc", color: "blue", textDecoration: "underline" }}>Images</button> |

                <button className="btn btn-default" onClick={() => {
                  setPage(1)
                }} style={{ fontFamily: "georgia", fontSize: "15px", border: "0px solid #cccccc", color: "blue", textDecoration: "underline" }}>Configuration Dashboard</button>

                | <button className="btn btn-default" onClick={() => {
                  setPage(0)
                }} style={{ fontFamily: "georgia", fontSize: "15px", border: "0px solid #cccccc", color: "blue", textDecoration: "underline" }}>Issue List</button>  */}

                {/* -- */}











              </div>
              
            </div>

            <div className="row" style={{ marginTop: "30px" }}>

              {/* start */}

              {
                (page == 0) && allIssuesData.length > 0 && (<div className="ag-theme-alpine" style={{ height: "600px", width: "100%" }}>
                  <AgGridReact
                    rowData={allIssuesData} pagination={true} paginationPageSize="10"
                    rowHeight={50}
                    columnDefs={columnDefs}>
                  </AgGridReact>
                </div>)
              }
              {/* end */}

              {(page == 1) &&
                (<div className="col-lg-12" style={{ marginTop: "40px" }}>
                  <h4 style={{ fontFamily: "georgia", fontSize: "20px", fontWeight: "bold" }}>Configuration Table</h4>
                  <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-lg-4">

                      <select className="form-control" name="config" onChange={(evt) => {
                        console.log('the event is ', evt.target.value);
                        setConfigId(evt.target.value);

                      }}>
                        {
                          allConfigurationsData.map((config) => {
                            return (<>
                              <option value={config[0]}>Configuration-{config[0]}</option>
                            </>)
                          })
                        }
                      </select>

                    </div>
                    <div className="col-lg-8">

                    </div>
                  </div>

                  <div className="row" style={{ marginTop: "20px" }}>
                    <iframe width="100%" height="2800px" src={`http://3.6.67.248:3000/public/dashboard/1f03136c-37c7-484e-85d2-f74d71aae0be?configuration_id=${configId}&model=${selectedModel}`} frameborder="0" allowtransparency
                      id="iframeconfig"

                    ></iframe>
                  </div>
                </div>)

              }


              {(page == 2) &&
                (<div className="row" style={{ marginTop: "40px" }}>
                  <h4 style={{ fontFamily: "georgia", fontSize: "20px", fontWeight: "bold" }}>Configuration Images</h4>

                  <div className="col-lg-8">
                    <div style={{
                      border: "1px solid #eeeeee", padding: "20px", backgroundImage: "url(" + currentImg?.url + ")",
                      // backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      width: "100%",
                      height: "500px",
                      margin: "auto",
                      transition: "all 50ms linear 1s"
                    }}></div>

                    {/* <img src={currentImg.url} width="600px" height="500px"/> */}

                    <div style={{ width: "70%", backgroundColor: "#ffffff", margin: "auto", marginTop: "20px" }}>
                      <button className="btn btn-default float-left" style={{ width: "100px" }} onClick={async () => {
                        getPreImage(currentImg?.nextId, currentImg?.nextName, configId, selectedModel);

                      }}> Previous</button>

                      <button className="btn btn-default float-right" style={{ width: "100px", marginLeft: "250px" }} onClick={async () => {
                        getNextImage(currentImg.nextId, currentImg.nextName, configId, selectedModel);

                      }}>Next</button>
                    </div>
                  </div>



                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-4">
                        <select id="videoTime" className="form-control" onChange={(evt) => {
                          console.log("The selected time ", evt.target.value);
                          setVideoTm(evt.target.value);
                        }}>
                          <option value="0">select Time</option>
                          <option value="10">10 sec</option>
                          <option value="30">30 sec</option>
                          <option value="60">1 Minute</option>
                        </select>
                      </div>


                      <div className="col-lg-4">
                        <button className="btn btn-warning" style={{ width: "100px" }} onClick={() => {
                          handleShow();
                        }}>Play</button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12" >
                        {

                          // (currentImg && currentImg.videoUrl) ?
                          //   (<>
                          //     {/* Video : {currentImg.videoUrl} */}
                          //     <video id="id1" width="100%" height="400px" controls>
                          //       <source src={currentImg.videoUrl} type="video/mp4" />
                          //       <source src={currentImg.videoUrl} type="video/ogg" />
                          //       Your browser does not support the video tag.
                          //     </video></>) : (<><h6>Loading..</h6></>)
                        }

                        <Modal show={showModel} onHide={handleClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>Configuration Video</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            {

                              (currentImg && currentImg.videoUrl) ?
                                (<>
                                  {/* Video : {currentImg.videoUrl} */}
                                  <video id="id1" width="100%" height="400px" controls onLoad={() => {
                                    var videoRef = document.getElementById("id1");
                                    console.log("Video time is ", parseInt(videoTm));
                                    videoRef.currentTime = parseInt(videoTm);
                                    videoRef.play();
                                  }
                                  }>
                                    <source src={currentImg.videoUrl} type="video/mp4" />
                                    <source src={currentImg.videoUrl} type="video/ogg" />
                                    Your browser does not support the video tag.
                                  </video></>) : (<><h6>Loading..</h6></>)
                            }

                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>

                          </Modal.Footer>
                        </Modal>


                      </div>
                    </div>
                  </div>
                </div>)
              }

              {(page == 3) &&
                (<div className="col-lg12" style={{ marginTop: "40px" }}>
                  <h4 style={{ fontFamily: "georgia", fontSize: "20px", fontWeight: "bold" }}>Configuration Datapoint</h4>
                  <iframe width="100%" height="600px" src={`/loadScatterChart`} frameborder="0" allowtransparency></iframe>
                </div>)
              }

              {/* <div className="jubotron">
                <p>
                  Copyright : @raga.ai
                </p>
                <h6>
                  Statics & data
                </h6>

              </div> */}
            </div>
          </>)
      }
    </>
  );
}

export default IssueMessage;
