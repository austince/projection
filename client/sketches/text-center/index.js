const textHeight = 30;


// These text should address someone
// They should be direct, biting, and perhaps rude
// They should be commands or questions about where one is
const texts = [
  "Nothing to see here.",
  "Everything is as it seems.",
  "Think about who you are.",
  "I haven't seen you\nwith your friends lately.",
  "Turn around.",
  // "01100110\n00100000\n01110101", // 'f u' in binary
  "Why are you here?",
  "What are you looking at?",
  "How privileged are you?",
  "Move along.",
  "Call your parents.",
  "Go to counseling.",
  "Retreat to your bed.",
  "Cry.",
  "Turn around.",
  "Be 'yourself'.",
  "Be secure.",
  "What do you think\n I can do for you?",
  "Call your alcoholic friend.",
  "Donate to a charity.",
  "Be better at work.",
  "Be a better partner.",
  "Laugh and mean it.",
  "Stop looking at me.",
];

const finalText = "Love.";

export default function sketch(p, elem) {
  let colfax;
  let bgColor;
  let textColor;
  const stopTimeMillis = 1 * 60 * 1000; // millis before the last text is shown
  const baseRate = 0.1;
  const maxRate = 4.5;
  const rateGrowth = 0.1;
  let frameRate = baseRate;
  let lastMillis = 0;

  // Could be a generator function?
  let floorIndex = 0;
  function floorText() {
    return texts[floorIndex++ % texts.length];
  }

  function showText(text) {
    p.text(text, p.width / 8, p.height / 2);
  }

  p.preload = () => {
    // colfax = p.loadFont('ColfaxWebThinSub.otf');
    colfax = p.loadFont('Colfax-Bold.otf');
  };


  p.setup = () => {
    p.createCanvas(elem.offsetWidth, elem.offsetHeight);
    p.textFont(colfax);
    p.textSize(textHeight);
    p.frameRate(60); // just to start off quickly
    bgColor = p.color(255);
    textColor = p.color(0);
    p.background(bgColor);
    lastMillis = 0;
  };

  p.draw = () => {
    p.background(bgColor);
    lastMillis = p.millis();
    if (p.millis() > stopTimeMillis) {
      showText(finalText);
      lastMillis = 0;
      p.noLoop();
    } else {
      // Increase exponentially
      frameRate = p.constrain(frameRate + rateGrowth, baseRate, maxRate);
      p.frameRate(frameRate);
      showText(floorText());
    }
  };

  p.keyTyped = () => {

  };

  p.mouseMoved = () => {

  };

  p.windowResized = () => {
    console.log(`Resizing canvas to be ${elem.offsetWidth} x ${elem.offsetHeight}`);
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  };
}
