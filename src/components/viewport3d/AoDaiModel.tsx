"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { OutfitSpec } from "@/types";

interface AoDaiModelProps {
  spec: OutfitSpec;
}

export function AoDaiModel({ spec }: AoDaiModelProps) {
  const { bodyMat, accentMat, pantsMat } = useMemo(() => {
    return {
      bodyMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.primaryColor),
        roughness: 0.25,
        metalness: 0.15,
      }),
      accentMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.secondaryColor),
        roughness: 0.35,
        metalness: 0.2,
      }),
      pantsMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.pantsColor),
        roughness: 0.5,
        metalness: 0.05,
      }),
    };
  }, [spec.primaryColor, spec.secondaryColor, spec.pantsColor]);

  // Fitted upper bodice (Ngực ôm, eo thon)
  const bodiceGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.42, 1.4);
    shape.lineTo(0.42, 1.4);
    shape.lineTo(0.35, 0.9); // Underarm
    shape.lineTo(0.24, 0.45); // Cinched Waist
    shape.lineTo(-0.24, 0.45); // Cinched Waist left
    shape.lineTo(-0.35, 0.9);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
  }, []);

  // Tà trước (Front Flap): Graceful curve flowing down past knees
  const frontFlapGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.24, 0.45);
    shape.lineTo(0.24, 0.45);
    shape.lineTo(0.38, -1.2);
    shape.lineTo(-0.38, -1.2);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
  }, []);

  // Tà sau (Back Flap): Verified back view flap
  const backFlapGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.24, 0.45);
    shape.lineTo(0.24, 0.45);
    shape.lineTo(0.4, -1.25);
    shape.lineTo(-0.4, -1.25);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
  }, []);

  // Sleeves: Flowing raglan sleeves
  const sleeveGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.08, 0.14, 1.25, 16);
  }, []);

  // Flowing wide palazzo trousers (Quần lụa ống rộng)
  const pantsLegGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.16, 0.28, 1.75, 16);
  }, []);

  const hasMan = spec.accessories.includes("man_cach_dieu_remix");

  return (
    <group name="AoDaiHienDaiModel" position={[0, -0.4, 0]}>
      {/* Head & Neck Base Reference */}
      <mesh position={[0, 1.68, 0]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#ECC8A8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.46, 0]}>
        <cylinderGeometry args={[0.11, 0.12, 0.22, 16]} />
        <meshStandardMaterial color="#ECC8A8" roughness={0.7} />
      </mesh>

      {/* Mấn cách điệu (Modern Headband) */}
      {hasMan && (
        <group position={[0, 1.76, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.21, 0.05, 12, 32]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
        </group>
      )}

      {/* Cổ áo (Mandarin / Round collar) */}
      <mesh position={[0, 1.44, 0]} material={accentMat}>
        <cylinderGeometry args={[0.16, 0.17, 0.12, 24, 1, true]} />
      </mesh>

      {/* Thân trên ôm eo (Fitted Bodice) */}
      <mesh
        geometry={bodiceGeometry}
        material={bodyMat}
        position={[0, 0, -0.15]}
        castShadow
        receiveShadow
      />

      {/* Tà trước (Front Flap - curved forward) */}
      <mesh
        geometry={frontFlapGeometry}
        material={bodyMat}
        position={[0, 0, 0.14]}
        rotation={[0.08, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Tà sau (Back Flap - verified dorsal view) */}
      <mesh
        geometry={backFlapGeometry}
        material={bodyMat}
        position={[0, 0, -0.16]}
        rotation={[-0.08, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Tay Raglan Trái (Left Sleeve) */}
      <group position={[-0.52, 0.88, 0]} rotation={[0, 0, 0.22]}>
        <mesh geometry={sleeveGeo} material={bodyMat} position={[0, -0.32, 0]} castShadow />
      </group>

      {/* Tay Raglan Phải (Right Sleeve) */}
      <group position={[0.52, 0.88, 0]} rotation={[0, 0, -0.22]}>
        <mesh geometry={sleeveGeo} material={bodyMat} position={[0, -0.32, 0]} castShadow />
      </group>

      {/* Quần Lụa Ống Rộng (Flowing Palazzo Silk Pants) */}
      <group position={[0, -1.0, 0]}>
        <mesh geometry={pantsLegGeo} material={pantsMat} position={[-0.2, -0.3, 0]} castShadow />
        <mesh geometry={pantsLegGeo} material={pantsMat} position={[0.2, -0.3, 0]} castShadow />
      </group>

      {/* Giày cao gót / Hài */}
      <mesh position={[-0.2, -2.18, 0.05]}>
        <boxGeometry args={[0.13, 0.06, 0.32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0.2, -2.18, 0.05]}>
        <boxGeometry args={[0.13, 0.06, 0.32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}
