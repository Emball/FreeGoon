const DEFAULTS = {
    spankbang_enabled: true,
    spankbang_hover_previews: true,
    tnaflix_enabled: true,
};

const ids = Object.keys(DEFAULTS);

chrome.storage.sync.get(DEFAULTS, settings => {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.checked = settings[id];
        el.addEventListener('change', () => {
            chrome.storage.sync.set({ [id]: el.checked });
            refresh();
        });
    });
    refresh();
});

function refresh() {
    chrome.storage.sync.get(DEFAULTS, s => {
        setDot('dot-spankbang', s.spankbang_enabled);
        setDot('dot-tnaflix', s.tnaflix_enabled);
        document.getElementById('sub-spankbang').classList.toggle('hidden', !s.spankbang_enabled);
    });
}

function setDot(id, active) {
    document.getElementById(id)?.classList.toggle('active', active);
}

// ── Directory ──────────────────────────────────────────────────────────────

const SITES = [
    {
        rank: '🥇', name: 'Tube.perverzija.com', url: 'https://tube.perverzija.com',
        pollution: 'None', dl: 'No (ext links)', quality: '1080p', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Fast', av: 'None',
        notes: 'Behemoth catalog, zero pollution, fast external stream links. Many videos in 1080p. Best all-round option.'
    },
    {
        rank: '🥈', name: 'Omg.xxx', url: 'https://omg.xxx',
        aliases: 'Freepornvideos.xxx · Porner.xxx',
        pollution: 'None', dl: 'Unknown', quality: '4K', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Unknown', av: 'None',
        notes: 'Multiple domain mirrors, same backend. 720p–4K from most major studios. Second-largest catalog, zero pollution.'
    },
    {
        rank: '🥉', name: 'Hqporner.com', url: 'https://hqporner.com',
        pollution: 'None', dl: 'Unknown', quality: '4K', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Slow', av: 'None',
        notes: 'Quality-focused, 720p–4K. Good for recent mainstream, thin on older content. Slow servers.'
    },
    {
        rank: '4', name: 'Pornhoarder.xxx', url: 'https://pornhoarder.xxx',
        pollution: 'None', dl: 'No (ext links)', quality: '720p', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Slow', av: 'None',
        notes: 'Probably the largest catalog on the list. Two-click play, seeking buffers, but unmatched depth. Best for rare/obscure material.'
    },
    {
        rank: '5', name: 'Noodlemagazine.com', url: 'https://noodlemagazine.com',
        pollution: 'Some', dl: 'Unknown', quality: '1080p', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Fast', av: 'None',
        notes: 'Best streaming speed of the quality sites. Recently added 1080p. Good starting point but requires some filtering.'
    },
    {
        rank: '6', name: 'Watchporn.to', url: 'https://watchporn.to',
        pollution: 'None', dl: 'Unknown', quality: 'Unknown', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Unknown', av: 'None',
        notes: 'Rare/underground content in good quality. Best alongside Pornlore for PPV or guarded studios (Blowpass, TopWebModels).'
    },
    {
        rank: '7', name: 'Pornlore.com', url: 'https://pornlore.com',
        pollution: 'None', dl: 'Difficult', quality: 'Unknown', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Unknown', av: 'None',
        notes: 'Gem for rare specialized studio content constantly DMCA\'d off Google. Aggressively blocks downloads but not impossible.'
    },
    {
        rank: '8', name: 'Pornxp.com', url: 'https://pornxp.com',
        pollution: 'None', dl: 'Yes', quality: '1080p', ads: 'Normal',
        adblocker: 'Recommended', speed: 'Slow', av: 'None',
        notes: 'Massive performer catalog, zero pollution. Most videos 480p on modern screens, occasionally 720p–1080p. Best for performer depth.'
    },
    {
        rank: '9', name: 'Fullporner.com', url: 'https://fullporner.com',
        pollution: 'None', dl: 'Unknown', quality: '1080p', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Normal', av: 'None',
        notes: 'Zero pollution, good 720p–1080p, but very small selection. Occasionally has a rare gem.'
    },
    {
        rank: '10', name: 'Whoreshub.com', url: 'https://whoreshub.com',
        pollution: 'None', dl: 'Yes', quality: 'Unknown', ads: 'Normal',
        adblocker: 'Optional', speed: 'Unknown', av: 'None',
        notes: 'VOD-focused (OnlyFans/ManyVids), little pollution. ~50% of links dead after recent data loss. Check back later.'
    },
    {
        rank: '11', name: 'Ixxx.com', url: 'https://ixxx.com',
        pollution: 'Some', dl: 'Unknown', quality: '1080p', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Fast', av: 'None',
        notes: 'Cluttered interface but fast streaming up to 1080p and a strong catalog. Pollution exists but easy to filter.'
    },
    {
        rank: '12', name: 'Eporner.com', url: 'https://eporner.com',
        pollution: 'High', dl: 'Yes', quality: '1080p', ads: 'Normal',
        adblocker: 'Recommended', speed: 'Unknown', av: 'server',
        notes: 'Good full-length selection but heavily mixed with short clips. Use duration filters. Server-side age verification.'
    },
    {
        rank: '13', name: 'Sxyprn.com', url: 'https://sxyprn.com',
        pollution: 'High', dl: 'Yes', quality: 'Unknown', ads: 'Normal',
        adblocker: 'Recommended', speed: 'Unknown', av: 'None',
        notes: 'AKA yourporn.sexy. Rarely removes videos. Downloads single-threaded; rename .vid → .mp4. Heavy filtering needed.'
    },
    {
        rank: '14', name: 'Pornslash.com', url: 'https://pornslash.com',
        pollution: 'High', dl: 'Unknown', quality: 'Unknown', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Unknown', av: 'None',
        notes: 'Sister site to Noodlemagazine. Can surface videos Noodle doesn\'t have, but requires filtering.'
    },
    {
        rank: '15', name: 'Severeporn.com', url: 'https://severeporn.com',
        pollution: 'High', dl: 'Yes', quality: 'Unknown', ads: 'High',
        adblocker: 'Required', speed: 'Unknown', av: 'None',
        notes: 'Decent spread of full-length content but mixed with short clips.'
    },
    {
        rank: '16', name: 'Spankbang.com', url: 'https://spankbang.com',
        pollution: 'High', dl: 'Reg. required', quality: '1080p', ads: 'Low',
        adblocker: 'Optional', speed: 'Unknown', av: 'client',
        notes: 'Declining. User uploads disabled ~6 months; new content dried up. Historical archive still large. Client-side age gate (bypassable).'
    },
    {
        rank: '17', name: 'Porntrex.com', url: 'https://porntrex.com',
        pollution: 'High', dl: 'Reg. required', quality: '1080p', ads: 'High',
        adblocker: 'Required', speed: 'Unknown', av: 'None',
        notes: 'Premium content gets removed but usually reuploaded. Worth an account but requires filtering.'
    },
    {
        rank: '18', name: 'Neporn.com', url: 'https://neporn.com',
        pollution: 'High', dl: 'Yes', quality: '720p', ads: 'Low',
        adblocker: 'Recommended', speed: 'Unknown', av: 'None',
        notes: 'Small library (<30K videos). Claims full-length but mixed results.'
    },
    {
        rank: '19', name: 'Pxxbay.com', url: 'https://pxxbay.com',
        pollution: 'High', dl: 'Yes', quality: 'Unknown', ads: 'Aggressive',
        adblocker: 'Required', speed: 'Slow', av: 'None',
        notes: 'Good zero-day releases but on third-party hosts loaded with popups. Older links frequently die. Recent releases only.'
    },
    {
        rank: '20', name: 'Pornmd.com', url: 'https://pornmd.com',
        pollution: 'Some', dl: 'No (redirects)', quality: 'Varies', ads: 'Varies',
        adblocker: 'Varies', speed: 'Varies', av: 'None',
        notes: 'Aggregator redirecting to fringe tube sites. Quality is a dice roll. HD tag = 720p+. Large filterable catalog.'
    },
    {
        rank: '21', name: 'Youjizz.com', url: 'https://youjizz.com',
        pollution: 'Very High', dl: 'Yes', quality: 'Unknown', ads: 'Normal',
        adblocker: 'Recommended', speed: 'Unknown', av: 'None',
        notes: 'Heavily polluted. Occasionally the only place a rare video exists. Broken internal search — use Google site: search.'
    },
    {
        rank: '22', name: 'Tnaflix.com', url: 'https://tnaflix.com',
        aliases: 'Empflix.com',
        pollution: 'Very High', dl: 'Yes', quality: 'Unknown', ads: 'Normal',
        adblocker: 'Recommended', speed: 'Unknown', av: 'client',
        notes: 'Heavy pollution but occasionally the only source for very rare content. Broken internal search. Use Google site: search. Client-side age gate (bypassable).'
    },
    {
        rank: '23', name: 'Pornzog.com', url: 'https://pornzog.com',
        pollution: 'Very High', dl: 'Unknown', quality: 'Unknown', ads: 'Unknown',
        adblocker: 'Unknown', speed: 'Unknown', av: 'None',
        notes: 'Same deal as Tnaflix/Youjizz — rare content, heavy pollution, broken search. Use Google site: search.'
    },
];

function pollutionBadge(p) {
    const map = {
        'None':      ['badge-none',  'None'],
        'Some':      ['badge-some',  'Some'],
        'High':      ['badge-high',  'High'],
        'Very High': ['badge-vhigh', 'Very High'],
    };
    const [cls, label] = map[p] || ['unknown', p];
    return `<span class="badge ${cls}">${label}</span>`;
}

function avCell(av) {
    if (av === 'client') return '<span class="av-client">Client-side ⚠</span>';
    if (av === 'server') return '<span class="av-server">Server-side ✕</span>';
    return '<span class="av-none">—</span>';
}

function u(val) {
    return (!val || val === 'Unknown') ? '<span class="unknown">—</span>' : val;
}

const dir = document.getElementById('directory');

const table = document.createElement('table');
table.innerHTML = `
  <thead>
    <tr>
      <th>#</th>
      <th>Site</th>
      <th>Pollution</th>
      <th>DL?</th>
      <th>Quality</th>
      <th>Ads</th>
      <th>Blocker</th>
      <th>Speed</th>
      <th>Age</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    ${SITES.map(s => `
      <tr>
        <td class="rank">${s.rank}</td>
        <td class="site">
          <a href="${s.url}" target="_blank">${s.name}</a>
          ${s.aliases ? `<span class="aliases">${s.aliases}</span>` : ''}
        </td>
        <td>${pollutionBadge(s.pollution)}</td>
        <td>${u(s.dl)}</td>
        <td>${u(s.quality)}</td>
        <td>${u(s.ads)}</td>
        <td>${u(s.adblocker)}</td>
        <td>${u(s.speed)}</td>
        <td>${avCell(s.av)}</td>
        <td class="notes">${s.notes}</td>
      </tr>
    `).join('')}
  </tbody>
`;

dir.appendChild(table);
