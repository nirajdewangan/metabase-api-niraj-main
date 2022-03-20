import React, { useEffect } from 'react'


function VideoPlayer(props){
    useEffect(()=>{
        console.log("src",props.src)
    })
    return(
        <>
            
            <video width="100%" height="100%" controls muted>
                <source src={props.src.video} type="video/mp4"/>
                <source src="movie.ogg" type="video/ogg" />
                Your browser does not support the video tag.
             </video>

        </>
    )
}

export default VideoPlayer;