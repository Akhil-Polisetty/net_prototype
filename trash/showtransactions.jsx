import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
const Dashboard = () => {
  const [users, setUser] = useState([]);
  const [sendphone, setSendphone] = useState("");
  const [sendamount, setSendamount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);


  useEffect(() => {
    axios
      .get("http://localhost:8080/getUsering")
      .then((users) => setUser(users.data))
      .catch((err) => console.log(err));
  }, []);
  console.log("the data is ", users);

  function handleTransactionClick(transactionId) {
    setSelectedTransactionId(transactionId === selectedTransactionId ? null : transactionId);
  }

  async function handlePay(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/payment", {
        phone: sendphone,
        sendamount: sendamount,
      });
      if (res.data && res.data.message) {
        if (res.status === 200) {
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

        { showHistory ? (
          <div className="detais">
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
                  {transaction.sender === users.phone ? (
                    <div>
                      <div onClick={handleShowTrans}>
                        Sent {transaction.amount} Succesfully to{" "}
                        {transaction.receiver}
                      </div>
                      {showTransaction === true ? (
                        <div>
                          <div>To : {transaction.receiver}</div>
                          <div>Amount : {transaction.amount}</div>

                          <div>
                            Date : {transactionDate.toLocaleDateString()}
                          </div>
                          <div>
                            Time : {transactionDate.toLocaleTimeString()}
                          </div>
                          <div>
                            Transaction ID : {transaction.Transaction_id}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div onClick={handleShowTrans}>
                        Received {transaction.amount} Succesfully from
                        {transaction.receiver}
                      </div>
                      {showTransaction === true ? (
                        <div>
                          <div>From : {transaction.sender}</div>
                          <div>Amount : {transaction.amount}</div>
                          <div>
                            Date : {transactionDate.toLocaleDateString()}
                          </div>
                          <div>
                            Time : {transactionDate.toLocaleTimeString()}
                          </div>
                          <div>
                            Transaction ID : {transaction.Transaction_id}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )} 

        {/* {showHistory && (
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
                        Sent {transaction.amount} Successfully to {transaction.receiver}
                      </div>
                    ) : (
                      <div>
                        Received {transaction.amount} Successfully from {transaction.sender}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div>
                      <div>To: {transaction.receiver}</div>
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
        )}         */}
      </div>
    </div>
  );
};

export default Dashboard;
