(function() {
    // dom element references
    const addPlayerNode = document.getElementById('add-player');
    const lineupNode = document.getElementById('lineup');
    const playersNode = document.getElementById('players');
    const quartersNode = document.getElementById('quarters');
    const shareNode = document.getElementById('share');

    let data = loadData(); // data for all input
    let dragSrcEl = null; // used to store dragged item
    let dragCurIndex = 0; // used to track currently dragged item index in player list
    let pageY = 0; // used to determine drag direction

    /**
     * Returns data from URL query params, local storage or default data
     * @returns {Object} data
     */
    function loadData() {
        // check for shared data
        const params = new URLSearchParams(document.location.search);
        const data = params.get('data');
        if (data) {
            document.location.search = ''; // reset location bar
            return JSON.parse(data);
        }

        const lsData = localStorage.getItem('data');
        return lsData ? JSON.parse(lsData) : { playerList: [], quarters: 4 };
    }

    /**
     * Save data to localstorage
     */
     function saveData() {
        localStorage.setItem('data', JSON.stringify(data));
    }

    /**
     * Randomize order of players
     */
    function shufflePlayers() {
        let currentIndex = data.playerList.length;
        let temporaryValue;
        let randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = data.playerList[currentIndex];
            data.playerList[currentIndex] = data.playerList[randomIndex];
            data.playerList[randomIndex] = temporaryValue;
        }

        renderPlayers();
    }

    /**
     * Adds a player to playerlist and saves to localstorage
     */
    function addPlayer() {
        const formData = new FormData(addPlayerNode);
        const name = formData.get('add-player-input');

        if (name && name !== '') {
            data.playerList.push({ name, active: true });
            renderPlayers();
        }

        // highlight name to easily add more players
        const inputNode = document.getElementById('add-player-input');
        inputNode.select();
    }

    /**
     * Removes a player from the player list
     * @param {String} id Name of player 
     */
    function removePlayer(id) {
        for (let x = 0; x < data.playerList.length; x++) {
            if (data.playerList[x].name === id) {
                data.playerList.splice(x, 1);
                renderPlayers();
                break;
            }
        }
    }

    /**
     * Sets the quarter length and stores in local storage
     */
    function setQuarters() {
        const quarters = parseInt(quartersNode.value, 10);
        data.quarters = quarters;
        refreshApp();
    }

    /**
     * Player Drag and Drop handlers
     */
    function handleDragStart(e) {
        e.target.style.opacity = '0.4';

        // store reference to dragged element
        dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        pageY = e.pageY;
        dragCurIndex = parseInt(e.target.dataset.idx, 10);
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
        e.target.classList.add('over');
    }

    function handleDragLeave(e) {
        // this / e.target is previous target element.
        e.target.classList.remove('over');
    }

    function handleDrop(e) {
        // this / e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // Don't do anything if dropping the same player we're dragging.
        if (dragSrcEl != e.target) {
            if (e.pageY > pageY) {
                // player was moved down
                e.target.parentNode.insertBefore(dragSrcEl, e.target.nextElementSibling);
            } else {
                // player was moved up
                e.target.parentNode.insertBefore(dragSrcEl, e.target);
            }
            // update player list with new order 
            const targetIndex = parseInt(e.target.dataset.idx, 10);
            data.playerList.splice(targetIndex, 0, data.playerList.splice(dragCurIndex, 1)[0]);
            renderPlayers();
        }

        return false;
    }

    function handleDragEnd(e) {
        e.target.style.opacity = '1.0';
        const draggableItems = Array.from(document.getElementsByClassName('draggable'));
        draggableItems.forEach(item => item.classList.remove('over'));
    }

    /**
     * Manages rendering and data updating
     */
    function refreshApp() {
        renderLineup();
        saveData();
    }

    /**
     * Renders player list based playerList data
     */
    function renderPlayers() {
        const markup = [];
        data.playerList.forEach((p, idx) => {
            const checked = p.active === true ? 'checked' : '';
            markup.push(`
                <li id="${p.name}" data-idx=${idx} class="list-group-item d-flex justify-content-between draggable" draggable="true">
                    <label class="mb-0 align-middle">
                        <input class="active" type="checkbox" value="${p.name}" ${checked}> ${p.name}</input>
                    </label>
                    <button class="remove btn btn-sm">
                        <svg viewBox="0 0 96 96" width="24" height="24" style="enable-background:new 0 0 96 96;">
                            <path d="M40.5,66.8V39.3c0-0.4-0.1-0.7-0.4-0.9S39.6,38,39.3,38h-2.5c-0.4,0-0.7,0.1-0.9,0.4 s-0.4,0.5-0.4,0.9v27.5c0,0.4,0.1,0.7,0.4,0.9s0.5,0.4,0.9,0.4h2.5c0.4,0,0.7-0.1,0.9-0.4S40.5,67.1,40.5,66.8z M50.5,66.8V39.3 c0-0.4-0.1-0.7-0.4-0.9S49.6,38,49.3,38h-2.5c-0.4,0-0.7,0.1-0.9,0.4s-0.4,0.5-0.4,0.9v27.5c0,0.4,0.1,0.7,0.4,0.9s0.5,0.4,0.9,0.4 h2.5c0.4,0,0.7-0.1,0.9-0.4S50.5,67.1,50.5,66.8z M60.5,66.8V39.3c0-0.4-0.1-0.7-0.4-0.9S59.6,38,59.3,38h-2.5 c-0.4,0-0.7,0.1-0.9,0.4s-0.4,0.5-0.4,0.9v27.5c0,0.4,0.1,0.7,0.4,0.9s0.5,0.4,0.9,0.4h2.5c0.4,0,0.7-0.1,0.9-0.4 S60.5,67.1,60.5,66.8z M39.3,28h17.5l-1.9-4.6c-0.2-0.2-0.4-0.4-0.7-0.4H41.8c-0.3,0.1-0.5,0.2-0.7,0.4L39.3,28z M75.5,29.3v2.5 c0,0.4-0.1,0.7-0.4,0.9S74.6,33,74.3,33h-3.8v37c0,2.2-0.6,4-1.8,5.6S66,78,64.3,78H31.8c-1.7,0-3.2-0.8-4.4-2.3s-1.8-3.4-1.8-5.5 V33h-3.8c-0.4,0-0.7-0.1-0.9-0.4s-0.4-0.5-0.4-0.9v-2.5c0-0.4,0.1-0.7,0.4-0.9s0.5-0.4,0.9-0.4h12.1l2.7-6.5c0.4-1,1.1-1.8,2.1-2.5 s2-1,3.1-1h12.5c1,0,2.1,0.3,3.1,1s1.7,1.5,2.1,2.5l2.7,6.5h12.1c0.4,0,0.7,0.1,0.9,0.4S75.5,28.9,75.5,29.3z"/>
                        </svg>
                    </button>
                </li>
            `);
        });
        playersNode.innerHTML = markup.join('');
        refreshApp();
    }

    /**
     * Renders the lineup based on active players
     */
    function renderLineup() {
        const listMarkup = [];
        if (!data.playerList.length) {
            listMarkup.push('Please add players to generate a lineup.');
        } else {
            const perQuarter = 5;
            const periods = data.quarters;
            const total = perQuarter * periods;
    
            let x = 1;
            let start = 0;
            let period = 1;

            let currentPlayers = [];
            const activePlayers = data.playerList.filter(p => p.active === true);

            // select proper quarter node
            Array.from(document.querySelectorAll('#quarters option')).forEach((option, idx) => {
                if (parseInt(option.value, 10) === data.quarters) {
                    quartersNode.selectedIndex = idx;
                }
            });

            // loop through each player to add to lineup
            while (x <= total) {
                if (activePlayers.length) {
                    const { name } = activePlayers[start];

                    // add player if not already added
                    if (!currentPlayers.includes(name)) {
                        currentPlayers.push(name);
                    }
        
                    // determine players whenever perQuarter limit is met
                    if (x > 0 && x % perQuarter === 0) {
                        // print players
                        listMarkup.push(`<li class="list-group-item">${period}. ${currentPlayers.join(', ')}</li>`);
        
                        // increment to display next period
                        period++;
        
                        // reset current players
                        currentPlayers = [];
                    }
                }
    
                start++;
    
                if (start > (activePlayers.length - 1)) {
                    start = 0;
                }
    
                x++;
            }
        }

        // output markup
        if (listMarkup.length) {
            lineupNode.innerHTML = listMarkup.join('');
        } else {
            lineupNode.innerHTML = 'No active players to lineup.';
        }
    }

    /**
     * Generate URL to share lineup
     */
     function shareLineup() {
        // set active state
        shareNode.classList.toggle('active');

        // collect data to copy
        const params = new URLSearchParams({
            data: JSON.stringify(data)
        })

        // create fake input element
        const input = document.createElement('input');
        document.body.appendChild(input);

        // set value and copy it
        const url = new URL(document.location.href);
        url.search = params;
        input.value = url.toString();
        input.select();
        document.execCommand('copy');

        // remove element
        document.body.removeChild(input);

        // remove active class
        setTimeout(() => {
            shareNode.classList.toggle('active');
        }, 3000);
    }

    /**
     * DOM event handlers
     */
    function attachListeners() {
        playersNode.addEventListener('click', e => {
            const { id } = e.target.closest('li');

            // handle remove player
            if (e.target.closest('button')) {
                removePlayer(id);
            } else {
                for (let x = 0; x < data.playerList.length; x++) {
                    if (data.playerList[x].name === id) {
                        data.playerList[x].active = !data.playerList[x].active;
                        renderPlayers();
                        break;
                    }
                };
            }
        });

        // drag and drop listeners
        playersNode.addEventListener('dragstart', handleDragStart, false);
        playersNode.addEventListener('dragenter', handleDragEnter, false);
        playersNode.addEventListener('dragover', handleDragOver, false);
        playersNode.addEventListener('dragleave', handleDragLeave, false);
        playersNode.addEventListener('drop', handleDrop, false);
        playersNode.addEventListener('dragend', handleDragEnd, false);

        // handle all form events
        addPlayerNode.addEventListener('click', e => {
            e.preventDefault();
            const { target } = e;

            // share button
            if (target.closest('#share')) {
                return shareLineup();
            }

            // shuffle players
            if (target.closest('#shuffle')) {
                return shufflePlayers();
            }

            // add player
            if (target.closest('#add-player-submit')) {
                return addPlayer();
            }

            // select add player text
            if (target.closest('#add-player-input')) {
                return target.select();
            }
        });

        // quarters length handler
        quartersNode.addEventListener('change', setQuarters);
    }

    // init
    renderPlayers();
    attachListeners();
})();
