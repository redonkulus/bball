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

    function renderPlayers(players = defaultPlayers) {
        const markup = [];
        players.forEach(p => {
            markup.push(`
                <li class="list-group-item">
                    <input class="active" type="checkbox" value="${p}" checked> ${p}</input>
                </li>
            `);
        });
        playersNode.innerHTML = markup.join('');
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

    renderPlayers();
    renderLineup();
    attachListeners();
})();
