import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from '../../assects/images/image1.jpg';
import image2 from '../../assects/images/image2.jpg';
import image3 from '../../assects/images/image3.jpg';
import image4 from '../../assects/images/image4.jpg';
import {  message } from 'antd';
import { globalUri } from '../../app.config';
import axios from 'axios';  
import React, { useEffect, useState} from 'react';
const imm = [{"ima":image1,"id":1},{"ima":image2,"id":2},{"ima":image3,"id":3},{"ima":image4,"id":4}];
class ImageBrowser extends React.Component {
  items = [1, 2, 3, 4, 5]
  constructor(props){
    super(props)
    this.state = {
    currentIndex: 0,
    responsive: { 1024: { items: 3 } },
    galleryItems: [],
    imageList:[]
  }
  }
  
componentDidMount(){
  axios.get(globalUri+"getAllImageSlider")
      .then((res) => {
       let imageData=res.data.response;
       this.setState({ imageList: imageData })
        let imageTagData = imageData.map((item) => {
          return (
            <>
              <img src={item.images} style={{width:'100%',height:'450px'}}  className="sliderimg" alt="" />
            </>
          );
        })
        this.setState({ galleryItems: imageTagData })
        this.onSlideChanged(0)

      })
      .catch((error)=>{
          message.error(error.message);
      })
}
  
  onSlideChanged = (e) => {
    if(e==0){
      this.props.show(this.state.imageList[0].image_id)
    }
    else{
      this.props.show(this.state.imageList[e.item].image_id)
    }
    
   
  }

 

  // galleryItems() {
  //   return this.items.map((i) => <h2 key={i}> {i}</h2>)
  // }

  render() {
    const { galleryItems, responsive, currentIndex } = this.state
    return (
      <div>
        <AliceCarousel
          dotsDisabled={true}
          buttonsDisabled={true}
          items={galleryItems}
          //responsive={responsive}
         // slideToIndex={currentIndex}
          onSlideChanged={this.onSlideChanged}
        />
      </div>
    )
  }
}

export default ImageBrowser;