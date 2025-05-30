let pairs = {};
let wishlistsMap = {};
let passwordsMap = {};

function generateAssignments() {
  const names = document.getElementById("names").value.trim().split("\n").map(n => n.trim()).filter(Boolean);
  const passwords = document.getElementById("passwords").value.trim().split("\n").map(p => p.trim());
  const wishes = document.getElementById("wishlists").value.trim().split("\n").map(w => w.trim());
 
  if (names.length < 2) {
    alert("Please enter at least 2 names.");
    return;
  }

  if (names.length !== passwords.length || names.length !== wishes.length) {
    alert("Make sure each participant has a name, password, and wishlist.");
    return;
  }

  wishlistsMap = {};
  passwordsMap = {};

  names.forEach((name, i) => {
    wishlistsMap[name] = wishes[i];
    passwordsMap[name] = passwords[i];
  });

  const givers = [...names];
  const receivers = [...names];

  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    let shuffled = [...receivers].sort(() => Math.random() - 0.5);
    let valid = true;

    for (let i = 0; i < givers.length; i++) {
      if (givers[i] === shuffled[i]) {
        valid = false;
        break;
      }
    }

    if (valid) {
      pairs = {};
      givers.forEach((giver, i) => {
        pairs[giver] = shuffled[i];
      });
      break;
    }

    attempts++;
  }

  if (attempts === maxAttempts) {
    document.getElementById("result").textContent = "Could not generate valid assignments.";
    return;
  }

  const select = document.getElementById("nameSelect");
  select.innerHTML = "<option value='' disabled selected>Select your name</option>";
  names.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  select.style.display = 'inline-block';
  document.getElementById("participantPassword").style.display = 'inline-block';
  document.getElementById("revealBtn").style.display = 'inline-block';
  document.getElementById("result").textContent = "";
  document.getElementById("wishlistDisplay").textContent = "";
  
  const accessCode = prompt("Enter programmer access code:");
  if (accessCode === "santa2025") {
    document.getElementById("downloadBtn").style.display = 'inline-block';
  } else {
    document.getElementById("downloadBtn").style.display = 'none';
  }
}

function revealSanta() {
  const name = document.getElementById("nameSelect").value;
  const pass = document.getElementById("participantPassword").value;

  if (!name || !pass) return;

  if (passwordsMap[name] !== pass) {
    alert("Incorrect password.");
    return;
  }

  const assigned = pairs[name];
  const wish = wishlistsMap[assigned] || "No wishlist.";

  document.getElementById("result").textContent = `${name}, your Secret Santa is 🎁: ${assigned}`;
  document.getElementById("wishlistDisplay").textContent = `🎄 Wishlist for ${assigned}:\n${wish}`;
  launchConfetti();
}

function downloadAssignments() {
  let text = "Secret Santa Assignments:\n\n";
  for (let giver in pairs) {
    text += `${giver} -> ${pairs[giver]} (Wishlist: ${wishlistsMap[pairs[giver]]})\n`;
  }
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "secret_santa_assignments.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Snow animation
const snowCanvas = document.getElementById("snow");
const snowCtx = snowCanvas.getContext("2d");
let width, height;

function resizeCanvas() {
  width = snowCanvas.width = window.innerWidth;
  height = snowCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const snowflakes = Array.from({ length: 100 }).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height,
  r: Math.random() * 3 + 1,
  d: Math.random() * 0.5 + 0.5
}));

function drawSnowflakes() {
  snowCtx.clearRect(0, 0, width, height);
  snowCtx.fillStyle = "white";
  snowCtx.beginPath();
  for (const flake of snowflakes) {
    snowCtx.moveTo(flake.x, flake.y);
    snowCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2, true);
  }
  snowCtx.fill();
  moveSnowflakes();
}

function moveSnowflakes() {
  for (const flake of snowflakes) {
    flake.y += flake.d;
    if (flake.y > height) {
      flake.y = 0;
      flake.x = Math.random() * width;
    }
  }
}

function animateSnow() {
  drawSnowflakes();
  requestAnimationFrame(animateSnow);
}
animateSnow();

// Confetti animation
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 3 + 2,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let c of confetti) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
    }
    update();
  }

  function update() {
    for (let c of confetti) {
      c.y += c.d;
      if (c.y > canvas.height) {
        c.y = 0;
        c.x = Math.random() * canvas.width;
      }
    }
  }

  let frame = 0;
  function animate() {
    if (frame > 100) return;
    draw();
    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}
