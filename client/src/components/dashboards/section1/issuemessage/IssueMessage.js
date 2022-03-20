import React, { useState, useRef, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { WarningFilled, PlusCircleOutlined } from "@ant-design/icons";
import Card from "react-bootstrap/Card";
import CircularProgressBar from "../../../circularprogressbar/CircularProgressBar";
import PerformanceChart from '../../../performancechart/PerformanceChart';
import  FirstGraph from '../../../gragh1/FirstGraph';
import  SecondGraph  from '../../../graph2/SecondGraph';
import  ThirdGraph  from '../../../graph3/ThirdGraph';

import ImageBrowser from '../../../imagebrowser/ImageBrowser';
import ModalPopup from '../../../modalpopup/ModalPopup';
import VideoPlayer from '../../../videoplayer/VideoPlayer';
import Matrix from '../../../confusionmatrix/ConfusionMatrix';
import axios from 'axios';
import {GetMainTableData,GetFrameCount,GetLabelCount,GetAnamolyCount} from "../../../../services/Service"
import {  message } from 'antd';
import { globalUri } from '../../../../app.config';

function IssueMessage() {

  const [show,setShow] = useState(false);
  const [videoLink,setVideoLink] = useState({});
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

  const [maindata,setMainData] = useState({})
  const [confusionMatrixData,setConfusionMatrix] = useState({})
  const [frame,setFrameCount] = useState([])
  const [labe,setLabelCount] = useState([])
  const [anamol,setAnamoly] = useState([])
  const [Id,setId] = useState([])
  
  const [imageIdnumber,setImageIdnumber] = useState(0);
  
  //let idNumber = 0;
  const onHide = ()=>{
    setShow(false);
    
  }

  const imgData = (val)=>{   
    setImageIdnumber(val);
  }

  const playVideo = () => {
    axios.get(globalUri+"getVideoForImageSlider?image_id="+imageIdnumber)
    .then((res) => {
      let video = res.data.response[0]
      setVideoLink(video);
    })
    .catch((error)=>{
        message.error(error.message);
    })
  }

  useEffect(async()=>{
    let mainData = await GetMainTableData("yolov1");
    setMainData(mainData);
    let frameCount = await GetFrameCount("yolov1");
    setFrameCount(frameCount);
    // let labelCount = await GetLabelCount("yolov1");
    // setLabelCount(labelCount);
    // let anamolycount = await GetAnamolyCount("yolov1");
    // setAnamoly(anamolycount);
  },[imageIdnumber])

  return (
    <>
      <Row>
        <Col>
          <Row>
            <Col
              xs={12}
              sm={12}
              md={6}
              style={{ height: "200px", overflow: "auto", paddingTop: "20px" }}
            >
              <Row>
                <Col xs={12} sm={12} md={3} style={{ textAlign: "center" }}>
                  <div className="danImg"
                    style={{
                      
                      paddingLeft: "100px",
                      marginTop: "30px",
                    }}
                  >
                    <WarningFilled
                      style={{
                        fontSize: "48px",
                        color: "#BF1F09",
                        textAlign: "center",
                      }}
                    />
                    <b>
                      <a href="#">Rules</a>
                    </b>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={8}>
                  <b>
                    1) The False Positive is higher than 40% in the following
                    usecases
                  </b>
                  <Row>
                    <Col md={6}>
                      <p>Configuration 1</p>
                      <p>Configuration 2</p>
                    </Col>
                    <Col md={6} style={{ textAlign: "right" }}>
                      <PlusCircleOutlined style={{ fontSize: "20px" }} />
                    </Col>
                  </Row>
                  <b>
                    2) The False Negative is higher than 40% in the following
                    usecases
                  </b>
                  <Row>
                    <Col md={6}>
                      <p>Configuration 1</p>
                      <p>Configuration 2</p>
                    </Col>
                    <Col md={6} style={{ textAlign: "right" }}>
                      <PlusCircleOutlined style={{ fontSize: "20px" }} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={5}
              style={{ height: "200px", overflow: "auto", paddingTop: "20px" }}
            >
              <Row>
                <Col xs={12} sm={12} md={2}>
                  <div className="danImg"
                    style={{
                      
                      paddingLeft: "30px",
                      marginTop: "30px",
                    }}
                  >
                    <WarningFilled
                      style={{ fontSize: "48px", color: "#D09905" }}
                    />
                    <b>
                      <a href="#">Rules</a>
                    </b>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={10}>
                  <b>
                    1) The False Positive is higher than 40% in the following
                    usecases
                  </b>
                  <Row>
                    <Col md={6}>
                      <p>Configuration 1</p>
                      <p>Configuration 2</p>
                    </Col>
                    <Col md={4} style={{ textAlign: "right" }}>
                      <PlusCircleOutlined style={{ fontSize: "20px" }} />
                    </Col>
                  </Row>
                  <b>
                    2) The False Negative is higher than 40% in the following
                    usecases
                  </b>
                  <Row>
                    <Col md={6}>
                      <p>Configuration 1</p>
                      <p>Configuration 2</p>
                    </Col>
                    <Col md={4} style={{ textAlign: "right" }}>
                      <PlusCircleOutlined style={{ fontSize: "20px" }} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row className="mt-5">
                <Col xs={12} sm={12} md={1}></Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Select aria-label="Default select example">
                    <option>Issue Configuration</option>
                    <option value="1">New</option>
                    <option value="2">View1</option>
                    <option value="3">View2</option>
                    <option value="4">View3</option>
                  </Form.Select>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Select aria-label="Default select example">
                    <option>Tag/MetaData for Time of the Day</option>
                    <option value="1">New</option>
                    <option value="2">View1</option>
                    <option value="3">View2</option>
                    <option value="4">View3</option>
                  </Form.Select>
                </Col>
                <Col xs={12} sm={12} md={3}>
                  <Form.Select aria-label="Default select example">
                    <option>Tag/MetaData: Weather</option>
                    <option value="1">New</option>
                    <option value="2">View1</option>
                    <option value="3">View2</option>
                    <option value="4">View3</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Col xs={12} sm={12} md={1}></Col>
                <Col xs={12} sm={12} md={2}>
                  <Card style={{ width: "85%" }}>
                    <Card.Body>
                      <Card.Text>
                      <div  style={{height:'120px'}}>
                        <h2>9</h2>
                        <b>Number of classes</b>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={2}>
                  <Card style={{ width: "85%" }}>
                    <Card.Body>
                      <Card.Text>
                      <div style={{height:'120px'}}>
                      <h2>1</h2>
                        <b>Number of frames</b>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={2}>
                  <Card style={{ width: "85%"}}>
                    <Card.Body>
                      <Card.Text>
                      <div style={{height:'120px'}}>
                      <h2>64,714</h2>
                      <b>Number of dettections</b>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={2}>
                  <Card style={{ width: "85%"}}>
                    <Card.Body>
                      <Card.Text>
                      <div style={{height:'120px'}}>
                        <h2>1</h2>
                        <b>Number of instance</b>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={2}>
                  <Card >
                    <Card.Body>
                      <Card.Text>
                        <div style={{height:'120px'}}>
                        <CircularProgressBar/>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={1}></Col>
              </Row>

              <Row className="mb-3 mt-3">
              <Col xs={12} sm={12} md={1}></Col>
                  <Col xs={12} sm={12} md={5}>
                      <Matrix  data={confusionMatrix} labels={labels}/>
                    </Col>
                  <Col xs={12} sm={12} md={5} style={{border:'1px solid lightgrey',borderRadius:'5px'}}>
                  <b>Classifier Performance</b>
                      <Row>
                        <Col>  </Col>
                      </Row>
                      <PerformanceChart maindata={maindata}/>
                  </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} sm={12} md={12}>
                    <Row>
                      <Col xs={12} sm={12} md={1}></Col>
                        <Col xs={12} sm={12} md={3}>
                          <Form.Select aria-label="Default select example">
                            <option>Issue Configuration</option>
                            <option value="1">Configuration 1</option>
                            <option value="2">Configuration 2</option>
                            <option value="3">Configuration 3</option>
                            <option value="4">Configuration 4</option>
                        </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={1}></Col>
                      <Col xs={12} sm={12} md={3} style={{border:'1px solid lightgrey',borderRadius:'5px', padding:'10px',margin:'20px 20px 5px 5px'}}>
                          <FirstGraph data={frame} capture_date={"capture_date"} scales={"capture_time"}/>
                          Frame Count
                      </Col>
                      <Col xs={12} sm={12} md={3} style={{border:'1px solid lightgrey',borderRadius:'5px', padding:'10px',margin:'20px 20px 5px 5px'}}>
                          <SecondGraph />
                          Label Count
                      </Col>
                      <Col xs={12} sm={12} md={3} style={{border:'1px solid lightgrey',borderRadius:'5px', padding:'10px',margin:'20px 20px 5px 5px'}}>
                          <ThirdGraph />
                          Anamoly Count
                      </Col>
                    </Row>
                    <Row className="mt-4 mb-5">
                       <Col xs={12} sm={12} md={2}></Col>
                        <Col xs={12} sm={12} md={3} >
                          {/* <Form.Range  className="mt-5"></Form.Range> */}
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-5">
                       <Col xs={12} sm={12} md={1}></Col>
                        <Col xs={12} sm={12} md={5}>
                              <ImageBrowser show={(id)=>{imgData(id)}}/>
                        </Col>
                        <Col xs={12} sm={12} md={4}>
                          <Row>
                            <Col>
                              <Form.Select aria-label="Default select example">
                                  <option>Video Length</option>
                                  <option value="1">10 Sec</option>
                                  <option value="2">30 Sec</option>
                                  <option value="3">1 Min</option>
                              </Form.Select>
                            </Col>
                          </Row>
                          <Row className="text-center">
                            <Col>
                               <Button variant="secondary" onClick={() => {setShow(true);playVideo()}}  className="mt-3">Play Video</Button>
                            </Col>
                          </Row>
                              <ModalPopup show={show} onHide={onHide} pop={<VideoPlayer src={videoLink} />} />
                        </Col>
                    </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default IssueMessage;
