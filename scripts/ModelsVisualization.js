class ModelsVisualization {
    constructor(group) {
        this.group = group;
        this.models = [];
        this.modelMeshes = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = null; // Will be set from outside
        this.currentHighlightedModel = null;
        this.dialogInitialized = false;
        this.createDefaultVisualization();
        this.setupModelClickHandler();
    }

    createDefaultVisualization() {
        // Create the axes helper
        const gridHelper = new THREE.AxesHelper(100);
        this.group.add(gridHelper);

        // Add directional cones at the end of each axis
        this.createAxisCone(new THREE.Vector3(105, 0, 0), new THREE.Euler(0, 0, -Math.PI / 2), 0xff0000); // X axis - red
        this.createAxisCone(new THREE.Vector3(0, 105, 0), new THREE.Euler(0, 0, 0), 0x00ff00);    // Y axis - green
        this.createAxisCone(new THREE.Vector3(0, 0, 105), new THREE.Euler(Math.PI / 2, 0, 0), 0x0000ff);  // Z axis - blue

        // Add axis labels
        this.createAxisLabel('Concreteness', new THREE.Vector3(120, 0, 0), 'x');
        this.createAxisLabel('Mathematicality', new THREE.Vector3(0, 120, 0), 'y');
        this.createAxisLabel('Computationality', new THREE.Vector3(0, 0, 120), 'z');

        // Visualizd models from scratch
        this.modelMeshes = [];
        this.models = [
            {
                "name": "San Francisco Bay Scale model",
                "mdfile": "San_Francisco_Bay_Scale_model.md",
                "concreteness": 0.92,
                "mathematicality": 0.18,
                "computationality": 0.23,

            },
            {
                "name": "Lotka-Volterra equation",
                "mdfile": "Lotka-Volterra_equation.md",
                "concreteness": 0.13,
                "mathematicality": 0.97,
                "computationality": 0.21,


            },
            {
                "name": "Schelling model of segregation",
                "mdfile": "Schelling_model_of_segregation.md",
                "concreteness": 0.22,
                "mathematicality": 0.15,
                "computationality": 0.89,


            },
            {
                "name": "Derosophila the model organism",
                "mdfile": "Derosophila_the_model_organism.md",
                "concreteness": 0.81,
                "mathematicality": 0.37,
                "computationality": 0.41,

            },
            {
                "name": "Harmonic equations for pendulum",
                "mdfile": "Harmonic_equations_for_pendulum.md",
                "concreteness": 0.29,
                "mathematicality": 0.85,
                "computationality": 0.33,

            },
            {
                "name": "Watson and Crick DNA helix",
                "mdfile": "Watson_and_Crick_DNA_helix.md",
                "concreteness": 0.74,
                "mathematicality": 0.22,
                "computationality": 0.27,

            },
            {
                "name": "xDNA",
                "mdfile": "xDNA.md",
                "concreteness": 0.61,
                "mathematicality": 0.31,
                "computationality": 0.12,
            },
            {
                "name": "Game of Life cellular automata",
                "mdfile": "Game_of_Life_cellular_automata.md",
                "concreteness": 0.44,
                "mathematicality": 0.54,
                "computationality": 0.97,
                "trajectory": [
                    { "concreteness": 0.44, "mathematicality": 0.54, "computationality": 0.97 },
                    { "concreteness": 0.46, "mathematicality": 0.56, "computationality": 0.95 },
                    { "concreteness": 0.48, "mathematicality": 0.58, "computationality": 0.93 },
                    { "concreteness": 0.50, "mathematicality": 0.60, "computationality": 0.91 },
                    { "concreteness": 0.52, "mathematicality": 0.62, "computationality": 0.89 },
                    { "concreteness": 0.54, "mathematicality": 0.64, "computationality": 0.87 },
                    { "concreteness": 0.56, "mathematicality": 0.66, "computationality": 0.85 },
                    { "concreteness": 0.58, "mathematicality": 0.68, "computationality": 0.83 },
                    { "concreteness": 0.60, "mathematicality": 0.70, "computationality": 0.81 },
                    { "concreteness": 0.62, "mathematicality": 0.72, "computationality": 0.79 }
                ]
            }
        ];

        this.models.forEach(model => {
            this.createModelMesh(model);
        });
    }

    createAxisCone(position, rotation, color) {
        const geometry = new THREE.ConeGeometry(2, 6, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const cone = new THREE.Mesh(geometry, material);
        cone.position.copy(position);
        cone.setRotationFromEuler(rotation);
        this.group.add(cone);
    }

    createAxisLabel(text, position, axis) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.font = 'bold 24px Helvetica';
        // Set color based on axis
        if (axis === 'x') {
            context.fillStyle = '#ff0000';  // Red for X axis (Concreteness)
        } else if (axis === 'y') {
            context.fillStyle = '#00ff00';  // Green for Y axis (Mathematicality)
        } else if (axis === 'z') {
            context.fillStyle = '#0000ff';  // Blue for Z axis (Computationality)
        }
        context.textAlign = 'center';
        context.fillText(text, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);

        // Position and scale the label
        sprite.position.copy(position);
        sprite.scale.set(30, 10, 1);

        this.group.add(sprite);
    }

    visualizeModels(models) {
        // Clear existing meshes including the default visualization
        while (this.group.children.length > 0) {
            const object = this.group.children[0];
            this.group.remove(object);
        }
        this.modelMeshes = [];
        this.models = models;

        // Recreate the grid and labels
        this.createDefaultVisualization();

        // Create visualization for each model
        this.models.forEach(model => {
            this.createModelMesh(model);
        });
    }

    calculateColorFromAttributes(model) {
        // Convert the 0-1 values to 0-255 range and then to hex
        const r = Math.floor(model.concreteness * 255);
        const g = Math.floor(model.mathematicality * 255);
        const b = Math.floor(model.computationality * 255);

        // Combine into a single hex color (0xRRGGBB)
        return (r << 16) | (g << 8) | b;
    }

    createModelMesh(model) {
        const geometry = new THREE.SphereGeometry(4, 32, 32);
        const colorcode = this.calculateColorFromAttributes(model);
        const material = new THREE.MeshPhongMaterial({
            color: colorcode,
            transparent: true,
            opacity: 0.8,
            shininess: 30
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Position based on model attributes (scaled by 100 to match grid size)
        mesh.position.set(
            model.concreteness * 100,    // X axis: Concreteness
            model.mathematicality * 100,  // Y axis: Mathematicality
            model.computationality * 100  // Z axis: Computationality
        );

        // Store the model data and original color in the mesh
        mesh.userData = {
            ...model,
            originalColor: colorcode
        };
        // Add click event reference
        mesh.userData.modelRef = model;

        // Add label for the model name with the same color as the sphere
        const label = this.createModelLabel(model.name, colorcode);
        label.position.copy(mesh.position);
        label.position.y += 5; // Offset label above the sphere

        // Add to scene
        this.group.add(mesh);
        this.group.add(label);
        this.modelMeshes.push(mesh);
    }





 createModelLabel(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = 'bold 24px Helvetica';
        // Convert hex color to CSS color string
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context.textAlign = 'center';
        context.fillText(text, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(15, 4, 1);
        return sprite;
 }

    setupModelClickHandler() {
        // Only set up once
        if (this.dialogInitialized) return;
        this.dialogInitialized = true;

        // Reference to this for event handler
        const self = this;
        const domElement = document.getElementById('visualization-canvas');
        if (!domElement) return;

        domElement.addEventListener('click', function(event) {
            if (!self.camera) return;
            // Calculate mouse position in normalized device coordinates
            const rect = domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            );
            self.raycaster.setFromCamera(mouse, self.camera);
            const intersects = self.raycaster.intersectObjects(self.modelMeshes);
            if (intersects.length > 0) {
                const mesh = intersects[0].object;
                self.showModelDetailsDialog(mesh.userData.modelRef || mesh.userData);
            }
        });
    }

    showModelDetailsDialog(model) {
        // Create dialog content
        const dialog = document.getElementById('model-details');
        const body = document.getElementById('model-details-body');
        if (!dialog || !body) return;

        // Clear previous content
        body.innerHTML = "<p>Loading...</p>";
        dialog.style.display = 'flex';

        console.log("Showing details for model:", model);
        
        // Fetch and render markdown if mdfile is present
        if (model.mdfile) {
            const filePath = `data/descriptions/${model.mdfile}`;
            fetch(filePath)
                .then(res => {
                    if (!res.ok) throw new Error("Markdown file not found");
                    return res.text();
                })
                .then(md => {
                    // Assume 'marked' is loaded globally
                    body.innerHTML = window.marked ? window.marked.parse(md) : `<pre>${md}</pre>`;
                })
                .catch(err => {
                    console.error(err);
                    body.innerHTML = "<p>Content not found.</p>";
                });
        } else {
            body.innerHTML = "<p>No description available for this model.</p>";
        }

        // Close handler
        const closeBtn = dialog.querySelector('.model-details-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                dialog.style.display = 'none';
            };
        }
        // Optional: close on outside click
        dialog.onclick = (e) => {
            if (e.target === dialog) dialog.style.display = 'none';
        };
    }

    createModelHoverHighlight(renderer, camera, domElement) {
        this.camera = camera;

        // Store original colors for restoration
        this.modelMeshes.forEach(mesh => {
            mesh.userData.originalColor = mesh.material.color.getHex();
        });

        // Add mouse move listener
        domElement.addEventListener('mousemove', (event) => {
            // Calculate mouse position in normalized device coordinates (-1 to +1)
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            this.raycaster.setFromCamera(this.mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects(this.modelMeshes);

            if (intersects.length > 0) {
                // Mouse is over a model
                const hoveredMesh = intersects[0].object;

                // If it's a different model than the one currently highlighted
                if (this.currentHighlightedModel !== hoveredMesh) {
                    // Restore previous highlighted model's color if exists
                    if (this.currentHighlightedModel) {
                        this.currentHighlightedModel.material.color.setHex(
                            this.currentHighlightedModel.userData.originalColor
                        );
                        this.currentHighlightedModel.material.opacity = 0.8;
                    }

                    // Highlight new model
                    this.currentHighlightedModel = hoveredMesh;
                    const originalColor = new THREE.Color(hoveredMesh.userData.originalColor);

                    // Make it brighter and more opaque
                    if (hoveredMesh instanceof THREE.Mesh) {
                        hoveredMesh.material.color.setRGB(
                            Math.min(originalColor.r * 2.0, 1),
                            Math.min(originalColor.g * 2.0, 1),
                            Math.min(originalColor.b * 2.0, 1)
                        );
                        hoveredMesh.material.opacity = 1.0;
                    }
                }
            } else if (this.currentHighlightedModel) {
                // Mouse is not over any model, restore original color
                this.currentHighlightedModel.material.color.setHex(
                    this.currentHighlightedModel.userData.originalColor
                );
                this.currentHighlightedModel.material.opacity = 0.8;
                this.currentHighlightedModel = null;
            }

            // Request render update
            renderer.render(this.group.parent, camera);
        });
    }
}