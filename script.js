import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const GLADIATORS_COUNT = 5;
let gladiators = [];
let battleInterval;

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

function updateBattle() {
  const deltaTime = 100;

  gladiators.forEach(gladiator => {
    if (gladiator.health > 0) {
      gladiator.timeSinceLastAttack += deltaTime;
      let currentSpeed = calculateSpeed(gladiator);
      let interval = 5000 / currentSpeed;
      if (gladiator.timeSinceLastAttack >= interval) {
        attack(gladiator);
        gladiator.timeSinceLastAttack -= interval;
      }
    }
  });

  gladiators.forEach(gladiator => {
    let healthSpan = document.querySelector(`#gladiator-${gladiator.name} .health`);
    let speedSpan = document.querySelector(`#gladiator-${gladiator.name} .speed`);
    if (healthSpan) {
      healthSpan.textContent = gladiator.health.toFixed(1);
    }
    if (speedSpan) {
      let currentSpeed = calculateSpeed(gladiator);
      speedSpan.textContent = currentSpeed.toFixed(3);
    }
  });

  let deadGladiators = gladiators.filter(g => g.health <= 0);
  if (deadGladiators.length > 0) {
    clearInterval(battleInterval);
    let gladiatorToDecide = deadGladiators[0];
    let decision = Math.random() < 0.5 ? 'finish' : 'live';
    log(`Caesar shows ${decision === 'finish' ? ':-1:' : ':+1:'} to [${gladiatorToDecide.name}].`);
    if (decision === 'finish') {
      gladiators = gladiators.filter(g => g !== gladiatorToDecide);
      let gladiatorDiv = document.getElementById(`gladiator-${gladiatorToDecide.name}`);
      if (gladiatorDiv) gladiatorDiv.remove();
    } else {
      gladiatorToDecide.health += 50;
    }

    let aliveGladiators = gladiators.filter(g => g.health > 0);
    if (aliveGladiators.length <= 1) {
      if (aliveGladiators.length === 1) {
        let winner = aliveGladiators[0];
        document.getElementById('result').textContent = `[${winner.name}] won the battle with health ${winner.health.toFixed(1)}.`;
      } else {
        document.getElementById('result').textContent = 'All gladiators are dead.';
      };
    } else {
      battleInterval = setInterval(updateBattle, 100);
    };
  }
}

function startBattle() {
  battleInterval = setInterval(updateBattle, 100);
}

document.getElementById('start').addEventListener('click', () => {
  document.getElementById('log').innerHTML = '';
  document.getElementById('gladiators').innerHTML = '';
  document.getElementById('result').innerHTML = '';
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
    div.innerHTML = `<h3>${gladiator.name}</h3><p>Health: <span class='health'>${gladiator.health.toFixed(1)}</span></p><p>Power: ${gladiator.power.toFixed(1)}</p><p>Speed: <span class='speed'>${gladiator.speed.toFixed(3)}</span></p>`;
    document.getElementById('gladiators').appendChild(div);
  });

  startBattle();
});
