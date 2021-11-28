window.onload = async function () {
    await statistics();
    await commands();
}

async function statistics() {
    const res = await fetch('https://api.eartensifier.net/statistics', {
        method: 'GET',
    });

    if (res.ok) {
        let json = await res.json();
        document.getElementById('servers-stat').innerHTML = json.guilds;
        document.getElementById('users-stat').innerHTML = json.users;
        document.getElementById('players-stat').innerHTML = json.players;
        // document.getElementById('commands-stat').innerHTML = json.commandsUsed;
        // document.getElementById('songs-stat').innerHTML = json.songsPlayed;
    }
}

async function commands() {
    const res = await fetch('https://api.eartensifier.net/commands', {
        method: 'GET',
    });

    if (res.ok) {
        let json = await res.json();

        let map = new Map();
        json.forEach(element => {
            if (!map.has(element.category)) {
                map.set(element.category, []);
            }
            map.get(element.category).push(element);
        });

        // make music category first in map
        let music = map.get('music');
        map.delete('music');
        map.set('music', music);

        let ul = document.getElementById('pills-tab');
        let hasChosenFirst = false;
        map.forEach((value, key) => {
            if (key != 'dev') {
                let li = document.createElement('li');
                li.className = 'nav-item';
                li.setAttribute('role', 'presentation');

                let button = document.createElement('button');
                button.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);
                button.classList.add('nav-link');
                button.id = `pills-${key}-tab`;
                button.setAttribute('data-bs-toggle', 'pill');
                button.setAttribute('data-bs-target', `#pills-${key}`);
                button.type = 'button';
                button.setAttribute('role', 'tab');
                button.setAttribute('aria-controls', `pills-${key}`);
                button.setAttribute('aria-selected', 'false');

                if (!hasChosenFirst) {
                    button.classList.add('active');
                    button.setAttribute('aria-selected', 'true');
                    hasChosenFirst = true;
                }

                li.appendChild(button);
                ul.appendChild(li);
            }
        }, ul);


        let main = document.getElementById('pills-tabContent');
        let hasChosenFirst2 = false;
        map.forEach((value, key) => {
            if (key != 'dev') {
                let div = document.createElement('div');
                div.id = `pills-${key}`;
                div.className = 'tab-pane fade';
                if (!hasChosenFirst2) {
                    div.classList.add('active');
                    div.classList.add('show');
                    hasChosenFirst2 = true;
                }
                div.setAttribute('role', 'tabpanel');
                div.setAttribute('aria-labelledby', `pills-${key}-tab`);

                let accordion = document.createElement('div');
                accordion.className = 'accordion';
                accordion.id = `accordionPanelsStayOpen`;

                for (let i = 0; i < value.length; i++) {
                    let accordionItem = document.createElement('div');
                    accordionItem.className = 'accordion-item';

                    let h2 = document.createElement('h2');
                    h2.className = 'accordion-header';
                    h2.id = 'panelsStayOpen-heading' + i;

                    let button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'accordion-button collapsed';
                    button.setAttribute('data-bs-toggle', 'collapse');
                    button.setAttribute('data-bs-target', `#panelsStayOpen-collapse${i}`);
                    button.setAttribute('aria-controls', `panelsStayOpen-collapse${i}`);
                    button.setAttribute('aria-expanded', 'false');
                    button.innerHTML = value[i].name;
                    h2.appendChild(button);

                    let div2 = document.createElement('div');
                    div2.id = 'panelsStayOpen-collapse' + i;
                    div2.className = 'accordion-body collapse';
                    div2.setAttribute('aria-labelledby', `panelsStayOpen-heading${i}`);
                    let div3 = document.createElement('div');
                    div3.className = 'accordion-body';
                    div3.innerHTML = value[i].description.content;
                    div2.appendChild(div3);

                    accordionItem.appendChild(h2);
                    accordionItem.appendChild(div2);
                    accordion.appendChild(accordionItem);
                }
                div.appendChild(accordion);
                main.appendChild(div);
            }
        }, main);
    }
}