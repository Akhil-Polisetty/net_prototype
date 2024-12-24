import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import Calculator from "./Calculator";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const [users, setUser] = useState([]);
  const [sendphone, setSendphone] = useState("");
  const [sendamount, setSendamount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [showcalci, setShowCalci] = useState(false);
  const [lamount, setLamount] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://localhost:8080/auth/verify",{withCredentials:true}).then((res) => {
      if (res.data.status) {
        // alert('authentication succesful')
      } else {
        navigate("/signin");
        // alert('authentication failed');
      }
    });
  }, []);

  function handleLogout() {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8080/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/signin");
        } else {
          console.error("error ");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    navigate("/home");
  }

  function handleShowCalci() {
    setShowCalci(!showcalci);
  }

  async function handleLoan(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/takeloan", {
        lamount: lamount,
      });
      console.log("the response is ", res.status);
      if (res.status === 200 && res.data.message) {
        alert("loan is sanctioned");
      } else if (res.status === 201 && res.data.message) {
        alert("you reached loan limit");
      } else {
        alert("there is an error due to internal");
      }
    } catch (err) {
      console.log("the error is ", err);
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/getUsering", { withCredentials: true })
      .then((users) => setUser(users.data))
      .catch((err) => console.log(err));
  }, []);
  console.log("the data is ", users);

  function handleTransactionClick(transactionId) {
    setSelectedTransactionId(
      transactionId === selectedTransactionId ? null : transactionId
    );
  }

  async function handlePay(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/payment", {
        phone: sendphone,
        sendamount: sendamount,
      });
      if (res.data && res.data.message) {
        if (res.status === 201) {
          console.log("succesfully returned from server");
          setSendphone("");
          setSendamount("");
          alert("Insufficient Balance");
        } else if (res.status === 200) {
          setSendphone("");
          setSendamount("");
          alert("payment succesful");
        }
      } else {
        console.log("Error : ", res);
      }
    } catch (error) {
      console.log("error occured at login 44", error);
    }
  }

  async function handleHistory() {
    setShowHistory(!showHistory);
    axios
      .get("http://localhost:8080/getHistory")
      .then((transactions) => setTransactions(transactions.data))
      .catch((err) => console.log(err));
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        gap: "100px",
        alignItems: "center",
      }}
    >
      <div className="user_details">
        <div>
          <div style={{ fontWeight: "bold" }}>User Name : {users.uname} </div>
        </div>
        <div>
          <div style={{ fontWeight: "bold" }}>Email : {users.email} </div>
        </div>
        <div>
          <div style={{ fontWeight: "bold" }}>
            Phone Number : {users.phone}{" "}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: "bold" }}>Amount : {users.amount}</div>
        </div>
      </div>

      <div
        style={{
          width: "20%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <form
          onSubmit={handlePay}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter Phone Number "
            onChange={(event) => setSendphone(event.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Amount Number "
            onChange={(event) => setSendamount(event.target.value)}
          />
          <input type="submit" value="Pay" />
        </form>
      </div>

      {/* payment code */}
      <div
        className="history"
        style={{
          cursor: "pointer",
          border: "2px solid grey",
          padding: "20px",
          // width: "10vw",
        }}
      >
        <div onClick={handleHistory}>History</div>

        {showHistory && (
          <div className="details">
            {transactions.map((transaction) => {
              const transactionDate = new Date(transaction.time);
              const isSelected = transaction._id === selectedTransactionId;
              return (
                <div
                  key={transaction._id}
                  style={{
                    width: "50vw",
                    border: "2px solid green",
                    backgroundColor: "azure",
                    margin: "5px",
                    padding: "20px",
                  }}
                >
                  <div onClick={() => handleTransactionClick(transaction._id)}>
                    {transaction.sender === users.phone ? (
                      <div>
                        Sent {transaction.amount} Successfully to{" "}
                        {transaction.receiver} ({transaction.receiver_name})
                      </div>
                    ) : (
                      <div>
                        Received {transaction.amount} Successfully from{" "}
                        {transaction.sender} ({transaction.sender_name})
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div
                      style={{
                        marginTop: "30px",
                        backgroundColor: "#95caca",
                        position: "relative",
                        left: "30px",
                        width: "50%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        cursor: "default",
                      }}
                    >
                      {transaction.sender === users.phone ? (
                        <div>To: {transaction.receiver}</div>
                      ) : (
                        <></>
                      )}
                      {transaction.receiver === users.phone ? (
                        <div>From: {transaction.sender}</div>
                      ) : (
                        <></>
                      )}
                      <div>Amount: {transaction.amount}</div>
                      <div>Date: {transactionDate.toLocaleDateString()}</div>
                      <div>Time: {transactionDate.toLocaleTimeString()}</div>
                      <div>Transaction ID: {transaction.Transaction_id}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* loan code */}
      <div
        style={{
          height: "200px",
          width: "500px",
          backgroundColor: "beige",
          border: "2px solid grey",
        }}
      >
        <form action="" onSubmit={handleLoan}>
          <input
            type="text"
            placeholder="Enter the required amount"
            onChange={(event) => setLamount(event.target.value)}
          />
          <input type="submit" value="Take Loan" />
        </form>
      </div>

      {/* <div onClick={handleShowCalci} style={{width:"500px",height:'100px',border:'2px solid yellow',cursor:'pointer'}}>
        Calculator
        {
          showcalci ? <Calculator/> : <></>
        }
        </div> */}

      <Calculator />


      <div  onClick={handleLogout}  style={{height:"200px",width:'300px',backgroundColor:'brown',color:'white',border:"2px solid yellow",cursor:'pointer'}}>Logout</div>
    </div>
  );
};

export default Dashboard;
