import React from "react";
import MNIT from "../assets/mnit jaipur.png";
import Hyperlane from "../assets/hyperlanelogo.png";
import Polygon from "../assets/polygon.png";

const Footer=()=>{
    return(
        <div style={{marginTop: '10px',color: '#9FFF45', display:'flex', flexDirection: 'column',height: 'auto', borderTop: '1px solid gray', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',  backdropFilter: 'blur(10px)', }}>
            
            <div style={{margin: '30px 0 10px 0',color:'white',fontSize:'20px',fontWeight:'700' ,display:'flex', justifyContent: "center", alignItems: 'center'}}>
                Special Thanks to
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap:'wrap'}}>
            <img src={Hyperlane} alt="HYPERLANE" style={{width: '110px', height:'auto', marginRight: '25px'}}/>
                <img src={MNIT} alt="MNIT Jaipur" style={{width: '110px', height:'auto', margin: '0 25px '}}/>
                <img src={Polygon} alt="POLYGON" style={{width: '110px', height:'auto', marginLeft: '25px'}}/>
            </div>
            <div style={{margin: '50px 0 30px 0', display:'flex', justifyContent: "center", alignItems: 'center'}}>
            Made with ❤️ by Team Crypto Crew | 2023 &copy; All Rights Reserved
            </div>
        </div>
    )
}

export default Footer;