const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const convertBtn = document.getElementById('convertBtn');
const codeContainer = document.getElementById('codeContainer');

let rectangles = [];
let isDrawing = false;
let selectedRectangle = null;
let offsetX, offsetY;

// Event listener for mouse down
canvas.addEventListener('mousedown', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  selectedRectangle = getRectangleAtPosition(mouseX, mouseY);
  if (selectedRectangle) {
    offsetX = mouseX - selectedRectangle.x;
    offsetY = mouseY - selectedRectangle.y;
  } else {
    isDrawing = true;
    const rectangle = {
      x: mouseX,
      y: mouseY,
      width: 0,
      height: 0
    };
    rectangles.push(rectangle);
  }
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
  } else if (selectedRectangle) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedRectangle.x = mouseX - offsetX;
    selectedRectangle.y = mouseY - offsetY;
    drawRectangles();
  }
});

// Event listener for mouse up
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  selectedRectangle = null;
});

// Function to get the rectangle at a given position
function getRectangleAtPosition(x, y) {
  for (let i = rectangles.length - 1; i >= 0; i--) {
    const rectangle = rectangles[i];
    if (
      x >= rectangle.x &&
      x <= rectangle.x + rectangle.width &&
      y >= rectangle.y &&
      y <= rectangle.y + rectangle.height
    ) {
      return rectangle;
    }
  }
  return null;
}

// Function to draw rectangles
function drawRectangles() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  rectangles.forEach((rectangle) => {
    context.beginPath();
    context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.strokeStyle = 'red';
    context.stroke();
    context.closePath();
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
  codeContainer.textContent = code;
});

// Function to generate HTML code
function generateHTML() {
  let html = '';
  rectangles.forEach((rectangle) => {
    html += `<div class="rectangle" style="left: ${rectangle.x}px; top: ${rectangle.y}px; width: ${rectangle.width}px; height: ${rectangle.height}px;"></div>`;
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
