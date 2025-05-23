// General model object template
const model = {
    name: "",
    concreteness: 0,
    mathematicality: 0,
    computationality: 0,
    idealizationality: 0,
    distortionality: 0
};

// Array to store multiple models
const models = [];

// Update model list in right panel
function updateModelList() {
    const ul = document.getElementById('model-list');
    ul.innerHTML = '';
    models.forEach(m => {
        const li = document.createElement('li');
        li.textContent = m.name;
        ul.appendChild(li);
    });
}

// --- 3D Plotly Visualization ---
function plotModels() {
    const x = models.map(m => m.concreteness);
    const y = models.map(m => m.mathematicality);
    const z = models.map(m => m.computationality);
    // Tooltip text for each model
    const hoverText = models.map(m =>
        `Name: ${m.name}<br>Concreteness: ${m.concreteness}<br>Mathematicality: ${m.mathematicality}<br>Computationality: ${m.computationality}<br>Idealizationality: ${m.idealizationality}<br>Distortionality: ${m.distortionality}`
    );

    const trace = {
        x: x,
        y: y,
        z: z,
        text: hoverText,
        hoverinfo: 'text',
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            size: 8,
            color: '#0078d7'
        }
    };

    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: 'Concreteness', range: [0, 1] },
            yaxis: { title: 'Mathematicality', range: [0, 1] },
            zaxis: { title: 'Computationality', range: [0, 1] }
        }
    };

    Plotly.newPlot('plotly-3d', [trace], layout, { responsive: true });
    updateModelList();
    plot2dModels();
}

// --- 2D Chart.js Visualization ---
let chart2d = null;
function plot2dModels() {
    const ctx = document.getElementById('ideal-dist-2d').getContext('2d');
    const data = {
        datasets: [{
            label: 'Models',
            data: models.map(m => ({
                x: m.idealizationality,
                y: m.distortionality,
                label: m.name
            })),
            backgroundColor: '#0078d7',
            pointRadius: 6,
            pointHoverRadius: 10
        }]
    };
    const config = {
        type: 'scatter',
        data: data,
        options: {
            responsive: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const d = context.raw;
                            return [
                                `Name: ${d.label}`,
                                `Idealizationality: ${d.x}`,
                                `Distortionality: ${d.y}`
                            ];
                        }
                    }
                },
                legend: { display: false }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Idealizationality' },
                    min: 0, max: 1
                },
                y: {
                    title: { display: true, text: 'Distortionality' },
                    min: 0, max: 1
                }
            }
        }
    };
    if (chart2d) {
        chart2d.data = data;
        chart2d.options = config.options;
        chart2d.update();
    } else {
        chart2d = new Chart(ctx, config);
    }
}

// Modal dialog elements
const addModelBtn = document.getElementById('addModelBtn');
const modelModal = document.getElementById('modelModal');
const modelForm = document.getElementById('modelForm');
const cancelModelBtn = document.getElementById('cancelModelBtn');

addModelBtn.addEventListener('click', () => {
    modelModal.style.display = 'flex';
});

cancelModelBtn.addEventListener('click', () => {
    modelModal.style.display = 'none';
    modelForm.reset();
});

modelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newModel = {
        name: document.getElementById('modelName').value,
        concreteness: parseFloat(document.getElementById('modelConc').value),
        mathematicality: parseFloat(document.getElementById('modelMath').value),
        computationality: parseFloat(document.getElementById('modelComp').value),
        idealizationality: parseFloat(document.getElementById('modelIdeal').value),
        distortionality: parseFloat(document.getElementById('modelDist').value)
    };
    models.push(newModel);
    modelModal.style.display = 'none';
    modelForm.reset();
    plotModels();
    // Optionally, you can log or update UI here
    console.log(models);
});

// Save Models button
const saveModelsBtn = document.getElementById('saveModelsBtn');
saveModelsBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(models, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "model-database.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Load Models button and input
const loadModelsBtn = document.getElementById('loadModelsBtn');
const loadModelsInput = document.getElementById('loadModelsInput');
loadModelsBtn.addEventListener('click', () => {
    loadModelsInput.click();
});
loadModelsInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loaded = JSON.parse(e.target.result);
            if (Array.isArray(loaded)) {
                models.length = 0;
                loaded.forEach(m => models.push(m));
                plotModels();
                alert("Models loaded successfully.");
            } else {
                alert("Invalid file format.");
            }
        } catch {
            alert("Error reading file.");
        }
    };
    reader.readAsText(file);
});

// Remove circle button functionality (optional: you can remove the button from HTML too)
const moveBtn = document.getElementById('moveBtn');
if (moveBtn) moveBtn.style.display = 'none';

// Range slider value display
const concSlider = document.getElementById('modelConc');
const mathSlider = document.getElementById('modelMath');
const compSlider = document.getElementById('modelComp');
const idealSlider = document.getElementById('modelIdeal');
const distSlider = document.getElementById('modelDist');
const concVal = document.getElementById('concVal');
const mathVal = document.getElementById('mathVal');
const compVal = document.getElementById('compVal');
const idealVal = document.getElementById('idealVal');
const distVal = document.getElementById('distVal');

concSlider.addEventListener('input', () => concVal.textContent = concSlider.value);
mathSlider.addEventListener('input', () => mathVal.textContent = mathSlider.value);
compSlider.addEventListener('input', () => compVal.textContent = compSlider.value);
idealSlider.addEventListener('input', () => idealVal.textContent = idealSlider.value);
distSlider.addEventListener('input', () => distVal.textContent = distSlider.value);

// --- Animate Button Functionality ---
document.getElementById('animateBtn').addEventListener('click', () => {
    if (models.length === 0) return;
    // Move each model's coordinates a little bit (randomly)
    models.forEach(m => {
        m.concreteness = Math.min(1, Math.max(0, m.concreteness + (Math.random() - 0.5) * 0.08));
        m.mathematicality = Math.min(1, Math.max(0, m.mathematicality + (Math.random() - 0.5) * 0.08));
        m.computationality = Math.min(1, Math.max(0, m.computationality + (Math.random() - 0.5) * 0.08));
    });

    // Update only the Plotly 3D plot in-place
    const x = models.map(m => m.concreteness);
    const y = models.map(m => m.mathematicality);
    const z = models.map(m => m.computationality);
    const hoverText = models.map(m =>
        `Name: ${m.name}<br>Concreteness: ${m.concreteness}<br>Mathematicality: ${m.mathematicality}<br>Computationality: ${m.computationality}<br>Idealizationality: ${m.idealizationality}<br>Distortionality: ${m.distortionality}`
    );
    Plotly.update('plotly-3d', {
        x: [x],
        y: [y],
        z: [z],
        text: [hoverText]
    });
});
//end of animate button functionality

// Initial plot
plotModels();
