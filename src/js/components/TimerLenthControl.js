import React from "react";

const TimerLengthControl = (props) => {

    const onClickDecrement = (e) => {
        props.decrement(props.labelType);
    }

    const onClickIncrement = (e) => {
        props.increment(props.labelType);
    }

    return(
        
        <div className="length-control">
            <div id={props.labelID}>{props.label}</div>
            <div id={props.lengthID}>{props.length}</div>
            <div id={props.incrementID} 
            increment={props.increment} 
            onClick={onClickIncrement} >
                <i class="fas fa-angle-double-up"></i>
            </div>
            <div id={props.decrementID} 
            decrement={props.decrement} 
            onClick={onClickDecrement} >
                <i class="fas fa-angle-double-down"></i>
            </div>
        </div>
        
        
    );
}

export default TimerLengthControl;