import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class ViewerUtils {

    /**
     * Load 3D Model into Scene 
     * @param scene 
     * @param glbModelUrl 
     */
    public static loadGTTF(scene:THREE.Scene, glbModelUrl:string='assets/scene.glb', onLoaded: () => void, onError: (err:any) => void) {
        const loader = new GLTFLoader();
        loader.load(glbModelUrl, function ( gltf ) {// called when the resource is loaded
            scene.add( gltf.scene );
            
            scene.receiveShadow = true;
            scene.castShadow = true
            scene.traverse((n:any) => { if ( n.isMesh ) {
              n.castShadow = true; 
              n.receiveShadow = true;
              if(n.material.map) n.material.map.anisotropy = 16; 
            }});
            onLoaded();
          }, function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          }, function ( error ) {
            console.log( 'An error happened', error );
            onError(error);
          }
        );
    }

}