// Acessa o elemento canvas do HTML
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

// Cria um objeto que irá detectar as mãos do usuário
const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1, // permite apenas uma mão
  minDetectionConfidence: 0.5, // confiança mínima na detecção
  minTrackingConfidence: 0.5, // confiança mínima no rastreamento
});

// Inicializa a detecção de mãos na webcam do usuário
const camera = new Camera(canvas, {
  onFrame: async () => {
    await hands.send({image: camera.canvas});
  },
  width: 640,
  height: 480
});
camera.start();

// Desenha na tela quando houver movimento da mão
hands.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // limpa o canvas
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawHand(landmarks);
    }
  }
});

// Função para desenhar na tela
function drawHand(landmarks) {
  // Desenha cada ponto da mão como um círculo
  for (const point of landmarks) {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  // Liga os pontos com linhas
  ctx.beginPath();
  ctx.moveTo(landmarks[0].x * canvas.width, landmarks[0].y * canvas.height);
  for (const point of landmarks.slice(1)) {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;
    ctx.lineTo(x, y);
  }
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}
