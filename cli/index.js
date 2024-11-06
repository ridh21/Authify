#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const runCommand = command => {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch {
        return false;
    }
};

const repoName = process.argv[2] || 'auth-app';
const gitCheckoutCommand = `git clone --depth 1 https://github.com/ridh21/Authify.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Creating a new Auth app in ${repoName}`);

const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

console.log('Congratulations! Follow these steps to start:');
console.log(`cd ${repoName}`);
console.log('npm start');
