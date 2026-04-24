const { spawn } = require('child_process');

const childProcesses = [];

function runProcess(command, args) {
  const childProcess = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });

  childProcesses.push(childProcess);

  childProcess.on('exit', (code) => {
    if (code !== 0) {
      shutdown(code || 1);
    }
  });
}

function shutdown(exitCode) {
  for (const childProcess of childProcesses) {
    if (!childProcess.killed) {
      childProcess.kill();
    }
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

runProcess('node', ['server/index.js']);
runProcess('npm.cmd', ['run', 'dev:client']);
