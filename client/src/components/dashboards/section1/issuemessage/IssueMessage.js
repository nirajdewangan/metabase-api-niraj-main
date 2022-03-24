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
import { message } from 'antd';
import { globalUri, globalUri2 } from '../../../../app.config';
import ReactPaginate from 'react-paginate';

function IssueMessage() {

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
  const [allIssuesData, setAllIssuesData] = useState([]);

  const [show, setShow] = useState(false);
  const [videoLink, setVideoLink] = useState({});
  const confusionMatrix = [
    [0.69, 0.02, 0.04, 0.06, 0.01, 0.14, 0.04],
    [0.03, 0.70, 0.06, 0.02, 0.07, 0.06, 0.06],
    [0.04, 0.06, 0.66, 0.02, 0.05, 0.06, 0.11],
    [0.02, 0.02, 0.18, 0.51, 0.09, 0.12, 0.06],
    [0.04, 0.08, 0.01, 0.02, 0.80, 0.03, 0.02],
    [0.07, 0.06, 0.03, 0.07, 0.02, 0.67, 0.08],
    [0.11, 0.06, 0.07, 0.05, 0.07, 0.06, 0.58]
  ];

  const labels = ['Class A', 'Class B', 'Class C', 'Class D', 'Class E', 'Class F', 'Class G'];

  const [maindata, setMainData] = useState({})
  const [confusionMatrixData, setConfusionMatrix] = useState({})
  const [frame, setFrameCount] = useState([])
  const [labe, setLabelCount] = useState([])
  const [anamol, setAnamoly] = useState([])
  const [Id, setId] = useState([])

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

  const onHide = () => {
    setShow(false);

  }

  const imgData = (val) => {
    setImageIdnumber(val);
  }

  const playVideo = () => {
    axios.get(globalUri + "getVideoForImageSlider?image_id=" + imageIdnumber)
      .then((res) => {
        let video = res.data.response[0]
        setVideoLink(video);
      })
      .catch((error) => {
        message.error(error.message);
      })
  }

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

    //load model start
    setSelectedModel(localStorage.getItem("selectedModelV"));
    //load model end

    //get configuration start
    let allConfigurations = await getConfigurations();
    if (allConfigurations && allConfigurations.data && allConfigurations.data.payload && allConfigurations.data.payload.data && allConfigurations.data.payload.data.rows) {
      console.log('the start value is ', allConfigurations.data.payload.data.rows[0][0])
      setConfigId(allConfigurations.data.payload.data.rows[0][0])
      setAllConfigurationData(allConfigurations.data.payload.data.rows)
    }
    //get configuration end

    //get issues start
    let allIssues = await getAllIssues();
    console.log("All issues == ", allIssues.data.payload.data.rows);
    if (allIssues && allIssues.data && allIssues.data.payload && allIssues.data.payload.data && allIssues.data.payload.data.rows) {
      setAllIssuesData(allIssues.data.payload.data.rows);
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

              <a href="javascript:void(0);" style={{color : "blue",fontSize : "17px",fontFamily:"georgia",textDecoration:"underline"}} onClick={() => {
                  setPage(3)
                }}>Smart Analysis</a> &nbsp;&nbsp;|&nbsp;&nbsp;

                
                <a href="javascript:void(0);" style={{color : "blue",fontSize : "17px",fontFamily:"georgia",textDecoration:"underline"}} onClick={() => {
                  setPage(2)
                }}>Images</a> 
                &nbsp;&nbsp;|&nbsp;&nbsp;

                <a href="javascript:void(0);" style={{color : "blue",fontSize : "17px",fontFamily:"georgia",textDecoration:"underline"}} onClick={() => {
                  setPage(1)
                }}>Configuration Dashboard</a>

                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="javascript:void(0);" style={{color : "blue",fontSize : "17px",fontFamily:"georgia",textDecoration:"underline"}} onClick={() => {
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

            <div className="row">
              {(page == 0) &&
                (<div className="col-lg-12" style={{ marginTop: "40px" }}>
                  <h4 style={{ fontFamily: "georgia", fontSize: "20px", fontWeight: "bold" }}>Issue List</h4>
                  <div style={{ width: "100%", padding: "10px" }}>
                    {/* {allIssuesData}
              <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/> */}
                    {
                      allIssuesData.map((issue, i) => {
                        console.log("Issue is :: ", issue)
                        return (
                          <>
                            <div style={{ width: "100%", padding: '10px', backgroundColor: "#ffffff", margin: "10px", border: "1px solid #cccccc", borderRadius: "10px" }}>


                              <span style={{ fontFamily: "georgia", fontSize: "20px", color: "red" }}>{i + 1}. </span>
                              <b>{issue[2]}</b> is <b>{issue[3].toFixed(2)}</b> <b>{issue[5]}</b> <b>{issue[4]}</b> under the rule id <b>{issue[0]}</b> and configuration id <b>{issue[1]}</b>
                              <br />
                              <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                                <button style={{ width: "30px", height: "30px" }} className="btn btn-danger btn-sm" onClick={() => {
                                  createJiraIssue("Raga Ai Issue-" + (i + 1), `
                              ${issue[2]} is ${issue[3]} ${issue[5]} ${issue[4]} under the rule id ${issue[0]} and configuration id ${issue[1]}
                              `);
                                }}>+</button> &nbsp;&nbsp;&nbsp;&nbsp;
                                <button style={{ width: "30px", height: "30px" }} className="btn btn-primary btn-sm">
                                  -
                                </button>

                              </div>
                            </div>
                          </>
                        )
                      })
                    }
                  </div>
                </div>)
              }


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
