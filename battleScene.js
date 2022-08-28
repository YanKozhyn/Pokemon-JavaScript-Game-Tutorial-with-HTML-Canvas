const battleBackgroundImage = new Image();
battleBackgroundImage.src = 'assets/Images/battleBackground.png';
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});
let draggle;
let emby;
let renderSprites;
let battleAnimationId;
let queue;

function initBattle() {
  userInterface.style.display = 'block';
  dialogueBox.style.display = 'none';
  enemyHealthBar.style.width = '100%';
  playerHealthBar.style.width = '100%';
  AttackBox.replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderSprites = [draggle, emby];
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.innerHTML = attack.name;
    AttackBox.append(button);
  });
  queue = [];

  // our event Listeners for buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          //fade back to black
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              userInterface.style.display = 'none';
              gsap.to('#overlappingDiv', {
                opacity: 0,
              });

              battle.initiated = false;
            },
          });
        });
      }

      //draggle or enemy attacks right here
      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderSprites,
        });
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint();
          });

          queue.push(() => {
            //fade back to black
            gsap.to('#overlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                userInterface.style.display = 'none';
                gsap.to('#overlappingDiv', {
                  opacity: 0,
                });

                battle.initiated = false;
              },
            });
          });
        }
      });
    });

    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      AttackType.innerHTML = selectedAttack.type;
      AttackType.style.color = selectedAttack.color;
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  renderSprites.forEach((sprites) => {
    sprites.draw();
  });
}

initBattle();
animateBattle();

dialogueBox.addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = 'none';
});
