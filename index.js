// General model object template
const model = {
    name: "",
    concreteness: 0,
    mathematicality: 0,
    computationality: 0
};

// Array to store multiple models
const models = [
  {
    "name": "San Francisco Bay Scale model",
    "concreteness": 0.92,
    "mathematicality": 0.18,
    "computationality": 0.23
  },
  {
    "name": "Lotka-Volterra equation",
    "concreteness": 0.13,
    "mathematicality": 0.97,
    "computationality": 0.21
  },
  {
    "name": "Schelling model of segregation",
    "concreteness": 0.22,
    "mathematicality": 0.15,
    "computationality": 0.89
  },
  {
    "name": "Derosophila the model organism",
    "concreteness": 0.81,
    "mathematicality": 0.37,
    "computationality": 0.41
  },
  {
    "name": "Harmonic equations for pendulum etc",
    "concreteness": 0.29,
    "mathematicality": 0.85,
    "computationality": 0.33
  },
  {
    "name": "Watson and Crick DNA helix",
    "concreteness": 0.74,
    "mathematicality": 0.22,
    "computationality": 0.27
  },
  {
    "name": "xDNA",
    "concreteness": 0.61,
    "mathematicality": 0.31,
    "computationality": 0.12
  },
  {
    "name": "Game of Life cellular automata",
    "concreteness": 0.44,
    "mathematicality": 0.54,
    "computationality": 0.97
  }
];

// --- 3D Plotly Visualization ---
function plotModels() {
    const x = models.map(m => m.concreteness);
    const y = models.map(m => m.mathematicality);
    const z = models.map(m => m.computationality);
    // Tooltip text for each model
    const hoverText = models.map(m =>
        `Name: ${m.name}<br>Concreteness: ${m.concreteness}<br>Mathematicality: ${m.mathematicality}<br>Computationality: ${m.computationality}`
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
            zaxis: { title: 'Computationality', range: [0, 1] },
            bgcolor: "#000000"
        },
        paper_bgcolor: "#000000",
        plot_bgcolor: "#000000"
    };

    Plotly.newPlot('plotly-3d', [trace], layout, { responsive: true });
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
        computationality: parseFloat(document.getElementById('modelComp').value)
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

// Add this to your JS to link the button and the hidden input
document.getElementById('loadExcelBtn').addEventListener('click', function() {
    document.getElementById('excelInput').click();
});

// Range slider value display
const concSlider = document.getElementById('modelConc');
const mathSlider = document.getElementById('modelMath');
const compSlider = document.getElementById('modelComp');
const concVal = document.getElementById('concVal');
const mathVal = document.getElementById('mathVal');
const compVal = document.getElementById('compVal');

concSlider.addEventListener('input', () => concVal.textContent = concSlider.value);
mathSlider.addEventListener('input', () => mathVal.textContent = mathSlider.value);
compSlider.addEventListener('input', () => compVal.textContent = compSlider.value);

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
        `Name: ${m.name}<br>Concreteness: ${m.concreteness}<br>Mathematicality: ${m.mathematicality}<br>Computationality: ${m.computationality}`
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

//test
d3.select("#d3sandbox")
    .append("svg")
    .attr("id", "testsvg")
    .attr("width", 400)
    .attr("height", 400)
    .style("display", "block")
    .style("margin", "0 auto");

//set some markers
const markers = models.map(m => ({
    x: m.concreteness * 400,
    y: m.mathematicality * 400,
    r: m.computationality * 10 + 5
}));

//add markers to the SVG
d3.select("#testsvg")
    .selectAll("circle")
    .data(markers)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .style("fill", "blue")
    .style("opacity", 0.5);


    d3.select("#testsvg")
        .append("path")
        .attr("d", d3.symbol().type(d3.symbolCircle).size(30 * 30 * Math.PI)()) // area = πr², r=30
        .attr("transform", "translate(200,200)")
        .style("fill", "green")
        .style("opacity", 0.7);


// Excel file upload functionality

document.getElementById('excelInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    };
    reader.readAsArrayBuffer(file);
});

// Add this to your JS to link the button and the hidden input
document.getElementById('wordChartBtn').addEventListener('click', function() {
    
});