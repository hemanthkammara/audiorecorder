import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BsRecordCircle } from "react-icons/bs";
import { FaStopCircle } from "react-icons/fa";
import { FaCirclePause } from "react-icons/fa6";
import { RxResume } from "react-icons/rx";
import { BsFillRecordCircleFill } from "react-icons/bs";
import { addAudio, getAudio } from './api';

const AudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        let arr = [...audioUrl];
        let obj={
            date:`${new Date().toISOString().split("T")[0]}`,
            time:`${new Date().getHours()<10?"0"+new Date().getHours():new Date().getHours()}:${
                new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes()}`,
           audio:URL.createObjectURL(blob)
            //audio:`http://localhost:7000/audio/`.createObjectURL(blob)
        }
        console.log(obj);
       addAudio(obj).then((res)=>{
        if(res.msg=="new audio added successful"){

          getAudio().then((res)=>{
            if(res?.msg=="successful"){
              setAudioUrl(res.data)
            }
           })
        }
       })
        arr.push(obj);
       // setAudioUrl(arr);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
      setPaused(false); // Reset paused state when stopping recording

    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setPaused(false);
    }
  };

  useEffect(()=>{
 getAudio().then((res)=>{
  if(res?.msg=="successful"){
    setAudioUrl(res.data)
  }
 })
//  console.log(audios);
  },[])


//console.log(new Date().toISOString().split("T")[0],new Date().getHours(),new Date().getMinutes())
console.log(audioUrl)
  return (
    <DIV>


        <div className='buttonsContainer'>
            <div className='status'><p>

                {recording?"Recording":"Record New Audio"}
                {recording && paused? " paused":"" }
            </p>
            </div>
<div className='containerBtn'>

      <button onClick={startRecording}  disabled={recording || paused}>
        <BsFillRecordCircleFill className='icon' style={{color:recording==false?"red":""}} />
        {/* <BsRecordCircle className='icon' /> */}
      </button>
      <button onClick={stopRecording} disabled={!recording && !paused}>
        
        <FaStopCircle className='icon' style={{color:recording==true?"red":""}} />
      </button>
      {recording && !paused && (
        <button onClick={pauseRecording}>
         
          <FaCirclePause className='icon' />
        </button>
      )}
      {paused && (
        <button onClick={resumeRecording}>
         
          <RxResume className='icon'  />
        </button>
      )}
</div>
        </div>
   
      <br />
      {audioUrl.length > 0 &&
        audioUrl.reverse().map((e, i) => {
          return (
            <div key={i} className='singleAudio'>
                <div className='dateTimeDiv'>
                <p>{e.date}</p>
                <p>{e.time}</p>
                </div>
              <audio className='player' controls src={e.audio} />
     
            </div>
          );
        })}
    </DIV>
  );
};

export default AudioRecorder;

const DIV=styled.div`
padding-top: 15px;
padding-left:15px;
    .dateTimeDiv{
        display: flex;
        justify-content: space-around;
        gap: 20px;
        /* border: 1px solid red; */
        width: 80%;
    }
    .singleAudio{
        width: 25%;
        /* border: 1px solid black; */
        display: flex;
        flex-direction: column;
        align-items: center;
       padding: 10px;
       border-radius: 15px;
       background-color: white;
       box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
   margin-top: 10px;
    }
    .player{
        color: red;
     
    }
    .icon{
        //width: 35px;
        font-size: 35px;
        
        border-radius: 50%;
       //border: 1px solid grey;
    }
    button{
        display: flex;
        gap: 10px;
        align-items: center;
       height: 45px;
       width: 45px;
       border-radius: 50%;
        margin: 2px;
        border: none;
        background-color: white;
    }
    .buttonsContainer{
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 25%;
       background-color: white;
        /* border: 1px solid red; */
        padding: 10px;
        box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
           border-radius: 15px;
    }
    
    .status{
        width: 40%;
        /* border: 1px solid green; */
    }
    .containerBtn{
        display: flex;

    }
`