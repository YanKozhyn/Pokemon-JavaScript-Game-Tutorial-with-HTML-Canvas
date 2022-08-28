const battleBackgroundImage = new Image();
battleBackgroundImage.src = 'assets/Images/battleBackground.png';
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});
const draggle = new Monster(monsters.Draggle);
const emby = new Monster(monsters.Emby);
const renderSprites = [draggle, emby];

emby.attacks.forEach((attack) => {
  const button = document.createElement('button');
  button.innerHTML = attack.name;
  AttackBox.append(button);
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  renderSprites.forEach((sprites) => {
    sprites.draw();
  });
}
//animate();
animateBattle();

const queue = [];
// our event Listeners for buttons (attack)
document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderSprites,
    });

    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderSprites,
      });
    });
  });

  button.addEventListener('mouseenter', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    AttackType.innerHTML = selectedAttack.type;
    AttackType.style.color = selectedAttack.color;
  });
});

dialogueBox.addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = 'none';
});
