import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SVGLoader, SVGResult } from 'three/examples/jsm/loaders/SVGLoader';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  renderer = new THREE.WebGLRenderer({antialias: true});
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
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color( 0x282828 );
    //  Light
    this.scene.add(new THREE.DirectionalLight(0xffffff, 0.5));
    this.scene.add(new THREE.AmbientLight(0x404040));
    //  Helpers
    this.scene.add(new THREE.GridHelper(20, 10));
    this.scene.add(new THREE.AxesHelper(10));
    //  Camera
    this.camera = new THREE.PerspectiveCamera(75, w/h, 1, 1000);
    this.camera.position.set(5,10,5);
    this.camera.lookAt(0,0,0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene.add(this.parentGroup);
    this.animate();
    this.enableRaycasting();

    //  Debug purpose only
    const position = new THREE.Vector3(0,0,0)
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0xf000ff} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(...position.toArray())
    this.parentGroup.add(cube)
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
}
