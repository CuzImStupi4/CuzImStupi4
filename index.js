const express = require('express');
const app = express();
const axios = require('axios');

const THEME = 'graywhite';
const WAKATIME_USERNAME = 'CuzImStupi4';
const GITHUB_USERNAME = 'CuzImStupi4';

const TITLE = 'Hey!! I am Emma.';
const SUBTITLE = 'I am {age} years old';
const BIRTHDAY = '2008-12-08';
const DISCORD = 'sv_cuzimstupi4.lua';
const TWITTER = 'CuzImStupi4';

const externalSvgs = [`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=${THEME}&hide_border=true`,
    `https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=${THEME}&hide_border=true`,
    `https://github-readme-stats.vercel.app/api/wakatime?username=${WAKATIME_USERNAME}&theme=${THEME}&layout=compact&langs_count=12&hide_border=true`]

const birthday = new Date(BIRTHDAY);

const fs = require('fs');
let count = parseInt(fs.readFileSync('count.txt', 'utf8')) || 0;

const svg = fs.readFileSync('readme.svg', 'utf8');

app.get('/', async (req, res) => {
    count++;
    const age = Math.floor((10 * (new Date() - birthday) / 31556952000)) / 10;
    let replacedSvg = svg
        .replace('{count}', count)
        .replace('{title}', TITLE)
        .replace('{subtitle}', SUBTITLE.replace('{age}', age))
        .replace('{discord}', DISCORD)
        .replace('{twitter}', TWITTER);
    
    let stats = await getReadmeStats();
    replacedSvg = replacedSvg.replace('{stats}', stats.join('\n'));
    

    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    res.send(replacedSvg);
});

async function getReadmeStats() {
    let promises = externalSvgs.map(url => axios.get(url));
    let results = await Promise.all(promises);
    results = results.map((result, i) => {
        return "<g transform='translate(100, " + (i * 200 + 250) + ")'>" + result.data + "</g>";
    });

    return results;
}


app.listen(9008, () => {
    console.log('Server is running on port 9008');
});

process.on('SIGINT', () => {
    fs.writeFileSync('count.txt', count.toString());
    process.exit();
});