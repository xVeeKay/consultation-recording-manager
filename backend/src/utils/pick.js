const pick=(obj,keys)=>{
    return keys.reduce((acc,key)=>{
        if(obj && obj[key]!=undefined ){
            acc[key]=obj[key]
        }
        return acc
    },{})
}

export default pick