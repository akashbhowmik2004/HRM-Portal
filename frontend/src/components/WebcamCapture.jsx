
import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const WebcamCapture = ({ onCapture, mode = "verify" }) => {
  const videoRef = useRef();
  const [status, setStatus] = useState("Initializing camera...");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const isCapturing = useRef(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models"; 
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setIsModelLoaded(true);
        setStatus("Camera permission required");
      } catch (err) {
        console.error("Error loading face-api models:", err);
        setStatus("Failed to load facial recognition models.");
      }
    };
    loadModels();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isModelLoaded) {
      startCamera();
    }
  }, [isModelLoaded]);

  const startCamera = async () => {
    try {
      setStatus("Initializing camera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsStreaming(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setStatus("Camera permission required or not found.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
  };

  const handleVideoPlay = () => {
    if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
    setStatus("Looking for your face...");
    captureIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || isCapturing.current) return;
      
      isCapturing.current = true; // Prevent concurrent checks
      
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        setStatus("Face detected");
        clearInterval(captureIntervalRef.current);
        
        const descriptorArray = Array.from(detections.descriptor);
        // Let parent handle the API call and update the status
        onCapture(descriptorArray, (newStatus, restart) => {
          setStatus(newStatus);
          if (restart) {
            setTimeout(() => {
              isCapturing.current = false;
              handleVideoPlay(); // restart detection
            }, 2500);
          }
        });
      } else {
        setStatus("No face detected. Please position your face inside the camera frame.");
        isCapturing.current = false; // Allow next check
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="relative w-full max-w-sm rounded-xl overflow-hidden border-2 border-indigo-100 shadow-inner bg-black">
        <video
          ref={videoRef}
          onPlay={handleVideoPlay}
          autoPlay
          muted
          playsInline
          className="w-full h-auto object-cover transform -scale-x-100"
        />
        {(!isStreaming || !isModelLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <span className="text-white text-sm animate-pulse">{status}</span>
          </div>
        )}
      </div>
      <div className="text-center min-h-[2rem]">
        <p className={`text-sm font-medium transition-colors ${status.toLowerCase().includes("failed") || status.includes("No face") ? "text-rose-500" : "text-indigo-600"}`}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default WebcamCapture;
