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
