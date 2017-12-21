// These texts should address something about someone
// They should be subversive, unsettling, and anxiety-producing
// They can be comments or questions
const wallTexts = [
  "Your hair doesn't look very good.",
  "I know who you are and so do you.",
  "Do you have your wallet?",
  "Who can you trust today?",
  "How many friends do you have?",
  "Are they your friends?",
  "There are a lot of people looking at you.",
  "Does your dad know who you are?",
  "Your mom is disappointed in you.",
  "I bet your partner is disappointed in you too.",
  " ... if you have one ... ",
  "What are people thinking about you?",
  "Have you made any new friends lately?",
  "New people don't like you.",
  "I'm not sure anyone likes you.",
  "How can you be sure?",
  "You try too hard.",
  "You are too ambitious.",
  "Nothing is as it seems.",
  "You were rude on the subway this morning.",
  "Strangers think you're an asshole.",
  "Why are you sad?",
  "You have no reason to be sad.",
  "Your life is perfect.",
  "Your life will never get better.",
  "Being a tortured soul is passé.",
  "Everything you've ever lost has been your fault.",
  "You've ruined lives.",
  "You are never yourself anymore.",
  "Do you know who you are?",
  "You haven't accomplished all your goals.",
  "You know I'm lying.",
  "But it doesn't matter.",
  "You know I'll win.",
  "You never win anymore.",
  "You're too 'nice'.",
  "You know who I am.",
  "This isn't something you can 'work on'.",
  "You know you can get better.",
  "You know how to get better",
  " ... maybe ...",
  "Your face is a weird shape.",
  "Your habits are annoying.",
  "The people you love don't love you.",
  "Your dad doesn't know who you are.",
  "You are a bad child.",
  "",
  "",
  "",
  "",
  "People love you.",
  "",
  "",
  "",
  "",
];

export default function sketch(p, elem) {
  let colfax;
  let bgColor;
  let textColor;
  const baseRate = 0.1;
  const maxRate = 3;
  const rateGrowth = 0.01;
  let frameRate = 1;

  let wallIndex = 0;
  function wallText() {
    return wallTexts[wallIndex++ % wallTexts.length];
  }

  const startX = 16;
  let curY = 0;
  let lineHeight = 96;
  let textHeight = 48;
  function drawText(text) {
    curY += lineHeight; // increment the row
    clearRow(curY);

    p.fill(textColor);
    p.text(text, startX, curY + ((lineHeight - textHeight) / 2));
    if (curY > p.height - lineHeight) {
      curY = 0;
    }
  }

  function clearRow(r) {
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill(bgColor);
    p.rect(0, r, p.width * 2, lineHeight);
  }


  p.preload = () => {
    // colfax = p.loadFont('ColfaxWebThinSub.otf');
    colfax = p.loadFont('Colfax-Bold.otf');
  };


  p.setup = () => {
    p.createCanvas(elem.offsetWidth, elem.offsetHeight);
    lineHeight = lineHeight * p.height / 1014;
    textHeight = textHeight * p.height / 1014;
    p.textFont(colfax);
    p.textSize(textHeight);
    p.frameRate(60); // just to start off quickly
    bgColor = p.color(255);
    textColor = p.color(0);
    p.background(bgColor);

  };

  p.draw = () => {
    // Increase exponentially
    frameRate = p.constrain(frameRate + rateGrowth, baseRate, maxRate);
    p.frameRate(frameRate);
    drawText(wallText());
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
