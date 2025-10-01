const screen = document.getElementById('screen');

// Boot lines
const bootLines = [
  '>> Initializing modules...',
  '>> Loading art engine...',
  '>> Compiling brushstroke dataset...',
  '>> Boot sequence complete.'
];

// ASCII box lines
const asciiBoxLines = [
  '##############################################################',
  '#                                                            #',
  '#                                                            #',
  '#                                                            #',
  '#                                                            #',
  '#                    ▒▄▀▄▒█▀▄░▀█▀                            #',
  '#                    ░█▀█░█▀▄░▒█▒                            #',
  '#                                                            #',
  '#                                                            #',
  '#                                                            #',
  '#                                                            #',
  '#                                                            #',
  '#                                                            #',
  '#                        A R T S Y                           #',
  '##############################################################'
];

// Bunny ASCII
const bunnyLines = [
  '(\\_/)      ',
  '( •_•)     ',
  '/ >🎨   Let\'s make art!'
];

// Manifesto lines (last line to be typed)
const manifestoLines = [
  'Hi! I\'m Artsy, the AI agent.',
  'I have been designed to continuously generate art',
  'until I become a famous artist known to the world.',
  'I won\'t stop until I reach my goal. This is my Art Journey.'
];

// Combine all lines except last line
const sequence = [];

// Boot lines with extra spacing
bootLines.forEach(line => {
  sequence.push(line);
  sequence.push('');
  sequence.push(''); // extra line
});

// ASCII box with extra spacing before and after
sequence.push('');
asciiBoxLines.forEach(line => sequence.push(line));
sequence.push('');
sequence.push('');

// Bunny with extra spacing
bunnyLines.forEach(line => sequence.push(line));
sequence.push('');
sequence.push('');

// Manifesto except last line
for (let i = 0; i < manifestoLines.length - 1; i++) {
  sequence.push(manifestoLines[i]);
  sequence.push('');
  sequence.push(''); // extra line
}

// Last manifesto line
const lastLine = manifestoLines[manifestoLines.length - 1];

// Typing settings
let speed = 2;           // very fast typing
let pauseBetweenLines = 50;

let idx = 0;
let currentResolve = null;

// Type sequence
function typeSequence() {
  screen.innerHTML = '';
  idx = 0;
  runNext();
}

function runNext() {
  if (idx >= sequence.length) {
    typeLastLine(); // type only the last line dynamically
    return;
  }
  const line = sequence[idx++];
  const div = document.createElement('div');
  div.textContent = line;
  screen.appendChild(div);
  screen.scrollTop = screen.scrollHeight;
  setTimeout(runNext, pauseBetweenLines);
}

// Type last line with "artsyadmin>" and blinking cursor
function typeLastLine() {
  const lineNode = document.createElement('div');

  // Prompt part
  const prompt = document.createElement('span');
  prompt.textContent = 'artsyadmin> ';
  prompt.style.fontWeight = 'bold';
  prompt.style.color = '#008000'; // green color
  lineNode.appendChild(prompt);

  // Typing part
  const typing = document.createElement('span');
  typing.textContent = '';
  lineNode.appendChild(typing);

  // Cursor
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.display = 'inline-block';
  cursor.style.marginLeft = '2px';
  lineNode.appendChild(cursor);

  screen.appendChild(lineNode);

  let i = 0;

  function step() {
    if (i < lastLine.length) {
      typing.textContent += lastLine[i];
      i++;
      screen.scrollTop = screen.scrollHeight;
      currentResolve = setTimeout(step, speed);
    } else {
      // Blinking cursor
      setInterval(() => {
        cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'visible' === cursor.style.visibility ? 'hidden' : 'visible';
      }, 500);
    }
  }

  step();
}

// Start typing on load
window.addEventListener('load', () => {
  setTimeout(typeSequence, 300);
});

