import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Scroll, ScrollControls, Torus } from "@react-three/drei";
import googleOAuthBtn from "../../assets/google_signin_buttons/web/2x/btn_google_signin_light_normal_web@2x.png";
import "./Landing.scss";

const MyBox: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    ref.current.rotation.x = ref.current.rotation.y += 0.01;
  });

  return (
    <>
      <Torus ref={ref}>
        <meshToonMaterial attach="material" color="pink" />
      </Torus>
    </>
  );
};
const LandingPage: React.FC = () => {
  return (
    <>
      <Canvas>
        <ambientLight />
        <pointLight position={[1, 0, 1]} />
        <ScrollControls pages={0}>
          <Scroll>
            <MyBox />
          </Scroll>
          <Scroll html>
            <main className="landing">
              <h1 className="landing__intro">Welcome!</h1>
              <div className="landing__btn-wrapper">
                <img
                  src={googleOAuthBtn}
                  className="landing__oauth"
                  onClick={() => {
                    window.location.href = "/api/oauth/google";
                  }}
                />
              </div>
            </main>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  );
};
export default LandingPage;
