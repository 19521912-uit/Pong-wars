const colorPalette = {
    DarkGray: "#444",
    Orange: "#ff7e5f",
    Border: "#1e1e1e",
    Text: "#e0e0e0",
};

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const DAY_COLOR = colorPalette.Orange; // Thay đổi màu sắc cho ban ngày
const DAY_BALL_COLOR = colorPalette.DarkGray; // Thay đổi màu sắc cho quả bóng trong ban ngày
const NIGHT_COLOR = colorPalette.DarkGray; // Thay đổi màu sắc cho ban đêm
const NIGHT_BALL_COLOR = colorPalette.Orange; // Thay đổi màu sắc cho quả bóng trong ban đêm
const SQUARE_SIZE = 25;
const MIN_SPEED = 5;
const MAX_SPEED = 10;

const numSquaresX = canvas.width / SQUARE_SIZE;
const numSquaresY = canvas.height / SQUARE_SIZE;

let dayScore = 0;
let nightScore = 0;

const squares = [];

// Populate the fields, one half day, one half night
for (let i = 0; i < numSquaresX; i++) {
    squares[i] = [];
    for (let j = 0; j < numSquaresY; j++) {
        squares[i][j] = i < numSquaresX / 2 ? DAY_COLOR : NIGHT_COLOR;
    }
}

const balls = [
    {
        x: canvas.width / 4,
        y: canvas.height / 2,
        dx: 8,
        dy: -8,
        reverseColor: DAY_COLOR,
        ballColor: DAY_BALL_COLOR,
    },
    {
        x: (canvas.width / 4) * 3,
        y: canvas.height / 2,
        dx: -8,
        dy: 8,
        reverseColor: NIGHT_COLOR,
        ballColor: NIGHT_BALL_COLOR,
    },
];

let iteration = 0;

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = ball.ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawSquares() {
    dayScore = 0;
    nightScore = 0;

    for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
            ctx.fillStyle = squares[i][j];
            ctx.fillRect(
                i * SQUARE_SIZE,
                j * SQUARE_SIZE,
                SQUARE_SIZE,
                SQUARE_SIZE
            );

            // Update scores
            if (squares[i][j] === DAY_COLOR) dayScore++;
            if (squares[i][j] === NIGHT_COLOR) nightScore++;
        }
    }
}

function checkSquareCollision(ball) {
    // Check multiple points around the ball's circumference
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const checkX = ball.x + Math.cos(angle) * (SQUARE_SIZE / 2);
        const checkY = ball.y + Math.sin(angle) * (SQUARE_SIZE / 2);

        const i = Math.floor(checkX / SQUARE_SIZE);
        const j = Math.floor(checkY / SQUARE_SIZE);

        if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
            if (squares[i][j] !== ball.reverseColor) {
                // Square hit! Update square color
                squares[i][j] = ball.reverseColor;

                // Determine bounce direction based on the angle
                if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
                    ball.dx = -ball.dx;
                } else {
                    ball.dy = -ball.dy;
                }
            }
        }
    }
}

function checkBoundaryCollision(ball) {
    if (
        ball.x + ball.dx > canvas.width - SQUARE_SIZE / 2 ||
        ball.x + ball.dx < SQUARE_SIZE / 2
    ) {
        ball.dx = -ball.dx;
    }
    if (
        ball.y + ball.dy > canvas.height - SQUARE_SIZE / 2 ||
        ball.y + ball.dy < SQUARE_SIZE / 2
    ) {
        ball.dy = -ball.dy;
    }
}

function addRandomness(ball) {
    ball.dx += Math.random() * 0.01 - 0.005;
    ball.dy += Math.random() * 0.01 - 0.005;

    // Limit the speed of the ball
    ball.dx = Math.min(Math.max(ball.dx, -MAX_SPEED), MAX_SPEED);
    ball.dy = Math.min(Math.max(ball.dy, -MAX_SPEED), MAX_SPEED);

    // Make sure the ball always maintains a minimum speed
    if (Math.abs(ball.dx) < MIN_SPEED)
        ball.dx = ball.dx > 0 ? MIN_SPEED : -MIN_SPEED;
    if (Math.abs(ball.dy) < MIN_SPEED)
        ball.dy = ball.dy > 0 ? MIN_SPEED : -MIN_SPEED;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquares();

    scoreElement.textContent = `day ${dayScore} | night ${nightScore}`;

    balls.forEach((ball) => {
        drawBall(ball);
        checkSquareCollision(ball);
        checkBoundaryCollision(ball);
        ball.x += ball.dx;
        ball.y += ball.dy;

        addRandomness(ball);
    });

    iteration++;
    if (iteration % 1_000 === 0) console.log("iteration", iteration);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
