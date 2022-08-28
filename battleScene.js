const battleBackgroundImage = new Image();
battleBackgroundImage.src = 'assets/Images/battleBackground.png';
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggleImage = new Image();
draggleImage.src = 'assets/Images/draggleSprite.png';
const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  isEnemy: true,
  name: 'Draggle',
});

const embyImage = new Image();
embyImage.src = 'assets/Images/embySprite.png';
const emby = new Sprite({
  position: {
    x: 280,
    y: 330,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  name: 'Emby',
});

const renderSprites = [draggle, emby];

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
    queue.push(() => {
      draggle.attack({
        attack: attacks.Tackle,
        recipient: emby,
        renderSprites,
      });
    });

    queue.push(() => {
        draggle.attack({
          attack: attacks.Fireball,
          recipient: emby,
          renderSprites,
        });
      });
  });
});

dialogueBox.addEventListener('click', (e) => {
  if ((queue.length > 0)) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = 'none';
});
