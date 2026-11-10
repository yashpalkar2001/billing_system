import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, ScanBarcode } from "lucide-react";

const field = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export default function BarcodeScanner({ onCode, placeholder = "Scan or enter barcode" }) {
  const [value, setValue] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const callbackRef = useRef(onCode);

  useEffect(() => { callbackRef.current = onCode; }, [onCode]);
  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!cameraOpen) return undefined;
    let active = true;
    let busy = false;
    let timer;
    const video = videoRef.current;
    if (video && streamRef.current && video.srcObject !== streamRef.current) {
      video.srcObject = streamRef.current;
      video.play().catch(() => setError("Could not start the camera preview."));
    }
    const scan = async () => {
      if (!active) return;
      const video = videoRef.current;
      if (video?.readyState >= 2 && !busy) {
        busy = true;
        try {
          const matches = await detectorRef.current.detect(video);
          const code = matches.find((match) => match.rawValue)?.rawValue;
          if (code) {
            callbackRef.current(code);
            active = false;
            stopStream();
            setCameraOpen(false);
            return;
          }
        } catch {
          setError("Could not read that barcode. Try moving the camera closer.");
        } finally {
          busy = false;
        }
      }
      timer = window.setTimeout(scan, 160);
    };
    scan();
    return () => {
      active = false;
      window.clearTimeout(timer);
      stopStream();
    };
  }, [cameraOpen]);

  const submitCode = () => {
    const code = value.trim();
    if (!code) return;
    callbackRef.current(code);
    setValue("");
    setError("");
  };

  const startCamera = async () => {
    setError("");
    if (!window.BarcodeDetector) {
      setError("Camera scanning is not available in this browser. A USB barcode scanner will work in the field above.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access requires a secure local page such as localhost.");
      return;
    }
    try {
      detectorRef.current = new window.BarcodeDetector();
      setCameraOpen(true);
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const attachVideo = () => {
        if (!streamRef.current) return;
        if (!videoRef.current) {
          window.requestAnimationFrame(attachVideo);
          return;
        }
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => setError("Could not start the camera preview."));
      };
      attachVideo();
    } catch {
      stopStream();
      setCameraOpen(false);
      setError("Camera access was unavailable or denied. You can still use a USB scanner.");
    }
  };

  const closeCamera = () => {
    stopStream();
    setCameraOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <ScanBarcode size={17} className="absolute left-3 top-3 text-slate-400" />
          <input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); submitCode(); } }} placeholder={placeholder} className={`${field} pl-9`} aria-label="Barcode input" />
        </div>
        <button type="button" onClick={cameraOpen ? closeCamera : startCamera} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50" aria-label={cameraOpen ? "Stop camera scanner" : "Start camera scanner"}>
          {cameraOpen ? <CameraOff size={16} /> : <Camera size={16} />}
          <span className="hidden sm:inline">{cameraOpen ? "Stop camera" : "Camera"}</span>
        </button>
      </div>
      {cameraOpen && <video ref={videoRef} autoPlay muted playsInline className="max-h-56 w-full rounded-xl bg-slate-950 object-cover" aria-label="Barcode camera preview" />}
      {error && <p role="status" className="text-xs text-amber-700">{error}</p>}
    </div>
  );
}
