const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let isDrawing = false;
let lastPoint = null;

function draw(point) {
  if (lastPoint == null) {
    lastPoint = point;
  }

  context.beginPath();
  context.moveTo(lastPoint.x, lastPoint.y);
  context.lineTo(point.x, point.y);
  context.stroke();

  lastPoint = point;
}

function startDrawing() {
  isDrawing = true;
}

function stopDrawing() {
  isDrawing = false;
  lastPoint = null;
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults((results) => {
  if (results.multiHandLandmarks) {
    const handLandmarks = results.multiHandLandmarks[0];
    const indexFinger = handLandmarks[8];

    const x = indexFinger.x * canvas.width;
    const y = indexFinger.y * canvas.height;

    if (isDrawing) {
      draw({x, y});
    }
  }
});
hands.start();
