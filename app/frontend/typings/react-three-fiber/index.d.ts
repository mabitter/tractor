/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactThreeFiber } from "react-three-fiber";
import { FogExp2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
      fogExp2: ReactThreeFiber.Node<FogExp2, typeof FogExp2>;
    }
  }
}
