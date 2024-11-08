"use client";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeLink, setQrCodeLink] = useState<string | null>(null);

  // Function to validate URL
  const isValidURL = (str: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" + // protocol
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-zA-Z\\d_]*)?$", // fragment locator
      "i"
    );
    return pattern.test(str);
  };

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" }, // Request back camera
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the webcam: ", err);
      }
    };

    const scanQRCode = () => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      // Set canvas size to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data from canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Use jsQR to detect QR code in the image data
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (qrCode) {
        const data = qrCode.data;
        setQrCodeData(data);

        // Check if the QR code data is a valid URL
        if (isValidURL(data)) {
          setQrCodeLink(data);  // Set the URL
        } else {
          setQrCodeLink(null);  // Not a valid URL
        }
        console.log("QR Code:", data);
      }

      // Call scanQRCode again after a short delay
      requestAnimationFrame(scanQRCode);
    };

    startVideo();

    // Start QR scanning when the video starts playing
    videoRef.current?.addEventListener("play", () => {
      scanQRCode();
    });

    // Clean up the video stream on component unmount
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <main className="min-h-screen font-mono bg-slate-800 grid grid-cols-1 place-content-center xs:px-5 lg:px-64">
      <section className="titleTop">
        <p className="text-center text-2xl font-bold mb-10">QR SCANNER for Mobile Web</p>
      </section>
      <section className="grid place-content-center">
        <section className="flex justify-center">
          <div className="videoCam relative">
            <video ref={videoRef} autoPlay className="border-2 w-96 h-96 rounded-sm bg-black" />
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        </section>
        <section className="text-center mt-3">
          <div className="readedQr border-2 rounded-sm px-2">
            {qrCodeData ? (
              qrCodeLink ? (
                // If QR code data is a valid URL, render it as a clickable link
                <a className="h-auto" href={qrCodeLink} target="_blank" rel="noopener noreferrer">
                  {qrCodeLink}
                </a>
              ) : (
                // If it's not a valid URL, display the raw QR code data
                <p>{qrCodeData}</p>
              )
            ) : (
              <p>No QR code detected yet</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
