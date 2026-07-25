#!/usr/bin/env node

const term = require('terminal-kit').terminal;
const moment = require('moment');
const { exec } = require('child_process');
const axios = require("axios");
const fs = require('fs');

let isProcessing = false;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// mnu
const showLogo = () => {
  term.clear();
  console.clear();
  term.bold.cyan(`
╔══════════════════════════════════════════╗
║                                          ║
║   ██████╗ ███████╗██╗███╗   ██╗████████╗ ║
║  ██╔═══██╗██╔════╝██║████╗  ██║╚══██╔══╝ ║
║  ██║   ██║███████╗██║██╔██╗ ██║   ██║    ║
║  ██║   ██║╚════██║██║██║╚██╗██║   ██║    ║
║  ╚██████╔╝███████║██║██║ ╚████║   ██║    ║
║   ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝    ║
║                                          ║
╠══════════════════════════════════════════╣
║                                          ║
║       「1」 Osint Nomor                  ║
║       「2」 Osint Name                   ║
║       「3」 IP Tracking                  ║
║                                          ║
╠══════════════════════════════════════════╣
║                                          ║
║         Gunakan Angka lalu ENTER         ║
║                                          ║
╚═╦══════════════════════════════════════╦═╝
  `);
};
const showMenu = () => {
term.bold.cyan(
'╠══════════════════════════════════════╣ ');
 term.bold.cyan('\n  ║[1] ') + term.bold.cyan('Osint Number                      ║');          
  term.bold.cyan('\n  ║[2] ') + term.bold.cyan('Osint Name                        ║');
  term.bold.cyan('\n  ║[3] ') + term.bold.cyan('IP Tracking                       ║');
  term.bold.cyan('\n  ║[Exit] ') + term.bold.cyan('Exit Tools                     ║');
  term.bold.cyan('\n  ╚══════════════════════════════════════╝');
  term.bold.red("\n          ＩＮＰＵＴ ＭＥＮＵ: ");
};

// getinput
const getInput = () => {
  return new Promise((resolve) => {
    if (isProcessing) {
      resolve('');
      return;
    }
    isProcessing = true;
    term.cyan.bold();
    term.inputField({}, (err, value) => {
      isProcessing = false;
      resolve((value || '').trim());
    });
  });
};

const getNumberInput = () => {
  return new Promise((resolve) => {
    term.bold.yellow('\n\n  Masukan Number Example 62 :  ');
    term.inputField({}, (err, value) => {
      resolve((value || '').trim());
    });
  });
};

const handleOsintNumber = async () => {
  const number = await getNumberInput();
  if (!number) {
    term.red('\n  ❌ Number cannot be empty!\n');
    return;
  }

  term.bold.gray('\n  🔄 Checking number...\n');

  return new Promise((resolve) => {
    const pythonScript = './main.py';
    
    
    if (!fs.existsSync(pythonScript)) {
      term.red('\n  ❌ main.py not found!\n');
      resolve();
      return;
    }

    const child = exec(`python3 ${pythonScript} ${number}`, (error, stdout, stderr) => {
      if (error) {
        term.red(`\n  ❌ Error: ${error.message}\n`);
        resolve();
        return;
      }
      if (stderr) {
        term.yellow(`\n  ⚠️ ${stderr}\n`);
      }

      console.log(stdout);
      resolve();
    });
  });
};


async function exit() {
    term.clear();
    
    const width = process.stdout.columns || 80;
    const height = process.stdout.rows || 24;
    
    
    const durationSeconds = 5; // durasi
    const totalSteps = 100;
    const stepDelay = (durationSeconds * 1000) / totalSteps;
    

    const boxWidth = 48;
    const barLength = 30;
    

    const centerX = Math.floor((width - boxWidth) / 2);
    const centerY = Math.floor(height / 2) - 3;
    
    // Animasi spinner
    const spinnerFrames = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
    let frameIndex = 0;
    const startTime = Date.now();
    
    
    function drawBox(progress, bar, spinner, remaining) {
        // Hapus semua di area box
        for (let row = 0; row < 7; row++) {
            process.stdout.write(`\x1B[${centerY + row};${centerX}H`);
            process.stdout.write(' '.repeat(boxWidth));
        }
        

        process.stdout.write(`\x1B[${centerY};${centerX}H`);
        term.bold.white(`┌${'─'.repeat(boxWidth - 2)}┐`);
        

        const title = ' EXITING TOOLS ';
        const titlePadding = Math.floor((boxWidth - 2 - title.length) / 2);
        process.stdout.write(`\x1B[${centerY + 1};${centerX}H`);
        term.bold.white(`│`);
        term.bold.white(' '.repeat(titlePadding));
        term.bold.magenta(title);
        term.bold.white(' '.repeat(boxWidth - 2 - title.length - titlePadding));
        term.bold.white(`│`);
        
        const progressText = `${bar} ${progress}%`;
        const progressPadding = boxWidth - 2 - progressText.length;
        process.stdout.write(`\x1B[${centerY + 2};${centerX}H`);
        term.bold.white(`│`);
        if (progress < 40) {
            term.red(progressText);
        } else if (progress < 80) {
            term.yellow(progressText);
        } else {
            term.green(progressText);
        }
        term.bold.white(' '.repeat(progressPadding));
        term.bold.white(`│`);
        

        const statusText = `${spinner} Exiting Osint...`;
        const statusPadding = boxWidth - 2 - statusText.length;
        process.stdout.write(`\x1B[${centerY + 3};${centerX}H`);
        term.bold.white(`│`);
        term.cyan(statusText);
        term.bold.white(' '.repeat(statusPadding));
        term.bold.white(`│`);
        

        const timeText = `⏱️ ${remaining.toFixed(1)}s remaining`;
        const timePadding = boxWidth - 2 - timeText.length;
        process.stdout.write(`\x1B[${centerY + 4};${centerX}H`);
        term.bold.white(`│`);
        term.yellow(timeText);
        term.bold.white(' '.repeat(timePadding));
        term.bold.white(` │`);
        

        process.stdout.write(`\x1B[${centerY + 5};${centerX}H`);
        term.bold.white(`└${'─'.repeat(boxWidth - 2)}┘`);
    }
    
    for (let i = 0; i <= totalSteps; i++) {
        const progress = Math.round((i / totalSteps) * 100);
        const filled = Math.round((i / totalSteps) * barLength);
        const empty = barLength - filled;
        

        let bar = '';
        for (let j = 0; j < filled; j++) bar += '█';
        for (let j = 0; j < empty; j++) bar += '░';
        

        const spinner = spinnerFrames[frameIndex % spinnerFrames.length];
        frameIndex++;
        

        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, durationSeconds - elapsed);
        

        drawBox(progress, bar, spinner, remaining);
        
      
        await delay(stepDelay);
    }
    
    
    await delay(300);
    await delay(500);
    term.clear();
    process.exit(0);
}

const main = async () => {
  while (true) {
    showLogo();
    showMenu();
    
    const choice = await getInput();
    
    switch (choice) {
      case '1':
        await handleOsintNumber();
        break;
      case 'exit':
      await exit();
       case '2': 
       await osintName();
       break;
       case '3':
       await ipTracking();
       break;
        
          term.red('\n  ❌ Invalid option! Please try again.\n');
        }
    
    
    term.bold.gray('\n  Press ENTER to continue...');
    await new Promise(resolve => term.inputField({}, resolve));
  }
};

// osint name

const checkPlatform = async (url) => {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(url, { 
            method: 'HEAD',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        clearTimeout(timeout);
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

// func osint nama
const osintName = async () => {
    term.clear();
    term.green.bold(`
    Masukan Username : `);

    const username = await getInput('➜ ');

    if (!username || username.trim() === '') {
        term.red('\n⚠️ Username tidak boleh kosong!\n');
        await getInput('Tekan Enter untuk kembali...');
        return;
    }
//daftar
    const platforms = [
        { name: 'Instagram', url: `https://www.instagram.com/${username}` },
        { name: 'Facebook', url: `https://www.facebook.com/${username}` },
        { name: 'Telegram', url: `https://t.me/${username}` },
        { name: 'Twitter/X', url: `https://twitter.com/${username}` },
        { name: 'YouTube', url: `https://youtube.com/@${username}` },
        { name: 'TikTok', url: `https://www.tiktok.com/@${username}` },
        { name: 'GitHub', url: `https://github.com/${username}` },
        { name: 'Reddit', url: `https://www.reddit.com/user/${username}` },
        { name: 'Pinterest', url: `https://www.pinterest.com/${username}` },
        { name: 'Snapchat', url: `https://www.snapchat.com/add/${username}` },
        { name: 'LinkedIn', url: `https://www.linkedin.com/in/${username}` },
        { name: 'WhatsApp', url: `https://wa.me/${username}` },
        { name: 'Discord', url: `https://discord.com/users/${username}` },
        { name: 'Spotify', url: `https://open.spotify.com/user/${username}` },
        { name: 'Twitch', url: `https://www.twitch.tv/${username}` },
        { name: 'Steam', url: `https://steamcommunity.com/id/${username}` },
        { name: 'VK', url: `https://vk.com/${username}` },
        { name: 'Tumblr', url: `https://${username}.tumblr.com` },
        { name: 'Flickr', url: `https://www.flickr.com/people/${username}` },
        { name: 'Patreon', url: `https://www.patreon.com/${username}` },
        { name: 'OnlyFans', url: `https://onlyfans.com/${username}` },
        { name: 'SoundCloud', url: `https://soundcloud.com/${username}` },
        { name: 'DeviantArt', url: `https://www.deviantart.com/${username}` },
        { name: 'Behance', url: `https://www.behance.net/${username}` },
        { name: 'Dribbble', url: `https://dribbble.com/${username}` },
        { name: 'Medium', url: `https://medium.com/@${username}` },
        { name: 'Quora', url: `https://www.quora.com/profile/${username}` },
        { name: 'Vimeo', url: `https://vimeo.com/${username}` },
        { name: 'Imgur', url: `https://imgur.com/user/${username}` },
        { name: 'Gravatar', url: `https://en.gravatar.com/${username}` },
        { name: 'Bitbucket', url: `https://bitbucket.org/${username}` },
        { name: 'GitLab', url: `https://gitlab.com/${username}` },
        { name: 'HackerRank', url: `https://www.hackerrank.com/${username}` },
        { name: 'CodePen', url: `https://codepen.io/${username}` },
        { name: 'Replit', url: `https://replit.com/@${username}` },
        { name: 'PyPi', url: `https://pypi.org/user/${username}` },
        { name: 'RubyGems', url: `https://rubygems.org/profiles/${username}` },
        { name: 'NPM', url: `https://www.npmjs.com/~${username}` },
        { name: 'HubSpot', url: `https://community.hubspot.com/t5/user/viewprofilepage/user-id/${username}` },
        { name: 'VKontakte', url: `https://vk.com/${username}` },
        { name: 'Odnoklassniki', url: `https://ok.ru/${username}` },
        { name: 'Weibo', url: `https://weibo.com/${username}` },
        { name: 'Tencent QQ', url: `https://user.qzone.qq.com/${username}` },
        { name: 'Baidu', url: `https://tieba.baidu.com/home/main/?un=${username}` },
        { name: 'Xiaohongshu', url: `https://www.xiaohongshu.com/user/profile/${username}` },
        { name: 'Douyin', url: `https://www.douyin.com/user/${username}` },
        { name: 'Kuaishou', url: `https://www.kuaishou.com/profile/${username}` },
        { name: 'Zhihu', url: `https://www.zhihu.com/people/${username}` },
        { name: 'Bilibili', url: `https://space.bilibili.com/${username}` },
        { name: 'Mastodon', url: `https://mastodon.social/@${username}` },
    ];

    let found = 0;
    let notFound = 0;
    let total = platforms.length;

    for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];

        const isFound = await checkPlatform(platform.url);

        if (isFound) {
            term.green(`\n  ✔ ${platform.name} Found \n`);
            term.gray(`   ☑ ${platform.url}\n\n`);
            found++;
        } else {
            term.red(`  ✖ ${platform.name} Not Found \n`);
            notFound++;
        }

        await new Promise(resolve => setTimeout(resolve, 150));
    }

    term.green.bold(`                                                             
  SUMMARY : ${username}                                                                                                 
  Found     : ${found} / ${total} platform            
  Not Found : ${notFound} / ${total} platform          
    
    `);
};



// akhir



// tracking ip
async function ipTracking() {

    console.clear();

    term.gray.bold(`╔════════════════════════════════════════════════════╗
║                                                    ║
║             ＩＰ ＴＲＡＣＫＩＮＧ                  ║
║                                                    ║
╚═════════════════════════╦══════════════════════════╝
                          ║
                ╔═════════╝
                ║INPUT IP ADRES
                ╚═════════$:`);

    let ip = await getInput();

    if (!ip || ip.toLowerCase() === "exit") return;

    ip = ip.trim();

    if (ip === "") {
        term.red("\nIP kosong!\n");
        await getInput();
        return;
    }

    try {

        term.yellow("\nProcessing...\n");

        const { data } = await axios.get(
            `http://ip-api.com/json/${ip}`,
            { timeout: 10000 }
        );

        if (data.status !== "success") {

            term.red("\nIP tidak valid / tidak ditemukan!\n");

            await getInput();
            return;
        }

        const result = {

            ip: data.query,
            country: data.country,
            country_code: data.countryCode,
            region: data.regionName,
            city: data.city,
            zip: data.zip,
            latitude: data.lat,
            longitude: data.lon,
            isp: data.isp,
            org: data.org,
            asn: data.as,
            timezone: data.timezone
        };

        console.clear();

        console.log(
            JSON.stringify(result, null, 2)
        );

    } catch (err) {

        term.red("\nERROR: " + err.message + "\n");
    }

    term.yellow("\nPress Enter To Continue...");
    await getInput();
}

// akhir

process.on('uncaughtException', (err) => {
  term.red('\n   An error occurred: ');
  term.red(err.message + '\n');
});

process.on('unhandledRejection', (err) => {
  term.red('\n   An error occurred: ');
  term.red(err.message + '\n');
});

// akhir
main();