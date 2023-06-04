const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const convertBtn = document.getElementById('convertBtn');
const codeContainer = document.getElementById('codeContainer');

let isDrawing = false;
let startPosition = { x: 0, y: 0 };
let rectangles = [];

// Event listener for mouse down
canvas.addEventListener('mousedown', (event) => {
  isDrawing = true;
  startPosition.x = event.clientX - canvas.getBoundingClientRect().left;
  startPosition.y = event.clientY - canvas.getBoundingClientRect().top;
});

// Event listener for mouse up
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// Event listener for mouse move
canvas.addEventListener('mousemove', (event) => {
  if (isDrawing) {
    const currentX = event.clientX - canvas.getBoundingClientRect().left;
    const currentY = event.clientY - canvas.getBoundingClientRect().top;
    const width = currentX - startPosition.x;
    const height = currentY - startPosition.y;
    const rectangle = {
      x: startPosition.x,
      y: startPosition.y,
      width,
      height
    };
    rectangles.push(rectangle);
    drawRectangles();
  }
});

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
