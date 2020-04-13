const Discord = require('discord.js')
const client = new Discord.Client();

const token = 'Njk5MDk3MjQ2MjU1NTQ2Mzg5.XpPe3A.LBktvhrI3iQ3lFcwpcrzw2bQ980';




function rollDice(num, difficulty) {
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
            results.push(result);

            if (result === 1) {
                totalFails++;
            }

            if (result >= difficulty) {
                totalSuccesses++;
            }
            if (result > 9) {
                reroll++;
            }
        }
        s += `${results.join(',')})`;

        resultStrs.push(s);
        diceToRoll = reroll;
    }

    resultStrs.push(`Total successes: ${totalSuccesses}, total fails: ${totalFails}`);
    
    const total = totalSuccesses - totalFails;
    if (total < 0) {
        resultStrs.push(`BOTCHED!`);
    } else {
        resultStrs.push(`RESULT: ${total}`);
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
        case 'roll': {
            const inputs = parts[1].split('@');
            
            const numDice = parseInt(inputs[0]);
            let difficulty = 6;
            if (inputs.length > 1) {
                difficulty = parseInt(inputs[1]);
            }

            const result = rollDice(numDice, difficulty);
        
            msg.reply(result.text.join('\n'));
        }
        break;
        default:
            break;
    }
});

client.login(token);