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

            if (result === 1) {
                totalFails++;
                results.push(`**1**`);
            } else if (result >= difficulty) {
                totalSuccesses++;
                if (result === 10) {
                    results.push(`**${result}**`);
                } else {
                    results.push(`**${result}**`);
                }
            } else {
                results.push(result);
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
        s += `${results.join(', ')})`;

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
    resultStrs.push(finalStr);

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
        case '!wodhelp': {
            let helpStrs = [];
            helpStrs.push('How to use WoDBot:');
            helpStrs.push('**!roll [numDice]@[difficulty]**: rolls that many dice at that difficulty (default 6)');
            helpStrs.push('**!rollspec [numDice]@[difficulty]**: same as !roll, but will add an extra success for each 10 (use if you have a speciality');
            helpStrs.push('**!rollnew [numDice]@[difficulty]**: uses the new WoD rules wherein 10s are rerolled')


            msg.reply(helpStrs.join('\n'));
        }
        break;

        case '!rollsecret': {
            const inputs = parts[1].split('@');
            
            const numDice = parseInt(inputs[0]);

            if (isNaN(numDice) === false) {
                let difficulty = 6;
                if (inputs.length > 1) {
                    difficulty = parseInt(inputs[1]);
                }
    
                const result = rollDice(numDice, difficulty, false, false);
            
                // msg.reply(result.text.join('\n'));

                msg.member.send(result.text.join('\n'));
            }
        }
        break;
        case '!rollnew': {
            const inputs = parts[1].split('@');
            
            const numDice = parseInt(inputs[0]);

            if (isNaN(numDice) === false) {
                let difficulty = 6;
                if (inputs.length > 1) {
                    difficulty = parseInt(inputs[1]);
                }
    
                const result = rollDice(numDice, difficulty, true, false);
            
                msg.reply(result.text.join('\n'));
            }
        }
        break;
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