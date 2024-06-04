const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameOver = false;

canvas.width = 400;
canvas.height = 600;

let car = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 50,
    speed: 25
};

let obstacles = [];
let signals = [];
let score = 0;

// Define los carriles
let lanes = [
    0,
    canvas.width / 6,
    2 * canvas.width / 6,
    3 * canvas.width / 6,
    4 * canvas.width / 6,
    5 * canvas.width / 6
];

let lastObstacleY = [canvas.height, canvas.height, canvas.height];  // Inicializa el seguimiento del último obstáculo en cada carril

function drawCar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function drawSignals() {
    ctx.fillStyle = 'green';
    signals.forEach(signal => {
        ctx.fillRect(signal.x, signal.y, signal.width, signal.height);
    });
}

function generateObstacles() {
    if (Math.random() < 0.06) {  // Ajusta esta probabilidad para controlar la frecuencia de los obstáculos
        let lane = Math.floor(Math.random() * lanes.length);
        let x = lanes[lane];
        let y = -30;
        obstacles.push({ x, y, width: 40, height: 50, speed: 4});
        console.log('Obstacules Generated', {x,y});
    }
}

function generateSignals() {
    if (Math.random() < 0.01) {
        let x = Math.random() * (canvas.width - 30);
        let y = -30;
        signals.push({ x, y, width: 30, height: 30, speed: 3 });
    }
}

function moveObstacles() {
    obstacles.forEach((obs, index) => {
        obs.y += obs.speed;
        lastObstacleY[index] = obs.y;  // Actualiza el seguimiento del último obstáculo en cada carril
    });
    obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function moveSignals() {
    signals.forEach(signal => {
        signal.y += signal.speed;
    });
    signals = signals.filter(signal => signal.y < canvas.height);
}

function detectCollisions() {
    obstacles.forEach(obs => {
        if (car.x < obs.x + obs.width &&
            car.x + car.width > obs.x &&
            car.y < obs.y + obs.height &&
            car.y + car.height > obs.y) {
                endGame();
        }
    });
}

function detectSignalCollisions() {
    signals.forEach(signal => {
        if (car.x < signal.x + signal.width &&
            car.x + car.width > signal.x &&
            car.y < signal.y + signal.height &&
            car.y + car.height > signal.y) {
                score += 10;
                signals = signals.filter(sig => sig !== signal);
        }
    });
}

function moveCar(event) {
    if (event.key === 'ArrowLeft' && car.x > 0) {
        car.x -= car.speed;
    }
    if (event.key === 'ArrowRight' && car.x < canvas.width - car.width) {
        car.x += car.speed;
    }
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('¡Juego terminado!', canvas.width / 5, canvas.height / 2);
}

function incredeDificulty(){
    obstacleSpeed += 1;
    clearInterval(obstacleInterval);
    obstacleGenerationInterval -=200;
    obstacleGenerationInterval = Math.max(obstacleGenerationInterval, 200);
    obstacleInterval = setInterval(generateObstacles, obstacleGenerationInterval);
}


function updateGame() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCar();
        drawObstacles();
        drawSignals();
        moveObstacles();
        moveSignals();
        generateObstacles();
        generateSignals();
        detectCollisions();
        detectSignalCollisions();
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);

        requestAnimationFrame(updateGame);
    }
}
    document.addEventListener('keydown', moveCar);
    updateGame();
    let obstacleInterval = setInterval(generateObstacles,3000);
    setInterval(generateSignals, 500);