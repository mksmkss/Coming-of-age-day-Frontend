import React, {useState} from "react";
import QrReader from 'react-qr-scanner';
import { motion,animate, AnimatePresence } from "framer-motion";


const QRCodeReader = (props) => {
    const { setUuid, isScanned,setIsScanned } = props;
    // eslint-disable-next-line no-unused-vars
    const [delay, setDelay] = useState(100);
    const previewStyle = {
        // height: 400,
        flex: 1,
        borderRadius: "10px",
    }
    const handleScan = (data) => {
        if (data === null) {
            return;
        }
        setUuid(data.text);
        // animation
        setIsScanned(true);
        // console.log(data);
    }
    const handleError = (err) => {
        console.error(err);
    }
    return (
        <AnimatePresence>
            {!isScanned && <motion.div
                initial={{ opacity: 0 ,height: 0}}
                animate={{ opacity: 1 ,height: "auto"}}
                exit={{ opacity: 0 ,height: 0}}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    // backgroundColor: "red",
                    padding: "20px",
                }}
            >
                <QrReader
                    delay={delay}
                    style={previewStyle}
                    onError={handleError}
                    onScan={handleScan}
                />
            </motion.div>}
        </AnimatePresence>
    )
}

export default QRCodeReader;