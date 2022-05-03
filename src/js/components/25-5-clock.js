import React from 'react';
import TimerLengthControl from './TimerLenthControl';
import  '../styles/25-5-clock.scss';

//npm install node-sass

const Timer = () => {
    
    const test = () => {
        console.log("test");
    }
    const [breakLength, setBreakLength] = React.useState(5);
    const [sessionLength, setSessionLength] = React.useState(25);
    const [timerState, setTimerState] = React.useState("stopped");
    const [timerType, setTimerType] = React.useState("Session");
    const [timer, setTimer] = React.useState(1500);
    const [alarmColor, setAlarmColor] = React.useState({ color: 'white' });
    const [intervalID, setIntervalID] = React.useState(null);
    const [timeoutID, setTimeoutID] = React.useState(null);
    const audioRef = React.useRef(null); 

    React.useEffect( () => {
        if(timeoutID !== null && timer > -1){
            setTimer(timer - 1);
            if(timer > -1){
                console.log(timer);
            
                clockify();
                phaseControl();
            }     
        }
    }, [timeoutID]);

    //Following two useEffect hooks are to set timer value depending on changes in different lengths and timerType.
    //But it should not reset the timer when "Session" && "stopped" and break length is changing.
    React.useEffect(() => {
        setTimer(sessionLength * 60);
    }, [sessionLength]);

    
    React.useEffect(() => {
        if(timerType === "Break") {
            setTimer(breakLength * 60);
        }
    }, [breakLength])

    //Instead of setInterval function, following function is used to minimize the inaccuracy per call.
    //https://stackoverflow.com/questions/8173580/setinterval-timing-slowly-drifts-away-from-staying-accurate
    //https://gist.github.com/AlexJWayne/1d99b3cd81d610ac7351
    //I editted above code to refect state changes 
    const accurateInterval = function (time) {
        var cancel, nextAt, timeout, wrapper;
        nextAt = new Date().getTime() + time;
        timeout = null;
        wrapper = function () {
          nextAt += time;
          console.log(nextAt - new Date().getTime());
          console.log(timeout);
          setTimeoutID(timeout);
          timeout = setTimeout(wrapper, nextAt - new Date().getTime());
         // return fn();
        };
        cancel = function () {
            setTimeoutID(null);
            return clearTimeout(timeout);
        };
        
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        
        return {
          cancel: cancel,
          timeID: timeout
        };
      };
    
    //This will increment the relevant length by one when timer is stopped
    const increment = (labelType) =>{
        if(timerState === "stopped"){
            if(labelType == "Break") {
                if(breakLength < 60){
                    setBreakLength (breakLength + 1);    
                }
            }else if(labelType === "Session"){ 
                if (sessionLength < 60){
                    setSessionLength (sessionLength + 1);
                }
            }
        }
        
    }

    //This will decrement the relevant length by one when timer is stopped
    const decrement = (labelType) =>{
        if(timerState === "stopped") {
            if(labelType === "Break") {
                if(breakLength !== 1){
                    setBreakLength (breakLength - 1);
                }
            }else if(labelType === "Session"){
                if (sessionLength !== 1){
                    setSessionLength (sessionLength - 1);
                }
            }
        }
    }

    //This converts the timer value to the format of 00:00 - minutes:seconds
    const clockify = () => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer - (minutes * 60);
        if(minutes < 10){
            minutes = '0' + minutes;
        }

        if (seconds < 10){
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;

    }

    //This will trigger by start-stop button
    const timerControl = () => {
        if(timerState === "stopped"){
            beginCountDown();
            setTimerState("running");
        } else {
            setTimerState("stopped");
            if(intervalID !== null){
                intervalID.cancel();
                setTimeoutID(null);
            }
        }
    }

    const beginCountDown = () => {
        setIntervalID(() => accurateInterval(1000));
    }
    
    const phaseControl = () => {
        changeAlarmColor(timer);
        alarmSound(timer);
        if(timer === 0){
            if(intervalID !== null){
                intervalID.cancel();
                setTimeoutID(null);
            }
            if(timerType === "Session"){
                setTimerType("Break");
                setTimer(breakLength * 60);
                setAlarmColor({color: 'white'});
                beginCountDown();
            } else {
                setTimerType("Session");
                setTimer(sessionLength * 60);
                setAlarmColor({color: 'white'});
                beginCountDown();
            }
        }
    }

    const changeAlarmColor = (timerValue) => {
        if(timerValue < 61){
            setAlarmColor( {color: '#a50d0d' });
        }else {
            setAlarmColor( {color: 'white'});
        }
    }

    const alarmSound = (timerValue) => {
        if(timerValue === 0){
            audioRef.current.play();
        }
    }

    const reset = () => {
        setBreakLength(5);
        setSessionLength(25);
        setAlarmColor({color: 'white'});
        setTimer(1500);
        setTimerState('stopped');
        setTimerType("Session");
        setIntervalID(null);

        if(intervalID !== null){
            intervalID.cancel();
        }

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    
    return(
        <div>
            <head>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet"></link>
            </head>
            <div className='main-title'>25 + 5 Clock</div>
            <div className='break-control'>
                <TimerLengthControl 
                labelID = "break-label"
                label = "Break Length"
                lengthID = "break-length"
                length = {breakLength}
                incrementID = "break-increment"
                decrementID = "break-decrement" 
                increment = {increment}
                decrement = {decrement}
                labelType = "Break" />

                <TimerLengthControl 
                labelID = "session-label"
                label = "Session Length"
                lengthID = "session-length"
                length = {sessionLength}
                incrementID = "session-increment"
                decrementID = "session-decrement" 
                increment = {increment}
                decrement = {decrement}
                labelType = "Session" />
            </div>
            
            <div id='timer' style={alarmColor}>
                
                <div id='timer-label'>{timerType}</div>
                <div id='time-left'>{clockify()}</div>
                
            </div>
            <div id='timer-control'>
                <div id='start_stop' onClick={timerControl}>
                    <i class="fas fa-play"></i> 
                    <i class="fas fa-pause"></i>
                </div>
                <div id='reset' onClick={reset}>
                    <i class="fas fa-sync-alt"></i>
                </div>
            </div>
            <audio id='beep' ref={audioRef}
            src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
            />
        </div>
    );
}

export default Timer;