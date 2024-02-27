
import React from 'react'
import "./LoadingAnimation.scss"
const CustomerLoadingAnmiation = ({bgcolor,progress,height}) => {
    const Parentdiv = {
        textAlign:'center',
        height: height,
        width:'461px',
        backgroundColor: '#FDFDFD',
        borderRadius: 4,
        display: "inline-block",
        verticalAlign: "middle",
      }
      const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius: 4,
        animation: "load 3s normal forwards"
      } 
  
    return (
    <div className="loading-bar" style={Parentdiv}>
      <div style={Childdiv}>
      </div>
    </div>
    )
}
  
export default CustomerLoadingAnmiation;
