(function() {
    const defaultPlayers = [
        'Evan (F)',
        'Joel (G)',
        'Ian (C)',
        'Jacob (F)',
        'Sachitt (G)',
        'Patrick (C)',
        'Yuva (F)',
        'Jared (G)',
        'Ethan (F)',
        'Ben (G)'
    ];
    const playersNode = document.getElementById('players');
    const lineupNode = document.getElementById('lineup');
    const shuffleNode = document.getElementById('shuffle');
    let dragSrcEl = null; // used to drag dragged item
    let pageY = 0; // used to determine drag direction

    function shuffle(array) {
        const list = [...array];
        let currentIndex = list.length;
        let temporaryValue;
        let randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = list[currentIndex];
            list[currentIndex] = list[randomIndex];
            list[randomIndex] = temporaryValue;
        }

        return list;
    }

    function shufflePlayers() {
        const activePlayers = getActivePlayers();
        const players = shuffle(activePlayers);
        renderPlayers(players);
        renderLineup();
    }

    function getActivePlayers() {
        const activeList = Array.from(document.getElementsByClassName('active'));
        const players = [];

        if (activeList) {
            activeList.forEach(player => {
                if (player.checked) {
                    players.push(player.value);
                }
            });
        }

        return players;
    }

    /**
     * Player Drag and Drop handlers
     */
    function handleDragStart(e) {
        this.style.opacity = '0.4';

        // store reference to dragged element
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        pageY = e.pageY;
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        // this / e.target is the current hover target.
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        // this / e.target is previous target element.
        this.classList.remove('over');
    }

    function handleDrop(e) {
        // this / e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // Don't do anything if dropping the same player we're dragging.
        if (dragSrcEl != this) {
            if (e.pageY > pageY) {
                // player was moved down
                this.parentNode.insertBefore(dragSrcEl, this.nextElementSibling);
            } else {
                // player was moved up
                this.parentNode.insertBefore(dragSrcEl, this);
            }
            // re-render lineup based on new order
            renderLineup();
        }

        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1.0';
        const draggableItems = Array.from(document.getElementsByClassName('draggable'));
        draggableItems.forEach(item => item.classList.remove('over'));
    }

    /**
     * Renderers
     */
    function renderPlayers(players = defaultPlayers) {
        const markup = [];
        players.forEach(p => {
            markup.push(`
                <li class="list-group-item draggable" draggable="true">
                    <input class="active" type="checkbox" value="${p}" checked> ${p}</input>
                </li>
            `);
        });
        playersNode.innerHTML = markup.join('');

        attachDDListeners();
    }

    function renderLineup() {
        const perQuarter = 5;
        const periods = 8;
        const total = perQuarter * periods;

        let x = 1;
        let start = 0;
        let period = 1;
        let currentPlayers = [];

        const listMarkup = [];
        const players = getActivePlayers();

        while (x <= total) {
            // add player
            currentPlayers.push(players[start]);

            // determine players whenever perQuarter limit is met
            if (x > 0 && x % perQuarter === 0) {
                // print players
                listMarkup.push(`<li class="list-group-item">${period}. ${currentPlayers.join(', ')}</li>`);

                // increment to display next period
                period++;

                // reset current players
                currentPlayers = [];
            }

            start++;

            if (start > (players.length - 1)) {
                start = 0;
            }

            x++;
        }

        // output markup
        lineupNode.innerHTML = listMarkup.join('');
    }

    /**
     * DOM event handlers
     */
    function attachListeners() {
        playersNode.addEventListener('click', event => {
            if (event.target.tagName !== 'input') {
                const input = event.target.firstElementChild;
                if (input) {
                    input.checked = !input.checked;
                    renderLineup();
                }
            }
        });
        playersNode.addEventListener('change', renderLineup);
        shuffleNode.addEventListener('click', shufflePlayers);
        shuffleNode.addEventListener('tap', shufflePlayers);
    }

    /**
     * Drag and Drop listeners for each player
     */
    function attachDDListeners() {
        const draggableItems = Array.from(document.getElementsByClassName('draggable'));
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart, false);
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
            item.addEventListener('dragend', handleDragEnd, false);
        });
    }

    // init
    renderPlayers();
    renderLineup();
    attachListeners();
})();
