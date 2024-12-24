import React, { useState } from 'react'
import axios from 'axios';

const TakeLoan = () => {
    const [lamount,setLamount]=useState("")
    async function handleLoan(e)
    {
        e.preventDefault();
        try{
            const res=axios.post("http://localhost:8080/takeloan",{
                lamount:lamount
            })
            if(res.status===200 && (await res).data.message)
                {
                    alert('loan is sanctioned')
                }
            else{
                alert('there is an error')
            }
        
        }catch(err)
        {
            console.log("the error is ",err)
        }
    }


    }
    
  return (
    <div style={{height:"200px",width:'500px',backgroundColor:'beige',border:'2px solid grey'}}>
        <form action="" onSubmit={handleLoan}>
            <input type="text" placeholder='Enter the required amount' onChange={(event) => setLamount(event.target.value)}/>
            <input type="submit" value="Take Loan" />
        </form>
    </div>
  )


export default TakeLoan