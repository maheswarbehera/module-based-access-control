import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const DigitalSignature = () => {
    const sigCanvas = useRef(null);
    const [imageURL, setImageURL] = useState(null);

    // Save Signature
    const saveSignature = () => {
        setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    };

    // Clear Signature
    const clearSignature = () => {
        sigCanvas.current.clear();
        setImageURL(null);
    };

    return (
        <>
        <div style={{ textAlign: "center",backgroundColor: "white" }}>
            <h2 style={{color: "black"}}>Digital Signature</h2>
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ width: 800, height: 400, className: "signatureCanvas" }}
            />
            
        </div>
        <br />
        <button onClick={saveSignature}>Save</button>
        <button onClick={clearSignature}>Clear</button>
        <br />
        {imageURL && (
            <>
                <h3>Saved Signature:</h3>
                <img src={imageURL} alt="signature" style={{ border: "1px solid black" }} />
            </>
        )}
        </>
    );
};

export default DigitalSignature;
