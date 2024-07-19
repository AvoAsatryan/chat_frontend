"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getCookie } from 'cookies-next';
import { v4  as uuidv4 } from "uuid";

type Props = {}
type Message = string;
const page = (props: Props) => {
    const  params = useParams()
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState(getCookie("username")||"");


    const [chatHistory, setChatHistory] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [websckt, setWebsckt] = useState<WebSocket |null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = async () => {

        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:8000/chat_history?user_1=${params.userId}&user_2=${username}`,);
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
          }
          const fetchedData = await response.json();
          const parsedData = JSON.parse(fetchedData);
          setMessages(parsedData)
          console.log(parsedData, typeof parsedData)
        } catch (err) {
          
        } finally {
          setIsLoading(false);
        }
      };

    useEffect(() => {
        const url = "ws://localhost:8000/ws/" + username;
        const ws = new WebSocket(url);
        // recieve message every start page
        ws.onmessage = (e) => {
            console.log("e: ", typeof e, e)
            console.log("e.data: ", typeof e.data, e.data)
            const message = e.data;
            setMessages([...messages, message]);
        };
        setWebsckt(ws);
    }, [messages])

    const sendMessage = () => {
        if(!websckt) return
        let inputMessage = params.userId+":"+message;
        let userMessage = username+":"+message;
        websckt.send(inputMessage);
        setMessage('');
        setMessages([...messages, userMessage]);
      };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
      };

    const handleSubmit = () => {
        setMessages((prevMessages: Message[]) => [...prevMessages, message]);
        setMessage('');
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {

      }, [messages, username]);
    return (
        <div className="container">
      <h1>Chat</h1>
      <h2>Your client id: {username} </h2>
      <div className="chat-container">
        <div className="chat">
          {messages.map((value, index) => {
            if (value.split(":")[0]==username) {
              return (
                <div key={uuidv4()} className="my-message-container">
                  <div className="my-message">
                    <p className="message">{value}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="another-message-container">
                  <div className="another-message">
                    <p className="message">{value}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="input-chat-container">
          <input
            className="input-chat"
            type="text"
            placeholder="Chat message ..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></input>
          <button className="submit-chat" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
    )
}

export default page