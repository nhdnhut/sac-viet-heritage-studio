"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { OutfitSpec } from "@/types";

interface NguThanModelProps {
  spec: OutfitSpec;
}

export function NguThanModel({ spec }: NguThanModelProps) {
  // Cloned materials to prevent cross-look pollution
  const { bodyMat, accentMat, pantsMat, buttonMat, accessoryMat } = useMemo(() => {
    return {
      bodyMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.primaryColor),
        roughness: 0.35,
        metalness: 0.1,
      }),
      accentMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.secondaryColor),
        roughness: 0.4,
        metalness: 0.15,
      }),
      pantsMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.pantsColor),
        roughness: 0.6,
        metalness: 0.05,
      }),
      buttonMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#E2C366"),
        roughness: 0.2,
        metalness: 0.8,
      }),
      accessoryMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.secondaryColor),
        roughness: 0.4,
        metalness: 0.3,
      }),
    };
  }, [spec.primaryColor, spec.secondaryColor, spec.pantsColor]);

  // Torso shape: 5-panel traditional silhouette with side slit
  const torsoGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Shoulder left to right
    shape.moveTo(-0.55, 1.4);
    shape.lineTo(0.55, 1.4);
    // Armhole right down to waist
    shape.lineTo(0.5, 0.7);
    // Hip flare down to hem (just below knees)
    shape.lineTo(0.65, -0.6);
    // Hem bottom right to left
    shape.lineTo(-0.65, -0.6);
    // Left side back up to armhole
    shape.lineTo(-0.5, 0.7);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
  }, []);

  // Lapel (Nẹp khuy cài bên phải - hữu nhậm)
  const lapelGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.45, 0.23),
      new THREE.Vector3(0.18, 1.3, 0.23),
      new THREE.Vector3(0.35, 1.05, 0.23),
      new THREE.Vector3(0.48, 0.7, 0.22),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.025, 8, false);
  }, []);

  // Sleeves: Tay chẽn (Tapering from shoulder to wrist)
  const leftSleeveGeo = useMemo(() => {
    // Upper radius 0.16, lower wrist radius 0.09, length 1.25
    return new THREE.CylinderGeometry(0.09, 0.16, 1.25, 16);
  }, []);

  const rightSleeveGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.09, 0.16, 1.25, 16);
  }, []);

  // Standing Collar (Cổ đứng lập lĩnh: 3.5 - 4cm)
  const collarGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.2, 0.21, 0.16, 24, 1, true);
  }, []);

  // Pants (Quần hai ống truyền thống)
  const pantsLegGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.18, 0.22, 1.6, 16);
  }, []);

  const hasKhanDong = spec.accessories.includes("khan_dong_truyen_thong");

  return (
    <group name="NguThanTayChenModel" position={[0, -0.4, 0]}>
      {/* Head & Neck Base Reference */}
      <mesh position={[0, 1.68, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#ECC8A8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.46, 0]}>
        <cylinderGeometry args={[0.13, 0.14, 0.2, 16]} />
        <meshStandardMaterial color="#ECC8A8" roughness={0.7} />
      </mesh>

      {/* Khăn Đóng (Traditional Turban) */}
      {hasKhanDong && (
        <group position={[0, 1.76, 0]}>
          <mesh rotation={[0.1, 0, 0]}>
            <torusGeometry args={[0.22, 0.08, 12, 32]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 0.1, 24]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
        </group>
      )}

      {/* Cổ Đứng Lập Lĩnh (Mandarin Collar) */}
      <mesh geometry={collarGeo} material={accentMat} position={[0, 1.46, 0]} />

      {/* Thân Áo Ngũ Thân (5-Panel Torso with real front & back depth) */}
      <mesh
        geometry={torsoGeometry}
        material={bodyMat}
        position={[0, 0, -0.2]}
        castShadow
        receiveShadow
      />

      {/* Đường nẹp vạt hữu nhậm (Right Lapel trim) */}
      <mesh geometry={lapelGeometry} material={accentMat} />

      {/* 5 Cúc Khuy Áo (Ngũ Thường Buttons: cổ, nách, và 3 sườn) */}
      <mesh position={[0.08, 1.43, 0.23]} material={buttonMat}>
        <sphereGeometry args={[0.03, 12, 12]} />
      </mesh>
      <mesh position={[0.24, 1.25, 0.23]} material={buttonMat}>
        <sphereGeometry args={[0.03, 12, 12]} />
      </mesh>
      <mesh position={[0.38, 1.02, 0.23]} material={buttonMat}>
        <sphereGeometry args={[0.03, 12, 12]} />
      </mesh>
      <mesh position={[0.45, 0.78, 0.22]} material={buttonMat}>
        <sphereGeometry args={[0.03, 12, 12]} />
      </mesh>
      <mesh position={[0.48, 0.52, 0.21]} material={buttonMat}>
        <sphereGeometry args={[0.03, 12, 12]} />
      </mesh>

      {/* Tay Chẽn Trái (Slim Left Sleeve) */}
      <group position={[-0.65, 0.85, 0]} rotation={[0, 0, 0.28]}>
        <mesh geometry={leftSleeveGeo} material={bodyMat} position={[0, -0.3, 0]} castShadow />
        {/* Cổ tay áo viền nẹp */}
        <mesh position={[0, -0.9, 0]} material={accentMat}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        </mesh>
      </group>

      {/* Tay Chẽn Phải (Slim Right Sleeve) */}
      <group position={[0.65, 0.85, 0]} rotation={[0, 0, -0.28]}>
        <mesh geometry={rightSleeveGeo} material={bodyMat} position={[0, -0.3, 0]} castShadow />
        {/* Cổ tay áo viền nẹp */}
        <mesh position={[0, -0.9, 0]} material={accentMat}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        </mesh>
      </group>

      {/* Quần Trắng Ống Đứng (Traditional Trousers) */}
      <group position={[0, -1.0, 0]}>
        <mesh geometry={pantsLegGeo} material={pantsMat} position={[-0.22, -0.3, 0]} castShadow />
        <mesh geometry={pantsLegGeo} material={pantsMat} position={[0.22, -0.3, 0]} castShadow />
      </group>

      {/* Guốc mộc hoặc giày */}
      <mesh position={[-0.22, -2.15, 0.06]}>
        <boxGeometry args={[0.16, 0.08, 0.35]} />
        <meshStandardMaterial color="#4A2810" roughness={0.8} />
      </mesh>
      <mesh position={[0.22, -2.15, 0.06]}>
        <boxGeometry args={[0.16, 0.08, 0.35]} />
        <meshStandardMaterial color="#4A2810" roughness={0.8} />
      </mesh>
    </group>
  );
}
