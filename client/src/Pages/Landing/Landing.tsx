import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Scroll, ScrollControls, Torus } from "@react-three/drei";
import googleOAuthBtn from "../../assets/google_signin_buttons/web/2x/btn_google_signin_light_normal_web@2x.png";
import "./Landing.scss";

const MyTorus = (props: any) => {
  const meshRef = props.meshRef;
  useFrame(() => {
    if (meshRef.current && window.innerWidth <= 768) {
      meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <Torus ref={props.meshRef}>
      <meshToonMaterial attach="material" color="pink" />
    </Torus>
  );
};
const LandingPage: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const handleMouse = (e: any) => {
    const pointerX = e.clientX / window.innerWidth - 0.5;
    const pointerY = e.clientY / window.innerHeight - 0.5;
    if (ref.current && window.innerWidth > 768) {
      ref.current.rotation.x = pointerY;
      ref.current.rotation.y = pointerX;
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[1, 0, 1]} />
      <ScrollControls pages={0}>
        <Scroll>
          <MyTorus meshRef={ref} />
        </Scroll>
        <Scroll html>
          <main className="landing">
            <h1 className="landing__intro">Welcome!</h1>
            <div className="landing__btn-wrapper">
              <img
                src={googleOAuthBtn}
                className="landing__oauth"
                onClick={() => {
                  window.location.href = `${
                    process.env.REACT_APP_HOST as string
                  }/api/oauth/google`;
                }}
              />
            </div>
          </main>
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
};
export default LandingPage;
