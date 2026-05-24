let allMatches = [];
    let updateIntervalId;
    const toggle = document.getElementById('darkModeToggle');
    const updateTheme = (isDark) => {
        if (isDark) {
             document.body.classList.add('dark', 'bg-gray-900', 'text-gray-100');
             document.body.classList.remove('bg-gray-100', 'text-gray-900');
        } else {
             document.body.classList.remove('dark', 'bg-gray-900', 'text-gray-100');
             document.body.classList.add('bg-gray-100', 'text-gray-900');
        }
    };
    if (localStorage.getItem('darkMode') === 'true') {
        updateTheme(true);
        toggle.checked = true;
    } else {
        updateTheme(false);
    }
   
    toggle.addEventListener('change', () => {
        const isChecked = toggle.checked;
        updateTheme(isChecked);
        localStorage.setItem('darkMode', isChecked);
    });

    function formatMatchTime(isoString) {
        try {
            const date = new Date(isoString);
            if (isNaN(date)) return 'Time TBD';
            const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
            return new Intl.DateTimeFormat(undefined, timeOptions).format(date);
        } catch (e) {
            return 'Time TBD';
        }
    }

    function updateCountdownDisplay() {
        const now = Date.now();
        document.querySelectorAll('.match-status').forEach(el => {
            const start = new Date(el.dataset.time).getTime();
            const duration = (parseInt(el.dataset.duration) || 2) * 3600000;
            const end = start + duration;
            if (now >= end) {
                el.textContent = 'END';
                if (!el.classList.contains('match-status-over')) {
                     el.className = 'match-status match-status-over';
                }
            } else if (now >= start) {
                el.textContent = 'LIVE';
                if (!el.classList.contains('match-status-live')) {
                    el.className = 'match-status match-status-live';
                }
            } else {
                const diff = start - now;
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
               
                let countdownText = '';
                if (diff < 0) {
                     countdownText = 'Starting Soon';
                } else if (d > 0) {
                    countdownText = `${d}d ${h}h`;
                } else if (h > 0) {
                    countdownText = `${h}h ${m}m`;
                } else {
                    const s = Math.floor((diff % (1000 * 60)) / 1000);
                    countdownText = `${m}m ${s}s`;
                }
               
                el.textContent = countdownText;
                if (!el.classList.contains('match-status-countdown')) {
                    el.className = 'match-status match-status-countdown';
                }
            }
        });
    }

    function createCard(m) {
        const detailsUrl = m.details_url || '#';
        const league = m.displayLeague || m.competition || m.league || ''; 
        const team1Name = m.team1 || 'Home Team TBD';
        const team2Name = m.team2 || 'Away Team TBD';
        const placeholderImg = "https://placehold.co/48x48/ccc/333?text=L";
        const team1Logo = m.team1_logo || placeholderImg;
        const team2Logo = m.team2_logo || placeholderImg;
        const logoOnError = `this.onerror=null;this.src='${placeholderImg}';`;
        const localTime = formatMatchTime(m.start || m.match_time);
        const leagueBar = league ? `<div class="match-league-bar"><p>${league}</p></div>` : '';

        const a = document.createElement('a');
        a.href = detailsUrl;
        a.className = 'match-card';
        a.target = '_blank';
        a.dataset.time = m.start || m.match_time;
        a.dataset.duration = m.duration || 2;
        
        a.innerHTML = `
            <div class="match-card-content">
                <div class="match-row-teams">
                    <div class="match-team home">
                        <p class="match-team-name">${team1Name}</p>
                        <img src="${team1Logo}" alt="${team1Name}" onerror="${logoOnError}">
                    </div>
                    <div class="match-center">
                        <p class="match-local-time">${localTime}</p>
                        <p class="match-status" data-time="${m.start || m.match_time}" data-duration="${m.duration || 2}">Loading...</p>
                    </div>
                    <div class="match-team away">
                        <img src="${team2Logo}" alt="${team2Name}" onerror="${logoOnError}">
                        <p class="match-team-name">${team2Name}</p>
                    </div>
                </div>
                ${leagueBar}
            </div>
        `;
        return a;
    }

    function renderMatches() {
        const list = document.getElementById('cricket-list');
        list.innerHTML = '';
        allMatches.forEach((match, index) => {
            list.appendChild(createCard(match));
        });
    }
    
    function sortAndInitialRender(matchesArray) {
        const now = Date.now();
        let processedMatches = [];

        // --- START REPEAT LOGIC ---
        matchesArray.forEach(m => {
            const isTest = m.repeat === "5";
            const repeatDays = isTest ? 5 : 1;
            const baseStart = new Date(m.start || m.match_time).getTime();
            const durationHrs = parseInt(m.duration) || (isTest ? 8 : 6);

            for (let i = 0; i < repeatDays; i++) {
                const dStart = baseStart + (i * 86400000);
                const dEnd = dStart + (durationHrs * 3600000);

                // For Test matches, skip days that are already finished
                if (isTest && now > dEnd) continue;

                let matchObj = { ...m };
                matchObj.start = new Date(dStart).toISOString();
                matchObj.displayLeague = isTest ? (m.competition || m.league || "") + ` (Day ${i+1})` : (m.competition || m.league || "");
                
                if (now >= dStart && now < dEnd) matchObj.sortPriority = 1;
                else if (now < dStart) matchObj.sortPriority = 2;
                else matchObj.sortPriority = 3;

                matchObj.sortValue = dStart;
                processedMatches.push(matchObj);

                // Break after adding the first available day for Test matches to avoid listing all 5 days at once
                if (isTest) break; 
            }
        });
        // --- END REPEAT LOGIC ---

        allMatches = processedMatches;
        allMatches.sort((a, b) => {
            if (a.sortPriority !== b.sortPriority) return a.sortPriority - b.sortPriority;
            return a.sortValue - b.sortValue;
        });
    
        renderMatches();
    }

    async function loadMatches() {
        if (updateIntervalId) clearInterval(updateIntervalId);
        const apiUrl = 'https://yosintvapi.pages.dev/api/match-football.json';
        const list = document.getElementById('cricket-list');
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`API failed with status: ${res.status}.`);
            const data = await res.json();
            let matchesArray = data.matches || data;
            
            if (!matchesArray || matchesArray.length === 0) {
                list.innerHTML = '<p class="text-center text-xl font-semibold text-gray-500 py-10">No upcoming matches found.</p>';
                return;
            }
            sortAndInitialRender(matchesArray);
            updateCountdownDisplay();
            updateIntervalId = setInterval(updateCountdownDisplay, 1000);
        } catch (e) {
            list.innerHTML = '<p class="text-center text-xl font-semibold text-red-600 py-10">❌ Error Loading Matches!</p>';
        }
    }
    document.addEventListener('DOMContentLoaded', loadMatches);
</script>

<script>
(() => {
    const makeLeagueLogoUrl = (leagueId) =>
        `https://api.sofascore1.com/api/v1/unique-tournament/${leagueId}/image`;

    function getAllMatches() {
        try {
            return (typeof allMatches !== "undefined" && Array.isArray(allMatches)) ? allMatches : [];
        } catch (e) {
            return [];
        }
    }

    function findLeagueIdByName(leagueName) {
        const matches = getAllMatches();
        if (!leagueName || matches.length === 0) return null;
        const match = matches.find((m) => {
            const name = m.league_name || m.league || "";
            return name === leagueName && Number.isFinite(Number(m.league_id));
        });
        return match ? Number(match.league_id) : null;
    }

    function convertLeagueButtonsToLogos() {
        const row = document.getElementById("league-filter-row");
        if (!row) return;

        const buttons = row.querySelectorAll(".league-filter-btn");
        buttons.forEach((btn) => {
            const leagueName = (btn.dataset.league || btn.textContent || "").trim();
            if (!leagueName || leagueName.toLowerCase() === "all") return;
            if (btn.querySelector("img")) return;

            const leagueId = findLeagueIdByName(leagueName);
            if (!leagueId) return;

            btn.classList.add("logo-pill");
            btn.title = leagueName;
            btn.setAttribute("aria-label", leagueName);
            btn.innerHTML = `<img src="${makeLeagueLogoUrl(leagueId)}" alt="${leagueName} logo" loading="lazy">`;
        });
    }

    const scheduleConvert = () => requestAnimationFrame(convertLeagueButtonsToLogos);
    document.addEventListener("DOMContentLoaded", scheduleConvert);
    window.addEventListener("load", scheduleConvert);

    const watch = setInterval(() => {
        const row = document.getElementById("league-filter-row");
        if (!row) return;
        clearInterval(watch);
        const observer = new MutationObserver(scheduleConvert);
        observer.observe(row, { childList: true, subtree: true });
        scheduleConvert();
    }, 300);
})();
