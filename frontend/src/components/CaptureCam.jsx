import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraCapture = () => {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);

    // Capture Image
    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

    // Clear Image
    const clearImage = () => {
        setImage(null);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Camera Capture</h2>

            {!image ? (
                <>
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        videoConstraints={{
                            width: 400,
                            height: 300,
                            facingMode: "user", // Use "environment" for rear camera
                        }}
                        style={{ border: "1px solid black" }}
                    />
                    <br />
                    <button onClick={capture}>Capture</button>
                </>
            ) : (
                <>
                    <h3>Captured Image:</h3>
                    <img src={image} alt="Captured" style={{ border: "1px solid black" }} />
                    <br />
                    <button onClick={clearImage}>Retake</button>
                </>
            )}
        </div>
    );
};

export default CameraCapture;
