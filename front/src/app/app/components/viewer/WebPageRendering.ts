import { ElementRef } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';


/**
 * NB: overlay disapeears sometimes according to this issue https://github.com/mrdoob/three.js/issues/9441
 * Caused by small scale of object and css cache...
 */

export class WebPageRenderingSystem {

    private static rendererContainer: any;
    private static renderer2:CSS3DRenderer = new CSS3DRenderer();
    private static scene2:THREE.Scene;
    //private static controls2: OrbitControls;

    public static init(w:number, h:number, camera:THREE.Camera, rendererContainer: ElementRef) {
        this.scene2 = new THREE.Scene();        
        this.renderer2.domElement.style.pointerEvents = 'none'
        this.renderer2.domElement.style.position = 'absolute';
        this.renderer2.domElement.style.top = "0";
        this.renderer2.domElement.style.left = "0";
        
        this.renderer2.setSize(w, h);
        
        this.rendererContainer = rendererContainer
        this.rendererContainer.nativeElement.appendChild(this.renderer2.domElement);

        // /!\ Fix of  https://github.com/mrdoob/three.js/issues/9441
        setTimeout(() => { 
            for(let i=0;i<this.renderer2.domElement.children.length;i++) {
               const elem = (this.renderer2.domElement.children[i] as any)
               elem.style.transform = elem.style.transform
            }
        }, 2000)
        
        //this.controls2 = new OrbitControls(camera, this.renderer2.domElement);
    }

    public static render(camera: THREE.PerspectiveCamera) {
        if(!this.rendererContainer) return;
        this.renderer2.render(this.scene2, camera as THREE.Camera);
        //this.controls2.update();
    }

    public static onWindowResize() {
        const {width: w, height: h} = this.renderer2.getSize()
        this.renderer2.setSize(w, h);
    }


    public static createIntecrativeScreen(size=[1920,1080]) {
        if(!this.scene2) {
            console.error(`this.scene2 est vide `)
        }

        const scale = 0.001; 
        const material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true,
          wireframeLinewidth: 1,
          side: THREE.DoubleSide
        });
    
        const element = document.createElement('div');
        element.innerHTML = `
        <h1>HELLO</h1>
        <ul>
        <li>hello</li>
        <li>hello</li>
        <li>hello</li>
        <li>hello</li>
        <li>hello</li>
        </ul>    
        <button onclick="alert('ok')">BOUTON</button>
        `
        element.classList.add('interactive-screen')

        element.setAttribute('data-cache', Math.floor(Math.random() * 1000).toString())
        element.style.width = `${size[0]}px`;
        element.style.height = `${size[1]}px`;
        element.style.background = new THREE.Color(0xffffff).getStyle();

    
        const object = new CSS3DObject(element);
        object.position.set(0,5.5,0)
        object.rotation.set(0,0,0)
        object.scale.set(scale,scale,scale)
        this.scene2.add(object);

    
        /*const geometry = new THREE.PlaneGeometry(...size);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(object.position);
        mesh.rotation.copy(object.rotation);
        mesh.scale.copy(object.scale);
        this.scene.add(mesh);*/

        
      }
    
}


