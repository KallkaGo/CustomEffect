import { useGLTF } from "@react-three/drei"
import { useLoader, useThree } from "@react-three/fiber";
import { WebGLRenderer } from "three";
import { KTX2Loader } from "three-stdlib";



const ktx2Loader = new KTX2Loader();
const useKTX2Loader = (url: string | string[], isDraco: boolean = false, isMeshOpt: boolean = false) => {
  const gl = useThree((state) => state.gl);
  const useDraco = isDraco ? './libs/draco/' : false;
  const gltf = useGLTF(url, useDraco, isMeshOpt, (loader) => {
    ktx2Loader.setTranscoderPath("https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/");
    //@ts-ignore
    loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
  })

  return gltf;
}





export {
  useKTX2Loader
}; 