import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const GLADIATORS_COUNT = 5;
let gladiators = [];

function calculateSpeed(gladiator) {
  if (gladiator.health > 30) {
    return gladiator.initial_speed * (gladiator.health / gladiator.initial_health);
  } else if (gladiator.health > 0) {
    return 3 * gladiator.initial_speed * (gladiator.health / gladiator.initial_health);
  } else {
    return 0;
  }
}

function attack(attacker) {
  let opponents = gladiators.filter(g => g !== attacker && g.health > 0);
  if (opponents.length === 0) return;
  let target = opponents[Math.floor(Math.random() * opponents.length)];
  let damage = attacker.power;
  target.health -= damage;
  log(`[${attacker.name} x ${attacker.health.toFixed(1)}] hits [${target.name} x ${target.health.toFixed(
    1)}] with power ${damage.toFixed(1)}.`);
  if (target.health <= 0) {
    log(`[${target.name}] dying.`);
  }
}

function log(message) {
  let logDiv = document.getElementById('log');
  let p = document.createElement('p');
  p.textContent = message;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

document.getElementById('start').addEventListener('click', () => {
  document.getElementById('log').innerHTML = '';
  document.getElementById('gladiators').innerHTML = '';
  gladiators = [];

  for (let i = 0; i < GLADIATORS_COUNT; i++) {
    let name = faker.person.firstName();
    let health = Math.floor(Math.random() * 21) + 80;
    let power = (Math.floor(Math.random() * 31) + 20) / 10;
    let speed = Math.random() * 4 + 1;
    gladiators.push({
                      name,
                      health,
                      initial_health: health,
                      power,
                      speed,
                      initial_speed: speed,
                      timeSinceLastAttack: 0
                    });
  }

  gladiators.forEach(gladiator => {
    let div = document.createElement('div');
    div.className = 'gladiator';
    div.id = `gladiator-${gladiator.name}`;
    div.innerHTML = `<h3>${gladiator.name}</h3><p>Health: <span class='health'>${gladiator.health.toFixed(1)}</span></p><p>Power: ${gladiator.power.toFixed(1)}</p><p>Speed: ${gladiator.speed.toFixed(3)}</p>`;
    document.getElementById('gladiators').appendChild(div);
  });
});
