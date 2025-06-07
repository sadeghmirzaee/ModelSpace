/// <reference types="three" />

/* global THREE */
/* global TWEEN */

class Main {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.directionalLight = null;
        this.lightHelper = null;
        this.dragControls = null;

        // Group for organizing the scene
        this.modelsGroup = new THREE.Group();

        // Components
        this.modelsVisualization = null;
        this.fileHandler = null;

        this.init();
        this.setupDialogs();
    }

    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initControls();
        this.createRoomCorner();
        this.setupComponents();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = this.backgroundCreation();

        // Add group to scene
        this.scene.add(this.modelsGroup);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        this.directionalLight.position.set(130, 130, -50);
        this.scene.add(this.directionalLight);

        // Create a small sphere to represent the light position
        const sphereGeometry = new THREE.SphereGeometry(2, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.lightControl = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.lightControl.position.copy(this.directionalLight.position);
        this.scene.add(this.lightControl);

        // Add light helper
        this.lightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
        this.scene.add(this.lightHelper);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(350, 150, 120);
        // this.camera.lookAt(200, 0, 0);
     }

    initRenderer() {
        const canvas = document.getElementById('visualization-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Set the controls target to match the lookAt point
        this.controls.target.set(50, 50, 50);
        this.controls.update();

        // Setup drag controls for the light control sphere
        this.dragControls = new THREE.DragControls([this.lightControl], this.camera, this.renderer.domElement);
        
        // Update light position when control sphere is dragged
        this.dragControls.addEventListener('drag', (event) => {
            // Update both directional light and helper positions
            this.directionalLight.position.copy(this.lightControl.position);
            this.lightHelper.position.copy(this.lightControl.position);
            this.lightHelper.update();
        });

        // Disable orbit controls while dragging
        this.dragControls.addEventListener('dragstart', () => {
            this.controls.enabled = false;
        });

        this.dragControls.addEventListener('dragend', () => {
            this.controls.enabled = true;
        });
    }

    createRoomCorner() {
        const gridSize = 100;
        const divisions = 10;
        const step = gridSize / divisions;

        // Helper function to get color based on 3D position
        const getColorFromPosition = (x, y, z) => {
            return new THREE.Color(
                x / gridSize,  // Red channel (Concreteness)
                y / gridSize,  // Green channel (Mathematicality)
                z / gridSize   // Blue channel (Computationality)
            );
        };

        // Create lines for each plane
        const createGrid = (plane, offset = 0) => {
            const vertices = [];
            const colors = [];

            for (let i = 0; i <= gridSize; i += step) {
                for (let j = 0; j <= gridSize; j += step) {
                    let pos1, pos2;

                    if (plane === 'xy') {
                        // Lines along X direction
                        if (j <= gridSize - step) {
                            pos1 = { x: i, y: j, z: offset };
                            pos2 = { x: i, y: j + step, z: offset };
                            vertices.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
                            colors.push(
                                ...getColorFromPosition(pos1.x, pos1.y, pos1.z).toArray(),
                                ...getColorFromPosition(pos2.x, pos2.y, pos2.z).toArray()
                            );
                        }
                        // Lines along Y direction
                        if (i <= gridSize - step) {
                            pos1 = { x: i, y: j, z: offset };
                            pos2 = { x: i + step, y: j, z: offset };
                            vertices.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
                            colors.push(
                                ...getColorFromPosition(pos1.x, pos1.y, pos1.z).toArray(),
                                ...getColorFromPosition(pos2.x, pos2.y, pos2.z).toArray()
                            );
                        }
                    }
                    else if (plane === 'xz') {
                        // Lines along X direction
                        if (j <= gridSize - step) {
                            pos1 = { x: i, y: offset, z: j };
                            pos2 = { x: i, y: offset, z: j + step };
                            vertices.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
                            colors.push(
                                ...getColorFromPosition(pos1.x, pos1.y, pos1.z).toArray(),
                                ...getColorFromPosition(pos2.x, pos2.y, pos2.z).toArray()
                            );
                        }
                        // Lines along Z direction
                        if (i <= gridSize - step) {
                            pos1 = { x: i, y: offset, z: j };
                            pos2 = { x: i + step, y: offset, z: j };
                            vertices.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
                            colors.push(
                                ...getColorFromPosition(pos1.x, pos1.y, pos1.z).toArray(),
                                ...getColorFromPosition(pos2.x, pos2.y, pos2.z).toArray()
                            );
                        }
                    }
                    else if (plane === 'yz') {
                        // Lines along Y direction
                        if (j <= gridSize - step) {
                            pos1 = { x: offset, y: i, z: j };
                            pos2 = { x: offset, y: i, z: j + step };
                            vertices.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
                            colors.push(
                                ...getColorFromPosition(pos1.x, pos1.y, pos1.z).toArray(),
                                ...getColorFromPosition(pos2.x, pos2.y, pos2.z).toArray()
                            );
                        }
                        // Lines along Z direction
                        if (i <= gridSize - step) {
                            pos1 = { x: offset, y: i, z: j };
                            pos2 = { x: offset, y: i + step, z: j };
                            vertices.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
                            colors.push(
                                ...getColorFromPosition(pos1.x, pos1.y, pos1.z).toArray(),
                                ...getColorFromPosition(pos2.x, pos2.y, pos2.z).toArray()
                            );
                        }
                    }
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                linewidth: 1,
                transparent: true,
                opacity: 0.3
            });

            return new THREE.LineSegments(geometry, material);
        };

        // Create and add the grids for all six faces
        // Front XY plane (z = 0)
        const xyGridFront = createGrid('xy', 0);
        this.scene.add(xyGridFront);

        // Back XY plane (z = gridSize)
        const xyGridBack = createGrid('xy', gridSize);
        this.scene.add(xyGridBack);

        // Bottom XZ plane (y = 0)
        const xzGridBottom = createGrid('xz', 0);
        this.scene.add(xzGridBottom);

        // Top XZ plane (y = gridSize)
        const xzGridTop = createGrid('xz', gridSize);
        this.scene.add(xzGridTop);

        // Left YZ plane (x = 0)
        const yzGridLeft = createGrid('yz', 0);
        this.scene.add(yzGridLeft);

        // Right YZ plane (x = gridSize)
        const yzGridRight = createGrid('yz', gridSize);
        this.scene.add(yzGridRight);
    }

    setupComponents() {
        // Initialize model visualization
        this.modelsVisualization = new ModelsVisualization(this.modelsGroup);

        // Initialize file handler
        this.fileHandler = new FileHandler(this.modelsVisualization);

        // Initialize hover highlight
        this.modelsVisualization.createModelHoverHighlight(
            this.renderer,
            this.camera,
            this.renderer.domElement
        );
    }

    setupDialogs() {
        const aboutDialog = document.getElementById('aboutDialog');
        const aboutButton = document.getElementById('aboutButton');
        const closeButton = aboutDialog.querySelector('.close-button');

        // Open dialog
        aboutButton.addEventListener('click', () => {
            aboutDialog.style.display = 'block';
        });

        // Close dialog when clicking X
        closeButton.addEventListener('click', () => {
            aboutDialog.style.display = 'none';
        });

        // Close dialog when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === aboutDialog) {
                aboutDialog.style.display = 'none';
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        TWEEN.update();
        this.controls.update();
        // Update the light helper position
        if (this.lightHelper) {
            this.lightHelper.update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    backgroundCreation() {
        // Create a gradient background with medium grayscale colors
        const topColor = new THREE.Color(0x121212);     // Darker gray
        const middleColor = new THREE.Color(0x2a2a2a);  // Medium-dark gray
        const bottomColor = new THREE.Color(0x4a4a4a);  // Medium gray

        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 512;
        const context = canvas.getContext('2d');

        const gradient = context.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, `#${topColor.getHexString()}`);
        gradient.addColorStop(0.5, `#${middleColor.getHexString()}`);
        gradient.addColorStop(1, `#${bottomColor.getHexString()}`);

        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 512);

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;

        return texture;
    }
}

// Initialize the application
let main;
document.addEventListener('DOMContentLoaded', () => {
    main = new Main();
    window.addEventListener('resize', () => main.onWindowResize());
});





