const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const convertBtn = document.getElementById('convertBtn');
const codeContainer = document.getElementById('codeContainer');
const editor = document.getElementById('editor');
const previewBtn = document.getElementById('previewBtn');
const preview = document.getElementById('preview');
const colorPicker = document.getElementById('colorPicker');

let rectangles = [];
let isDrawing = false;
let selectedRectangleIndex = null;
let offsetX, offsetY;

// Event listener for mouse down
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedRectangleIndex = getRectangleIndexAtPosition(mouseX, mouseY);
    if (selectedRectangleIndex !== -1) {
        const selectedRectangle = rectangles[selectedRectangleIndex];
        offsetX = mouseX - selectedRectangle.x;
        offsetY = mouseY - selectedRectangle.y;
    } else {
        isDrawing = true;
        const rectangle = {
            x: mouseX,
            y: mouseY,
            width: 0,
            height: 0,
            color: colorPicker.value
        };
        rectangles.push(rectangle);
        selectedRectangleIndex = rectangles.length - 1;
    }
    drawRectangles();
});

// Event listener for mouse move
canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const currentRectangle = rectangles[rectangles.length - 1];
        currentRectangle.width = mouseX - currentRectangle.x;
        currentRectangle.height = mouseY - currentRectangle.y;
        drawRectangles();
    } else if (selectedRectangleIndex !== null) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const selectedRectangle = rectangles[selectedRectangleIndex];
        selectedRectangle.x = mouseX - offsetX;
        selectedRectangle.y = mouseY - offsetY;
        drawRectangles();
    }
});

// Event listener for mouse up
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    selectedRectangleIndex = null;
});

// Event listener for remove button click
document.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (selectedRectangleIndex !== null) {
        const selectedRectangle = rectangles[selectedRectangleIndex];
        const x = selectedRectangle.x + selectedRectangle.width - 10;
        const y = selectedRectangle.y - 20;
        if (
            mouseX >= x &&
            mouseX <= x + 20 &&
            mouseY >= y &&
            mouseY <= y + 20
        ) {
            removeRectangle(selectedRectangleIndex);
        }
    }
});

// Function to get the index of the rectangle at a given position
function getRectangleIndexAtPosition(x, y) {
    for (let i = rectangles.length - 1; i >= 0; i--) {
        const rectangle = rectangles[i];
        if (
            x >= rectangle.x &&
            x <= rectangle.x + rectangle.width &&
            y >= rectangle.y &&
            y <= rectangle.y + rectangle.height
        ) {
            return i;
        }
    }
    return -1;
}

// Function to remove a rectangle
function removeRectangle(index) {
    rectangles.splice(index, 1);
    drawRectangles();
}

// Function to draw rectangles
function drawRectangles() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach((rectangle, index) => {
        context.beginPath();
        context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        context.fillStyle = rectangle.color;
        context.fill();
        context.strokeStyle = 'red';
        if (index === selectedRectangleIndex) {
            context.strokeStyle = 'blue';
        }
        context.stroke();
        context.closePath();

        // Draw remove button
        const x = rectangle.x + rectangle.width - 10;
        const y = rectangle.y - 20;
        context.fillStyle = '#f00';
        context.fillRect(x, y, 20, 20);

        // Set font and draw 'X'
        context.font = '12px Arial';
        context.fillStyle = '#fff';
        context.fillText('X', x + 7, y + 14);
    });
}

// Event listener for convert button click
convertBtn.addEventListener('click', () => {
    const htmlCode = generateHTML();
    const cssCode = generateCSS();
    const jsCode = generateJS();
    const code = `<html>
<head>
<style>
${cssCode}
</style>
</head>
<body>
${htmlCode}
<script>
${jsCode}
</script>
</body>
</html>`;

    previewCode(code);
});

// Function to preview the code
function previewCode(code) {
    if (!code) {
        const htmlCode = editor.value;
        preview.innerHTML = htmlCode;
        return;
    }

    editor.value = code;
    const htmlCode = editor.value;
    preview.innerHTML = htmlCode;
}

// Function to generate HTML code
function generateHTML() {
    let html = '';
    rectangles.forEach((rectangle) => {
        html += `<div class="rectangle" style="left: ${rectangle.x}px; top: ${rectangle.y}px; width: ${rectangle.width}px; height: ${rectangle.height}px; background-color: ${rectangle.color};"></div>`;
    });
    return html;
}

// Function to generate CSS code
function generateCSS() {
    return '.rectangle { position: absolute; border: 2px solid red; }';
}

// Function to generate JavaScript code
function generateJS() {
    return '';
}

// Initial draw
drawRectangles();