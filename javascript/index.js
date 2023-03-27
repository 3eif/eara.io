window.onload = async function () {
    await statistics();
    await commands();
}

async function statistics() {
    const res = await fetch('https://api.eartensifier.net/statistics', {
        method: 'GET',
    });

    let json = await res.json();
    console.log(json);

    let serversStat = document.getElementById('servers-stat');
    let usersStat = document.getElementById('users-stat');
    let playersStat = document.getElementById('players-stat');
    let commandsStat = document.getElementById('commands-stat');
    let songsStat = document.getElementById('songs-stat');

    if (res.ok) {
        serversStat.setAttribute('data-target', json.guilds < 1000 ? 50000 : json.guilds);
        usersStat.setAttribute('data-target', json.users);
        commandsStat.setAttribute('data-target', json.commandsUsed);
        songsStat.setAttribute('data-target', json.songsPlayed);
    } else {
        serversStat.setAttribute('data-target', 179971 < 1000 ? 50000 : 179971);
        usersStat.setAttribute('data-target', 12025943);
        commandsStat.setAttribute('data-target', 31902857);
        songsStat.setAttribute('data-target', 42838930);
    }

    const counters = document.querySelectorAll('.stat');

    counters.forEach(counter => {
        const updateCount = () => {
            const speed = 150;
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const incrementRate = target / speed;

            if (count < target) {
                counter.innerText = Math.round(count + incrementRate);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        }
        updateCount();
    });
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

        let ul = document.getElementById('pills-tab');
        let hasChosenFirst = false;
        map.forEach((value, key) => {
            if (key != 'dev') {
                let li = document.createElement('li');
                li.className = 'nav-item';
                li.setAttribute('role', 'presentation');

                let button = document.createElement('button');
                button.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);
                button.classList.add('nav-link', 'pill-link');
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
            if (key == 'bot' || key == 'filters' || key == 'settings') {
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
                    let card = document.createElement('div');
                    card.className = 'accordion-padding';

                    let accordionItem = document.createElement('div');
                    accordionItem.className = 'accordion-item';

                    let h2 = document.createElement('h2');
                    h2.className = 'accordion-header';
                    h2.id = 'panelsStayOpen-heading' + value[i].name;;

                    let button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'accordion-button collapsed';
                    button.setAttribute('data-bs-toggle', 'collapse');
                    button.setAttribute('data-bs-target', `#panelsStayOpen-collapse${value[i].name}`);
                    button.setAttribute('aria-controls', `panelsStayOpen-collapse${value[i].name}`);
                    button.setAttribute('aria-expanded', 'false');

                    let buttonRow = document.createElement('div');
                    buttonRow.className = 'row';

                    let commandName = document.createElement('div');
                    commandName.innerHTML = "<strong class=\"command-name-strong\">" + value[i].name + "</strong> " + (value[i].description.usage == 'No usage provided' ? '' : value[i].description.usage.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                    commandName.className = 'accordion-command-name';

                    let commandDescription = document.createElement('div');
                    commandDescription.innerHTML = value[i].description.content;
                    commandDescription.className = 'accordion-command-description';

                    let div2 = document.createElement('div');
                    div2.id = 'panelsStayOpen-collapse' + value[i].name;
                    div2.className = 'accordion-body collapse';
                    div2.setAttribute('aria-labelledby', `panelsStayOpen-heading${value[i].name}`);
                    let div3 = document.createElement('div');
                    div3.className = 'accordion-body';

                    let bodyRow = document.createElement('div');
                    bodyRow.className = 'row';

                    let aliases = document.createElement('div');
                    aliases.innerHTML = "<strong class=\"aliases-strong\">" + "Aliases:" + '</strong> ' + ((value[i].aliases instanceof Array) ? value[i].aliases.join(", ") : value[i].aliases);
                    aliases.className = 'accordion-aliases-content';

                    const e = [];
                    if (e instanceof Array) {
                        for (let j = 0; j < value[i].description.examples.length; j++) {
                            e.push(`ear ${value[i].name} ${value[i].description.examples[j]}`);
                        }
                    }
                    let examples = document.createElement('div');
                    examples.innerHTML = "<strong class=\"examples-strong\">" + "Examples:" + '</strong> ' + ((value[i].description.examples instanceof Array) ? e.join(", ") : `ear ${value[i].name}`);
                    examples.className = 'accordion-examples-content';

                    // go through value[i].permissions.botPermissions and make the underscore a space and capitalize the first letter of each word, then add send and read messages as permissions
                    const bP = [];
                    if (value[i].permissions.botPermissions instanceof Array) {
                        for (let j = 0; j < value[i].permissions.botPermissions.length; j++) {
                            bP.push(value[i].permissions.botPermissions[j].replace(/\w\S*/g, function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            }));
                        }
                        bP.push('Send Messages', 'Read Messages');
                    }

                    const uP = [];
                    if (value[i].permissions.userPermissions instanceof Array) {
                        for (let j = 0; j < value[i].permissions.userPermissions.length; j++) {
                            uP.push(value[i].permissions.userPermissions[j].replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            }));
                        }
                    }

                    let botPermissions = document.createElement('div');
                    botPermissions.innerHTML = "<strong class=\"examples-strong\">" + "Bot Permissions:" + '</strong> ' + ((value[i].permissions.botPermissions instanceof Array && bP.length != 0) ? bP.join(", ") : 'N/A');
                    botPermissions.className = 'accordion-examples-content';

                    let userPermissions = document.createElement('div');
                    userPermissions.innerHTML = "<strong class=\"examples-strong\">" + "User Permissions:" + '</strong> ' + ((value[i].permissions.userPermissions instanceof Array && uP.length != 0) ? uP.join(", ") : 'N/A');
                    userPermissions.className = 'accordion-examples-content';

                    bodyRow.append(aliases, examples, botPermissions, userPermissions);
                    div3.appendChild(bodyRow);
                    buttonRow.appendChild(commandName);
                    buttonRow.appendChild(commandDescription);
                    button.appendChild(buttonRow);
                    h2.appendChild(button);
                    div2.appendChild(div3);
                    accordionItem.appendChild(h2);
                    accordionItem.appendChild(div2);
                    card.appendChild(accordionItem);
                    accordion.appendChild(card);
                }
                div.appendChild(accordion);
                main.appendChild(div);
            }
        }, main);

        let loading = document.getElementById('commands-loading');
        loading.parentNode.removeChild(loading);
    }
}