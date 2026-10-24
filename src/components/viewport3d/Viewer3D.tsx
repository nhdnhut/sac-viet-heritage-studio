"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { OutfitSpec } from "@/types";
import { NguThanModel } from "./NguThanModel";
import { AoDaiModel } from "./AoDaiModel";
import { RotateCw, Camera, Eye, Info, Sparkles } from "lucide-react";
import { Mockup2D } from "@/components/Mockup2D";

interface Viewer3DProps {
  spec: OutfitSpec;
  onSnapshot?: (dataUrl: string) => void;
}

export function Viewer3D({ spec, onSnapshot }: Viewer3DProps) {
  const [controlsKey, setControlsKey] = useState(0);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 4.2]);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  const handlePreset = (pos: [number, number, number]) => {
    setCameraPosition(pos);
    setControlsKey((k) => k + 1);
  };

  const handleCaptureSnapshot = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      if (onSnapshot) {
        onSnapshot(dataUrl);
      } else {
        // Direct download
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${spec.id}_3d_snapshot.png`;
        a.click();
      }
    } catch (err) {
      console.error("Snapshot capture error:", err);
    }
  };

  if (webglSupported === false) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-silkDark-900 border border-lacquer-800/40 rounded-2xl text-center">
        <Info className="w-10 h-10 text-imperial-500 mb-3" />
        <h4 className="text-lg font-serif font-bold text-parchment-100 mb-1">
          Trình duyệt chưa bật tăng tốc đồ họa WebGL
        </h4>
        <p className="text-sm text-parchment-300 max-w-md mb-6">
          Chuyển sang chế độ Bản vẽ Tham số 2D trực quan có gắn nhãn chi tiết cấu trúc y phục.
        </p>
        <Mockup2D spec={spec} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[540px] bg-gradient-to-b from-silkDark-950 via-silkDark-900 to-silkDark-950 rounded-2xl border border-lacquer-700/40 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 bg-silkDark-850/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-imperial-600/30 text-xs text-parchment-200">
          <Sparkles className="w-3.5 h-3.5 text-imperial-400" />
          <span className="font-semibold text-imperial-300">{spec.garmentName}</span>
          <span className="text-parchment-300">• Phiên bản {spec.revision}</span>
        </div>

        {/* Camera Preset Buttons */}
        <div className="pointer-events-auto flex items-center gap-1 bg-silkDark-850/90 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={() => handlePreset([0, 0, 4.2])}
            title="Góc nhìn chính diện (Front)"
            className="px-2.5 py-1 text-xs font-medium rounded-full transition-all hover:bg-lacquer-800 text-parchment-200 hover:text-white"
          >
            Trước
          </button>
          <button
            onClick={() => handlePreset([0, 0, -4.2])}
            title="Góc nhìn phía sau (Back view kiểm tra tà & đường sống lưng)"
            className="px-2.5 py-1 text-xs font-medium rounded-full transition-all hover:bg-lacquer-800 text-parchment-200 hover:text-white"
          >
            Sau
          </button>
          <button
            onClick={() => handlePreset([-4.2, 0, 0])}
            title="Góc nhìn sườn trái (Left)"
            className="px-2.5 py-1 text-xs font-medium rounded-full transition-all hover:bg-lacquer-800 text-parchment-200 hover:text-white"
          >
            Trái
          </button>
          <button
            onClick={() => handlePreset([4.2, 0, 0])}
            title="Góc nhìn sườn phải kiểm tra khuy nẹp (Right)"
            className="px-2.5 py-1 text-xs font-medium rounded-full transition-all hover:bg-lacquer-800 text-parchment-200 hover:text-white"
          >
            Phải
          </button>
          <button
            onClick={() => handlePreset([1.8, 1.2, 3.8])}
            title="Góc nhìn phối cảnh 3/4"
            className="p-1.5 rounded-full hover:bg-imperial-600/30 text-imperial-300"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full flex-1">
        <Canvas
          key={controlsKey}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          camera={{ position: cameraPosition, fov: 42 }}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
          }}
        >
          {/* Studio Lights tailored for Vietnamese silk & embroidery luster */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 5, 4]} intensity={1.4} castShadow />
          <directionalLight position={[-4, 3, -3]} intensity={0.6} color="#A2B5CD" />
          <directionalLight position={[0, -3, 2]} intensity={0.3} color="#FFF5EA" />
          <pointLight position={[0, 3, 3]} intensity={0.8} color="#FFE8A3" />

          {/* Garment Geometry Switch */}
          {spec.garmentId === "ao_ngu_than_tay_chen" ? (
            <NguThanModel spec={spec} />
          ) : (
            <AoDaiModel spec={spec} />
          )}

          {/* Floor Shadow */}
          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.6}
            scale={5}
            blur={2.4}
            far={4}
            color="#000000"
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={2.0}
            maxDistance={7.5}
            target={[0, -0.2, 0]}
          />
        </Canvas>
      </div>

      {/* Bottom Action Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 text-[11px] text-parchment-300 bg-silkDark-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
          <Info className="w-3.5 h-3.5 text-imperial-400" />
          <span>Giữ chuột trái xoay 360° • Cuộn chuột để phóng to/thu nhỏ</span>
        </div>

        <button
          onClick={handleCaptureSnapshot}
          className="pointer-events-auto flex items-center gap-2 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-semibold px-4 py-2 rounded-xl text-xs shadow-lg transition-all active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Chụp Snapshot 3D</span>
        </button>
      </div>
    </div>
  );
}
