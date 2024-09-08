import React from "react"
import dieFaces from "./die_faces.jsx"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {dieFaces[props.value-1]}
        </div>
    )
}