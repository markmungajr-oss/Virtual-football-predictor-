const express = require('express');
const app = express();
app.use(express.json());

let schedule = []; 

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="sw">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MUNGAJR THUG PREDICTOR</title>
        <style>
            :root { --neon: #00ff00; --shadow: #004400; }
            body { background: #000; color: var(--neon); font-family: 'Courier New', monospace; text-align: center; margin: 0; overflow-x: hidden; }
            .header { padding: 20px; border-bottom: 3px solid var(--neon); background: #050505; text-shadow: 0 0 10px var(--neon); }
            
            .cartoon-container { margin: 20px auto; position: relative; width: 150px; height: 150px; }
            .thug-img { 
                width: 100%; border-radius: 50%; border: 4px solid var(--neon); 
                animation: float 3s ease-in-out infinite, glow 1.5s alternate infinite;
            }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
            @keyframes glow { from { box-shadow: 0 0 10px var(--neon); } to { box-shadow: 0 0 30px var(--neon); } }

            .match-card { 
                background: #0a0a0a; border: 2px solid var(--neon); border-radius: 20px; 
                margin: 20px auto; max-width: 450px; padding: 25px; box-shadow: 0 0 20px var(--shadow);
            }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
            .box { background: #000; border: 1px solid #333; padding: 15px; border-radius: 10px; }
            .val { font-size: 24px; font-weight: bold; color: #fff; display: block; margin-top: 5px; }
            .label { font-size: 11px; color: var(--neon); text-transform: uppercase; letter-spacing: 2px; }
            .time { color: yellow; font-weight: bold; margin-bottom: 10px; display: block; }
            .status-bar { font-size: 12px; margin-top: 20px; color: #555; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 style="margin:0;">MUNGAJR HACKER V2</h1>
            <small>BETPAWA VIRTUAL EXPLOIT ACTIVE</small>
        </div>

        <div class="cartoon-container">
            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=thug-life-munga&mood=happy" class="thug-img">
        </div>

        <div class="match-card">
            <span class="time" id="m-time">START: --:--</span>
            <h2 id="m-teams" style="font-size: 28px;">WAITING DATA...</h2>
            
            <div class="grid">
                <div class="box">
                    <span class="label">Ushindi</span>
                    <span class="val" id="v-win">-</span>
                    <span id="v-pct" style="color:yellow; font-size:12px;">0%</span>
                </div>
                <div class="box">
                    <span class="label">Correct Score</span>
                    <span class="val" id="v-score">- - -</span>
                </div>
                <div class="box">
                    <span class="label">GG / NG</span>
                    <span class="val" id="v-gg">-</span>
                </div>
                <div class="box">
                    <span class="label">Over 2.5</span>
                    <span class="val" id="v-ov">-</span>
                </div>
            </div>
        </div>

        <div class="status-bar" id="m-count">Mechi zilizobaki kwenye mfumo: 0</div>

        <script>
            async function fetchUpdate() {
                try {
                    let r = await fetch('/api/get-signals');
                    let d = await r.json();
                    if(d.home && d.home !== "WAITING...") {
                        document.getElementById('m-teams').innerText = d.home + " vs " + d.away;
                        document.getElementById('m-time').innerText = "START: " + d.time;
                        document.getElementById('v-win').innerText = d.prediction.win;
                        document.getElementById('v-pct').innerText = d.prediction.pct;
                        document.getElementById('v-score').innerText = d.prediction.score;
                        document.getElementById('v-gg').innerText = d.prediction.gg;
                        document.getElementById('v-ov').innerText = d.prediction.over;
                        document.getElementById('m-count').innerText = "Mechi zilizobaki kwenye mfumo: " + d.remaining;
                    }
                } catch(e) {}
            }
            setInterval(fetchUpdate, 3000);
            fetchUpdate();
        </script>
    </body>
    </html>
    `);
});

app.post('/api/sync-bulk', (req, res) => {
    const { matches } = req.body;
    schedule = matches.map(m => ({
        home: m.home,
        away: m.away,
        time: m.time,
        prediction: {
            win: Math.random() > 0.5 ? "HOME" : "AWAY",
            pct: Math.floor(Math.random() * 15 + 80) + "%",
            gg: Math.random() > 0.4 ? "YES" : "NO",
            over: "YES",
            score: Math.floor(Math.random() * 3) + " - " + Math.floor(Math.random() * 2)
        }
    }));
    res.json({ status: "success", count: schedule.length });
});

app.get('/api/get-signals', (req, res) => {
    if (schedule.length > 0) {
        res.json({ ...schedule[0], remaining: schedule.length });
    } else {
        res.json({ home: "WAITING...", remaining: 0 });
    }
});

setInterval(() => { if(schedule.length > 0) schedule.shift(); }, 240000);

app.listen(process.env.PORT || 3000);
