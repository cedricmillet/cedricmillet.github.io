import { ElementRef } from "@angular/core";
import * as THREE from "three";
import { ColorRepresentation } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';



export class WebPage {
    private width : number;
    private height : number;
    private position : THREE.Vector3 = new THREE.Vector3(0,5.5,0);
    private rotation : THREE.Vector3 = new THREE.Vector3(0,0,0);
    private scale : [number,number,number] = [.001,.001,.001];
    private rootDomElement : HTMLElement;

    constructor(width:number=1920,height:number=1080) {
        this.width = width;
        this.height = height;
        this.rootDomElement = document.createElement('div');
        this.rootDomElement.classList.add('interactive-screen');
        this.rootDomElement.style.width = `${this.width}px`;
        this.rootDomElement.style.height = `${this.height}px`;
        this.rootDomElement.style.background = new THREE.Color(0xffffff).getStyle();
    }

    public setScale(s:number) : this {
        this.scale = [s,s,s];
        return this;
    }

    public setPosition(position:THREE.Vector3) : this {
        this.position = position;
        return this;
    }

    public setRotation(rotation:THREE.Vector3) : this {
        this.rotation = rotation;
        return this;
    }

    public setBackground(color:ColorRepresentation|null = 0xffffff) {
        this.rootDomElement.style.background = color ? new THREE.Color(color).getStyle() : '';
        return this;
    }

    public setDOM(domObject:HTMLElement) : this {
        this.rootDomElement.appendChild(domObject);
        return this;
    }

    public build(scene:THREE.Scene) : void {    
        const object = new CSS3DObject(this.rootDomElement);
        object.position.set(...this.position.toArray());
        object.rotation.set(...this.rotation.toArray());
        object.scale.set(...this.scale);
        scene.add(object);
    }
}


/**
 * NB: overlay disapeears sometimes according to this issue https://github.com/mrdoob/three.js/issues/9441
 * Caused by small scale of object and css cache...
 */

export class WebPageRenderingSystem {

    private static rendererContainer: any;
    private static renderer2:CSS3DRenderer = new CSS3DRenderer();
    private static scene:THREE.Scene;
    private static controls2: OrbitControls;

    public static init(w:number, h:number, camera:THREE.Camera, rendererContainer: ElementRef) {
        this.scene = new THREE.Scene();        
        this.renderer2.domElement.style.pointerEvents = 'none';
        this.renderer2.domElement.style.position = 'absolute';
        this.renderer2.domElement.style.top = "0";
        this.renderer2.domElement.style.left = "0";
        
        this.renderer2.setSize(w, h);
        
        this.rendererContainer = rendererContainer;
        this.rendererContainer.nativeElement.appendChild(this.renderer2.domElement);

        // /!\ Fix of  https://github.com/mrdoob/three.js/issues/9441
        setTimeout(() => { 
            for(let i=0;i<this.renderer2.domElement.children.length;i++) {
               const elem = (this.renderer2.domElement.children[i] as any)
               elem.style.transform = elem.style.transform;
            }
        }, 2000)
        
        //  /!\ required to allow 3d movement when pointer is on interactive screen
        this.controls2 = new OrbitControls(camera, this.renderer2.domElement);
    }

    public static render(camera: THREE.PerspectiveCamera) {
        if(!this.rendererContainer) return;
        this.renderer2.render(this.scene, camera as THREE.Camera);
        this.controls2.update();
    }

    public static onWindowResize() {
        const {width: w, height: h} = this.renderer2.getSize()
        this.renderer2.setSize(w, h);
    }

    public static createIntecrativeScreen() {
        if(!this.scene) {
            throw new Error(`createIntecrativeScreen() :: Invalid Scene`);
        }

        this.createAlarmScreen();
        this.createLeftScreen();
      }


      private static createAlarmScreen() {
        //  Parent timer element
        const timer = document.createElement('section')
        timer.style.fontSize = '300px';
        timer.style.textAlign = 'center';
        timer.style.color = 'rgb(182, 55, 55)';
        timer.style.fontWeight = 'bold';
        timer.style.fontFamily = 'system-ui';
        timer.style.position = 'relative';

        //  HOUR MINUTES
        const hourSpan = document.createElement('span');
        hourSpan.innerHTML = "--   --";
        timer.appendChild(hourSpan);

        //  CENTERED TWO DOTS ':'
        const twoDotSpan = document.createElement('label');
        twoDotSpan.innerHTML = ':';
        twoDotSpan.style.position = 'absolute';
        twoDotSpan.style.left = '50%';
        twoDotSpan.style.transform = 'translateX(-50%)';
        timer.appendChild(twoDotSpan);

        //  Blink two dots and update hour/minutes every second
        setInterval(() => {
            const d = new Date();
            const [h,m,s] = [d.getHours(), d.getMinutes(), d.getSeconds()].map((hms) => ("0" + hms).slice(-2));
            hourSpan.innerHTML = `${h} ${m}`;
            twoDotSpan.style.visibility = +s % 2 === 0 ? 'visible' : 'hidden';
        }, 1000);

        //  Create screen & add into scene
        const wp = new WebPage(950, 450).setPosition(new THREE.Vector3(3.9,4.4,-1))
                                        .setRotation(new THREE.Vector3(0,-Math.PI/6,0))
                                        .setScale(0.0008)
                                        .setDOM(timer)
                                        .setBackground(null)
                                        .build(this.scene);
      }
    
    private static createLeftScreen() {
        const [w,h] = [1940, 980];
        const blankPage = document.createElement('img');
        blankPage.setAttribute('src', '/assets/blankScreen.jpg');
        blankPage.style.width = `${w}px`;
        blankPage.style.height = `${h}px`;

        new WebPage(w,h)
            .setPosition(new THREE.Vector3(-1.67,5.34,-1.5))
            .setScale(0.0015)
            .setDOM(blankPage)
            .setBackground(0xffffff)
            .build(this.scene);
    }
}


