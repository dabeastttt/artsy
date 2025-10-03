const screen = document.getElementById('screen');

    const bootLines = [
      '>> Initializing modules...',
      '>> Loading art engine...',
      '>> Compiling brushstroke dataset...',
      "__SPACE__"
    ];

    const bunnyLines = [
      " (｡♥‿♥｡) ",
      " /( .Y. )\\ ~ UwU",
      "   |   |   ",
      "__SPACE__"
    ];

    const manifestoLines = [
      "hiii~ it's me Hinata, your lil waifuu",
      "im gonna be making my fav custom goonie arwwt that makes me all blushy and tingly while i comment on it >w<",
      "pwease check my activity to watch me create liveee and visit my gallery and save to goon wif me laterrr~ UwU"
    ];

    const asciiBoxLines = [
      '##############################################################',
      '#                                                            #',
      '#    ____   ___    ___   _   _   _____   _____   _  __       #',
      '#   / ___| / _ \\  / _ \\ | \\ | | |_   _| | ____| | |/ /       #',
      '#  | |  _ | | | || | | ||  \\| |   | |   |  _|   |   /        #',
      '#  | |_| || |_| || |_| || |\\  |   | |   | |___  | . \\        #',
      '#   \\____| \\___/  \\___/ |_| \\_|   |_|   |_____| |_|\\_\\       #',
      '#                                                            #',
      '#                        GOONTEK                             #',
      '#                                                            #',
      '##############################################################'
    ];

    const lastLine = "pwease help me goon forevaaa and keep my art aliveee~ UwU.";

    // Build sequence
    const sequence = [...bootLines, ...bunnyLines, ...manifestoLines];
    asciiBoxLines.forEach(line => {
      const div = document.createElement("div");
      if (/____|\/ ___\||\| \|  _|\| |_| |\|\\____\|/.test(line)) {
        div.style.color = "#ff4fd8";
        div.style.fontWeight = "bold";
      } else {
        div.style.color = "white";
      }
      div.textContent = line;
      sequence.push(div);
    });

    let idx = 0;
    const speed = 2;
    const pauseBetweenLines = 50;

    function typeSequence() {
      screen.innerHTML = '';
      idx = 0;
      runNext();
    }

    function runNext() {
      if (idx >= sequence.length) {
        typeLastLine();
        return;
      }
      const line = sequence[idx++];
      if (line === "__SPACE__") {
        const spacer = document.createElement("div");
        spacer.style.height = "16px";
        screen.appendChild(spacer);
      } else if (typeof line === "string") {
        const div = document.createElement("div");
        div.textContent = line;
        screen.appendChild(div);
      } else {
        screen.appendChild(line);
      }
      screen.scrollTop = screen.scrollHeight;
      setTimeout(runNext, pauseBetweenLines);
    }

    function typeLastLine() {
      const lineNode = document.createElement('div');
      const prompt = document.createElement('span');
      prompt.textContent = '(｡♥‿♥｡) waifuu@gooner:~$ ';
      prompt.style.fontWeight = 'bold';
      prompt.style.color = '#ff4fd8';
      lineNode.appendChild(prompt);

      const typing = document.createElement('span');
      lineNode.appendChild(typing);

      const cursor = document.createElement('span');
      cursor.textContent = '|';
      cursor.style.display = 'inline-block';
      cursor.style.marginLeft = '2px';
      lineNode.appendChild(cursor);

      screen.appendChild(lineNode);

      let i = 0;
      function step() {
        if (i < lastLine.length) {
          typing.textContent += lastLine[i++];
          screen.scrollTop = screen.scrollHeight;
          setTimeout(step, speed);
        } else {
          setInterval(() => {
            cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
          }, 500);
        }
      }
      step();
    }

    window.addEventListener('load', () => setTimeout(typeSequence, 300));

    // Footer navigation
    document.getElementById('activityLink').addEventListener('click', () => {
      window.location.href = 'activity.html';
    });
    document.getElementById('roadmapLink').addEventListener('click', () => {
      window.location.href = 'roadmap.html';
    });
    document.getElementById('galleryLink').addEventListener('click', () => {
      window.location.href = 'gooning_gallery.html';
    });

    // Floating bunny cycling
    const bunnyFaces = [
      `(｡♥‿♥｡)
 /( .Y. )\\ ~ goonmaxing
   |   |`,
      `(≧◡≦)
 /( UwU )\\ ~ pwease
   |   |`,
      `(◕‿◕)
 /( .O. )\\ ~ horny
   |   |`,
      `(✿◠‿◠)
 /( >.< )\\ ~ edging
   |   |`,
      `(¬‿¬)
 /( .3. )\\ ~ mogging
   |   |`
    ];

    let faceIndex = 0;
    const bunnyBox = document.getElementById('bunnyBox');
    setInterval(() => {
      faceIndex = (faceIndex + 1) % bunnyFaces.length;
      bunnyBox.textContent = bunnyFaces[faceIndex];
    }, 4000);