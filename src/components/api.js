export const getAudio=async()=>{
   return await fetch("https://ekseqaudiobackend.onrender.com/audio")
    .then((res)=>{
       return res.json()
    }).then((data)=>{
        return data
    }).catch((err)=>{
       console.log(err)
    })
}


export const addAudio=async(obj)=>{
  return  await fetch("https://ekseqaudiobackend.onrender.com/audio/record",{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{"Content-type":"application/json"}
    })
    .then((res)=>{
       return res.json()
    }).then((data)=>{
        return data
    }).catch((err)=>{
       console.log(err)
    })
}