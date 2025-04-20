
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let player = {
    x: 200,
    y: 550,
    size: 30,
    color: "#FF0"
};

let lanes = [];
const laneHeight = 50;
const speed = 2;

function createLane(y) {
    return {
        y: y,
        cars: Array.from({length: 3}, (_, i) => ({
            x: Math.random() * canvas.width,
            width: 50,
            height: 30,
            speed: speed + Math.random() * 2
        }))
    };
}

for (let i = 0; i < 12; i++) {
    lanes.push(createLane(i * laneHeight));
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawLanes() {
    ctx.fillStyle = "#666";
    lanes.forEach(lane => {
        ctx.fillRect(0, lane.y, canvas.width, laneHeight);
        lane.cars.forEach(car => {
            ctx.fillStyle = "#F00";
            ctx.fillRect(car.x, lane.y + 10, car.width, car.height);
            car.x += car.speed;
            if (car.x > canvas.width) car.x = -car.width;
        });
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLanes();
    drawPlayer();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") player.y -= laneHeight;
    if (e.key === "ArrowDown") player.y += laneHeight;
    if (e.key === "ArrowLeft") player.x -= laneHeight;
    if (e.key === "ArrowRight") player.x += laneHeight;
});

update();
