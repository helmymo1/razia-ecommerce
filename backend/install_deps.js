const { exec } = require('child_process');
const path = require('path');

console.log('Starting npm install wrapper...');

const child = exec('npm install', {
    cwd: path.join(__dirname),
    windowsHide: true
}, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) console.error(`stderr: ${stderr}`);
});

child.stdout.on('data', (data) => console.log(data.toString()));
child.stderr.on('data', (data) => console.error(data.toString()));

child.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
});
