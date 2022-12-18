import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { WebPageRenderingSystem } from './WebPageRendering';
import { ViewerUtils } from './ViewerUtils';


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;
  @ViewChild('rendererContainer2') rendererContainer2!: ElementRef;

  @Output('loaded') loadedOutput = new EventEmitter<boolean>();
  
  renderer = new THREE.WebGLRenderer({antialias: true, precision: "highp"});
  scene:THREE.Scene;
  camera:THREE.PerspectiveCamera;
  controls:OrbitControls;
  
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
    //this.renderer.shadowMap.enabled = true;
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

    // CSS3D renderer
    
    //this.controls.enableDamping = true;
    this.animate();
    this.enableRaycasting();
    ViewerUtils.loadGTTF(this.scene, 'assets/scene.glb', 
            () => this.loadedOutput.emit(true), 
            (err) => this.loadedOutput.emit(false));
    WebPageRenderingSystem.init(w, h, this.camera, this.rendererContainer2);
    WebPageRenderingSystem.createIntecrativeScreen();
    this.create3DEnv();

  }

  ngOnInit(): void {}

  private animate() {
    window.requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera as THREE.Camera);
    WebPageRenderingSystem.render(this.camera);
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
    WebPageRenderingSystem.onWindowResize();
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
      const intersects = raycaster.intersectObject(that.scene);
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
    this.scene.receiveShadow = this.scene.castShadow = true;

    //  Adds computer blue light inside
    const width = .8;
    const height = 2;
    const intensity = 200;
    const rectLight = new THREE.RectAreaLight( 0x0000ff, intensity,  width, height );
    rectLight.position.set(-4.5, 5,0 );
    rectLight.lookAt( -4, 5,-1 );
    this.scene.add( rectLight )

    
  }


  
}
