import { useEffect } from "react";


function ColorCMP(props){

    useEffect(()=>{

    },[props])
    return(
        <>
        {
            (props.col == "good") ? <div style={{backgroundColor:"green",width:"40px",height:"40px",borderRadius:'65%'}}></div> 
                : (props.col == "average") ? <div style={{backgroundColor:"orange",width:"40px",height:"40px",borderRadius:'65%'}}></div> 
                : (props.col == "poor") ? <div style={{backgroundColor:"yellow",width:"40px",height:"40px",borderRadius:'65%'}}></div> 
                : (props.col == "bad") ? <div style={{backgroundColor:"red",width:"40px",height:"40px",borderRadius:'65%'}}></div> : ""
            
        
        }
        </>
    )
}

export default ColorCMP;