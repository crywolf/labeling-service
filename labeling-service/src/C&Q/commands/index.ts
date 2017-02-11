import * as fs from 'fs';

const commands = {};

fs.readdirSync(__dirname + '/').forEach((fileName) => {
    if (fileName !== 'index.ts') {
        const commandName = fileName.replace('.ts', '');
        const command = require(`./${fileName}`).default;
        if (Object.getPrototypeOf(command).name === 'Command') {
            commands[commandName] = command;
        }
    }
});

export = commands;
