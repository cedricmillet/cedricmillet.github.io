import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  renderer = new THREE.WebGLRenderer({antialias: true, precision: "highp"});
  scene:THREE.Scene;
  camera:THREE.PerspectiveCamera;
  controls:OrbitControls;
  parentGroup:THREE.Group = new THREE.Group();

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = null as any;
    this.controls = null as any;
  }

  ngAfterViewInit(): void {
    const [w,h] = this.getSize();
    //  Renderer
    this.renderer.setSize(w, h);
    // Fix gltf RBG rendering
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1; // 1.2
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    
    this.renderer.shadowMap.enabled = true;
    
    const environment = new RoomEnvironment();
		const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
    this.scene.background = new THREE.Color( 0x282828 );
		this.scene.environment = pmremGenerator.fromScene( environment ).texture;
    environment.dispose();

    //  Light
    this.scene.add(new THREE.DirectionalLight(0xffffff, .1));
    //this.scene.add(new THREE.AmbientLight(0x404040, .1));
    /*const spot = new THREE.SpotLight(0x404040, 3, 10)
    spot.position.set(0,6,
    spot.lookAt(new THREE.Vector3(0,0,0));
    this.scene.add(spot)*/
    //  Helpers
    this.scene.add(new THREE.GridHelper(80, 40));
    //this.scene.add(new THREE.AxesHelper(10));
    //  Camera
    this.camera = new THREE.PerspectiveCamera(75, w/h, 1, 1000);
    this.camera.position.set(5,10,5);
    this.camera.lookAt(0,0,0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.scene.add(this.parentGroup);
    this.animate();
    this.enableRaycasting();
    this.loadGTTF();
    this.create3DEnv();
  }

  ngOnInit(): void {}

  private animate() {
    window.requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera as THREE.Camera);
  }

  private getSize() {
    const e = this.rendererContainer.nativeElement as HTMLElement;
    return [e.offsetWidth, e.offsetHeight]
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event : any) {
    const [w, h] = [event.target.innerWidth, event.target.innerHeight]
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
  
  private enableRaycasting() {
    const that = this;
    this.rendererContainer.nativeElement.addEventListener('mousedown', onMouseDown);
    function onMouseDown(event:any) {
      event.preventDefault();
      const rect = that.renderer.domElement.getBoundingClientRect();
      const x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
      const y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top ) ) * 2 + 1;
      const mouse = new THREE.Vector3(x, y, 0.5);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, that.camera);
      const intersects = raycaster.intersectObject(that.parentGroup);
      if(intersects.length>0) {        
        if(intersects[0].object instanceof THREE.Mesh) {
          //  Emit event
          that.onClickOnMesh(intersects[0].point)
        }
      }
    }
  }

  private onClickOnMesh(origin:THREE.Vector3) {
    console.log(`clicked on mesh`, origin)
  }

  private create3DEnv() {
    const scene = this.scene;
    this.scene.receiveShadow = this.scene.castShadow = true;
    //  BASE
    /*
    (() => {
      const geometry = new THREE.CylinderGeometry( 8, 8, 3, 32 );
      const material = new THREE.MeshPhongMaterial( {color: 0xf0ffff} );
      const cylinder = new THREE.Mesh( geometry, material );
      cylinder.position.set(0, -1, 0)
      cylinder.receiveShadow = true
      scene.add( cylinder );
    })();*/
  }


  private loadGTTF() {
    const scene = this.scene
    const loader = new GLTFLoader();
    loader.load('assets/scene.glb',
      // called when the resource is loaded
      function ( gltf ) {
        scene.add( gltf.scene );
        
        scene.receiveShadow = true;
        scene.castShadow = true
        scene.traverse((n:any) => { if ( n.isMesh ) {
          n.castShadow = true; 
          n.receiveShadow = true;
          if(n.material.map) n.material.map.anisotropy = 16; 
        }});
      }, function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, function ( error ) {
        console.log( 'An error happened', error );
      }
    );
  }
}
