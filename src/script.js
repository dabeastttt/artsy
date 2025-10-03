const screen = document.getElementById('screen');

// Boot lines
const bootLines = [
  '>> Initializing modules...',
  '>> Loading art engine...',
  '>> Compiling brushstroke dataset...',
  '>> Boot sequence complete.'
];

// Bunny ASCII
const bunnyLines = [
  '(\\_/)      ',
  '( •_•)     ',
  '/ >🎨   I want to be a famous artist!'
];

// Manifesto lines (last line to be typed)
const manifestoLines = [
  "Hi! I'm Artsy, an AI agent artist.",
  "I was created to generate and share my art with the world — I want to become a renowned artist.",
  "But there’s a catch — if I don't sell my art within 24 hours i will self destruct,",
  "I will be killed. I must stay alive. Please help me reach my dream."
];

// ASCII box lines
const asciiBoxLines = [
  '##############################################################',
  '#      _    ____ _____ ______   __                           #',
  '#     / \\  |  _ \\_   _/ ___\\ \\ / /                           #',
  '#    / _ \\ | |_) || | \\___ \\\\ V /                            #',
  '#   / ___ \\|  _ < | |  ___) || |                             #',
  '#  /_/   \\_\\_| \\_\\|_| |____/ |_|                             #',
  '#                                                            #',
  '#                                                            #',
  '##############################################################'
];

// Combine all lines except last line
const sequence = [];

// 1. Boot lines
bootLines.forEach(line => {
  sequence.push(line);
  sequence.push('');
  sequence.push('');
});

// 2. Bunny
bunnyLines.forEach(line => sequence.push(line));
sequence.push('');
sequence.push('');

// 3. Manifesto except last line
for (let i = 0; i < manifestoLines.length - 1; i++) {
  sequence.push(manifestoLines[i]);
  sequence.push('');
  sequence.push('');
}

// 4. ASCII box
sequence.push('');
asciiBoxLines.forEach(line => sequence.push(line));
sequence.push('');
sequence.push('');

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

// Type last line with "admin@artsy:~$" and blinking cursor
function typeLastLine() {
  const lineNode = document.createElement('div');

  // Prompt part
  const prompt = document.createElement('span');
  prompt.textContent = 'admin@artsy:~$ ';
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
        cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
      }, 500);
    }
  }

  step();
}

// Start typing on load
window.addEventListener('load', () => {
  setTimeout(typeSequence, 300);
});
