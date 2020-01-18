(function() {
    const players = [
        'Evan (F)',
        'Joel (G)',
        'Ian (C)',
        'Jacob (F)',
        'Sachitt (G)',
        'Patrick (C)',
        'Yuva (F)',
        'Jared (G)',
        'Ethan (F)',
        // 'Ben (G)'
    ];
    const perQuarter = 5;
    const periods = 8;
    const total = perQuarter * periods;

    let x = 1;
    let start = 0;
    let period = 1;
    let currentPlayers = [];

    const listMarkup = [];

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
    document.getElementById('roster').innerHTML = listMarkup.join('');
})();
