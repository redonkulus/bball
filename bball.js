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
    }

    function renderPlayers() {
        const markup = [];
        defaultPlayers.forEach(p => {
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
