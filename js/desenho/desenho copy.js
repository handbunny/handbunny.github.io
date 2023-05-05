const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

// Função que processa os resultados da detecção de mãos
function onResults(results)
{
    canvasCtx.save();
    // Limpa o canvas
    canvasCtx.clearRect( 0, 0, canvasElement.width, canvasElement.height );

    // Desenha a imagem da câmera no canvas
    canvasCtx.drawImage( results.image, 0, 0, canvasElement.width, canvasElement.height );
    if (results.multiHandLandmarks)
    {
        for (const landmarks of results.multiHandLandmarks)
        {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,  {color: '#F1FAEE', lineWidth: 3}  );
            drawLandmarks(canvasCtx, landmarks, {color: '#E63946', lineWidth: 1});

            // verifica a direção do dedo indicador
            const direction = checkFingerDirection(landmarks);

            // Atualiza a legenda com a direção do dedo indicador
            fingerDirectionElement.textContent = direction;
        }
    }
    canvasCtx.restore();
}

// Configura o detector de mãos do MediaPipe Hands
const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  selfieMode: true,
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

// Inicializa a câmera
const camera = new Camera(videoElement,
{
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1024,
  height: 768
});
camera.start();


