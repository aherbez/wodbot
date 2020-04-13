const Discord = require('discord.js')
const client = new Discord.Client();

const token = 'Njk5MDk3MjQ2MjU1NTQ2Mzg5.XpPe3A.LBktvhrI3iQ3lFcwpcrzw2bQ980';




function rollDice(num, difficulty, reroll10s, havespec) {
    let resultStrs = [];
    resultStrs.push(`Rolling ${num} dice at difficulty of ${difficulty}`);

    let diceToRoll = num;
    
    let totalSuccesses = 0;
    let totalFails = 0;
    
    while (diceToRoll > 0) {
        let s = `Rolled ${diceToRoll} dice (`;
        let results = [];
        let reroll = 0;
        for (let i=0; i < diceToRoll; i++) {
            let result = Math.floor(Math.random() * 10) + 1;

            if (result === 1 || result === 10) {
                results.push(`**${result}**`)
            } else {
                results.push(result);
            }

            if (result === 1) {
                totalFails++;
            }

            if (result >= difficulty) {
                totalSuccesses++;
            }
            if (result > 9) {
                if (reroll10s) {
                    reroll++;
                } else {
                    // if using old rules, and have a speciality, add bonuses for 10s
                    if (havespec) {
                        totalSuccesses++;
                    }
                }
            }
        }
        s += `${results.join(',')})`;

        resultStrs.push(s);
        diceToRoll = reroll;
    }

    let finalStr = `Total successes: ${totalSuccesses}, total fails: ${totalFails}`;
    
    const total = totalSuccesses - totalFails;
    if (total < 0) {
        finalStr += ` **BOTCHED!**`;
    } else {
        finalStr += ` **TOTAL: ${total}**`;
    }

    return {
        total: total,
        text: resultStrs
    };
}

client.on('ready', () => {
    console.log(`Loggeg in as ${client.user.tag}`);
});

client.on('message', (msg) => {
    // console.log(msg);

    const parts = msg.content.split(' ');

    switch (parts[0]) {
        case '!rollspec': {
            const inputs = parts[1].split('@');
            
            const numDice = parseInt(inputs[0]);

            if (isNaN(numDice) === false) {
                let difficulty = 6;
                if (inputs.length > 1) {
                    difficulty = parseInt(inputs[1]);
                }
    
                const result = rollDice(numDice, difficulty, false, true);
            
                msg.reply(result.text.join('\n'));
            }
        }
        break;
        case '!roll': {
            const inputs = parts[1].split('@');
            
            const numDice = parseInt(inputs[0]);

            if (isNaN(numDice) === false) {
                let difficulty = 6;
                if (inputs.length > 1) {
                    difficulty = parseInt(inputs[1]);
                }
    
                const result = rollDice(numDice, difficulty, false, false);
            
                msg.reply(result.text.join('\n'));
            }
        }
        break;
        default:
            break;
    }
});

// client.login(token);
client.login(process.env.BOT_TOKEN);