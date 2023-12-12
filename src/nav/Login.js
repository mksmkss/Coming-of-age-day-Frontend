import React, {useState, useEffect} from "react";
import server from '../backend/server_url.json';
import useSound from 'use-sound';
import Success from '../audio/success.mp3';
import Error from '../audio/error.mp3';
import QRCodeReader from "./QRCodeReader";
import { AnimatePresence, motion } from "framer-motion";
import "/Users/masataka/Coding/React/kaijo/src/App.css";


const sendLogin = (uuid,setName) => {
    const url = server.url;
    const login = async ( uuid ) => {
        const response = await fetch(`http://${url}:8000/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uuid: uuid})
        });
        let body = await response.text();
        body = body.split("　").join("");
        setName(body);
    }
    login(uuid);
};

const getAge = (uuid, setIsAdult,setCorColor) => {
    const url = server.url;
    const age = async ( uuid ) => {
        const response = await fetch(`http://${url}:8000/api/getAge/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let body = await response.text();
        if (body === "true") {
            setIsAdult(true);
            setCorColor("#022369");
        } else {
            setIsAdult(false);
            setCorColor("#65d0eb");
        }
    }
    age(uuid);
}

const getIsPaid = (uuid, setIsPaid,successPlay,errorPlay) => {
    const url = server.url;
    const isPaid = async ( uuid ) => {
        const response = await fetch(`http://${url}:8000/api/getIsPaid/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let body = await response.text();
        if (body === "true") {
            setIsPaid(true);
            successPlay();
            return true;
        }else{
            setIsPaid(false);
            errorPlay();
            return false;
        }
    }
    isPaid(uuid);
}

const checkIn = (uuid) => {
    const url = server.url;
    const checkIn = async ( uuid ) => {
        await fetch(`http://${url}:8000/api/checkIn/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
    checkIn(uuid);
}

const Login = () => {
    const [uuid, setUuid] = useState("");
    const [isScanned, setIsScanned] = useState(false);
    const [name, setName] = useState("");
    const [isAdult, setIsAdult] = useState(false);
    const [corColor, setCorColor] = useState("#282c34");
    const [isPaid, setIsPaid] = useState(false);
    const [successPlay, { stop, pause }] = useSound(Success);
    const [errorPlay, { stop2, pause2 }] = useSound(Error);
    useEffect(() => {
        setCorColor("#282c34");
        if (isScanned) {
            sendLogin(uuid,setName);
            setTimeout(() => {
                setIsScanned(false);
            }, 6000);
            getAge(uuid, setIsAdult,setCorColor);
            getIsPaid(uuid, setIsPaid,successPlay,errorPlay);
            checkIn(uuid);
        }
    }
    , [isScanned, uuid]);
    return (
       <AnimatePresence>
            <motion.div
                animate={{ backgroundColor:corColor }}  
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                }}
                style={{
                    // display: "flex",
                    // flex: 1,
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center", 
                }}
            >
                <div style={{height: "100px"}}/>
                <QRCodeReader
                    setUuid={setUuid}
                    isScanned={isScanned}
                    setIsScanned={setIsScanned}
                />
                {/* <button onClick={() => setIsScanned(true)}>テスト用</button> */}
                {isScanned === false &&
                 <div >
                    <h2>QRコードをかざしてください</h2>
                </div> }
                {isScanned === true &&
                <div>
                    <h2>ようこそ！{name}様</h2>
                    <p>記念品の枡とリストバンドを受け取って，中へとお入りください</p>
                    {isAdult === true ? <p><h3>濃い青色</h3>のリストバンドをお取りください</p> : <p><h3>水色</h3>のリストバンドをお取りください</p>}
                    {isPaid === true ? <p>事前支払のご協力ありがとうございました</p> : <p><h2>参加費3000円をお支払いください</h2></p>}
                </div>
                }
            </motion.div>
       </AnimatePresence>
    )
}

export default Login;