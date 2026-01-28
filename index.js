const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SESSION = "RGNK~gIc4aXID"; // നിങ്ങളുടെ സെഷൻ ഐഡി

function run(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error('Error running command: ' + command);
    // എറർ വന്നാലും നിർത്താതെ മുന്നോട്ട് പോകാൻ ചിലപ്പോൾ ഇത് സഹായിക്കും
  }
}

// FFmpeg ഡൗൺലോഡ് ചെയ്യുന്ന ഭാഗം ഒഴിവാക്കി, പകരം സിസ്റ്റത്തിൽ ഉണ്ടോ എന്ന് മാത്രം നോക്കുന്നു
console.log("⚡ Checking for FFmpeg...");
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log("✅ FFmpeg is already installed in the system.");
} catch (e) {
  console.log("⚠️ FFmpeg not found, but continuing...");
}

if (!fs.existsSync('./raganork-md')) {
  console.log("📥 Cloning raganork-md...");
  run('git clone https://github.com/souravkl11/raganork-md');
}

try {
  process.chdir('./raganork-md');
} catch (e) {
  process.exit(1);
}

// Yarn ഇൻസ്റ്റാളേഷൻ
try {
  execSync('yarn --version', { stdio: 'ignore' });
} catch (e) {
  console.log("📦 Installing yarn...");
  run('npm install --legacy-peer-deps');
}

console.log("📦 Installing dependencies...");
run('yarn install --ignore-engines');

if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

console.log("🔐 Writing configuration...");
// ഇവിടെ DATABASE_URL കൂടി ചേർക്കാം
const configData = `SESSION=${SESSION}
USE_SERVER=false
TEMP_DIR=./temp
`;
fs.writeFileSync('config.env', configData);

console.log("🚀 Starting bot...");
run('yarn start');
