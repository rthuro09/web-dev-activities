/* =========================================================
   JJK ARCHIVE — Logic Core
   Portraits now load from LOCAL .webp files instead of remote links.
   Expected folder next to index.html:  images/
     images/satoru-gojo.webp      images/yuta-okkotsu.webp
     images/suguru-geto.webp      images/choso.webp
     images/yuji-itadori.webp     images/kinji-hakari.webp
     images/megumi-fushiguro.webp images/hiromi-higuruma.webp
     images/nobara-kugisaki.webp  images/yuki-tsukumo.webp
     images/kento-nanami.webp     images/kenjaku.webp
     images/mahito.webp
     images/ryomen-sukuna.webp
   (Rename your downloaded .webp files to match these slugs,
    or edit the slug string inside portrait("…") below.)
   ========================================================= */

const IMAGE_DIR = "images";
const portrait = (slug) => `${IMAGE_DIR}/${slug}.webp`;

const data = {
  eras: [
    { id: "hidden-inventory", label: "Hidden Inventory (2006)" },
    { id: "season-1", label: "Season 1 (2017)" },
    { id: "shibuya", label: "Shibuya Incident (2018)" },
    { id: "culling-game", label: "Culling Game (2018+)" }
  ],
  characters: [
    {
      id: 1, name: "Satoru Gojo", japaneseName: "五条悟", era: "hidden-inventory",
      grade: "Special Grade", technique: "Limitless",
      abilities: ["Six Eyes", "Blue", "Red", "Hollow Purple"],
      stats: { strength: 10, speed: 10, control: 10 }, status: "Sealed", mentor: null,
      image: portrait("satoru-gojo")
    },
    {
      id: 2, name: "Suguru Geto", japaneseName: "夏油傑", era: "hidden-inventory",
      grade: "Special Grade", technique: "Cursed Spirit Manipulation",
      abilities: ["Uzumaki", "Cursed Spirit Arsenal"],
      stats: { strength: 8, speed: 8, control: 10 }, status: "Deceased", mentor: null,
      image: portrait("suguru-geto")
    },
    {
      id: 3, name: "Yuji Itadori", japaneseName: "虎杖悠仁", era: "season-1",
      grade: "Special Grade", technique: "Divergent Fist",
      abilities: ["Black Flash", "Sukuna's Vessel"],
      stats: { strength: 9, speed: 9, control: 5 }, status: "Active", mentor: "Satoru Gojo",
      image: portrait("yuji-itadori")
    },
    {
      id: 4, name: "Megumi Fushiguro", japaneseName: "伏黒恵", era: "season-1",
      grade: "Grade 2", technique: "Ten Shadows Technique",
      abilities: ["Divine Dogs", "Nue", "Mahoraga"],
      stats: { strength: 7, speed: 7, control: 9 }, status: "Active", mentor: "Satoru Gojo",
      image: portrait("megumi-fushiguro")
    },
    {
      id: 5, name: "Nobara Kugisaki", japaneseName: "釘崎野薔薇", era: "season-1",
      grade: "Grade 3", technique: "Straw Doll Technique",
      abilities: ["Resonance", "Hairpin"],
      stats: { strength: 7, speed: 7, control: 8 }, status: "Unknown", mentor: "Kento Nanami",
      image: portrait("nobara-kugisaki")
    },
    {
      id: 6, name: "Kento Nanami", japaneseName: "七海建人", era: "season-1",
      grade: "Grade 1", technique: "Ratio Technique",
      abilities: ["7:3 Ratio", "Cursed Tool Blades"],
      stats: { strength: 8, speed: 7, control: 9 }, status: "Deceased", mentor: null,
      image: portrait("kento-nanami")
    },
    {
      id: 7, name: "Mahito", japaneseName: "真人", era: "season-1",
      grade: "Special Grade", technique: "Idle Transfiguration",
      abilities: ["Body Hopping", "Self-Embodiment of Perfection"],
      stats: { strength: 8, speed: 9, control: 10 }, status: "Deceased", mentor: null,
      image: portrait("mahito")
    },
    {
      id: 8, name: "Ryomen Sukuna", japaneseName: "両面宿儺", era: "shibuya",
      grade: "Special Grade", technique: "Cleave and Dismantle",
      abilities: ["Malevolent Shrine", "Fire Arrow"],
      stats: { strength: 10, speed: 10, control: 10 }, status: "Active", mentor: null,
      image: portrait("ryomen-sukuna")
    },
    {
      id: 9, name: "Yuta Okkotsu", japaneseName: "乙骨憂太", era: "shibuya",
      grade: "Special Grade", technique: "Copy",
      abilities: ["Rika", "Cursed Speech"],
      stats: { strength: 9, speed: 8, control: 10 }, status: "Active", mentor: "Satoru Gojo",
      image: portrait("yuta-okkotsu")
    },
    {
      id: 10, name: "Choso", japaneseName: "脹相", era: "shibuya",
      grade: "Ungraded", technique: "Blood Manipulation",
      abilities: ["Supernova", "Convergence"],
      stats: { strength: 8, speed: 8, control: 8 }, status: "Active", mentor: null,
      image: portrait("choso")
    },
    {
      id: 11, name: "Kinji Hakari", japaneseName: "秤金次", era: "culling-game",
      grade: "Grade 1", technique: "Idle Death Gamble",
      abilities: ["Jackpot", "Restoration"],
      stats: { strength: 9, speed: 8, control: 7 }, status: "Active", mentor: null,
      image: portrait("kinji-hakari")
    },
    {
      id: 12, name: "Hiromi Higuruma", japaneseName: "日車寛見", era: "culling-game",
      grade: "Ungraded", technique: "Judgeman",
      abilities: ["Sentence", "Confiscation"],
      stats: { strength: 5, speed: 6, control: 9 }, status: "Deceased", mentor: null,
      image: portrait("hiromi-higuruma")
    },
    {
      id: 13, name: "Yuki Tsukumo", japaneseName: "九十九由基", era: "culling-game",
      grade: "Special Grade", technique: "Mass",
      abilities: ["Star Rage", "Virtual Mass"],
      stats: { strength: 10, speed: 9, control: 9 }, status: "Deceased", mentor: null,
      image: portrait("yuki-tsukumo")
    },
    {
      id: 14, name: "Kenjaku", japaneseName: "羂索", era: "culling-game",
      grade: "Special Grade", technique: "Brain Possession",
      abilities: ["Culling Game", "Multi-Technique Use"],
      stats: { strength: 9, speed: 8, control: 10 }, status: "Active", mentor: null,
      image: portrait("kenjaku")
    }
  ],
  timeline: [
    { year: 2006, title: "Hidden Inventory / Premature Death", summary: "Gojo and Geto protect the Star Plasma Vessel. Toji's ambush forges the modern strongest." },
    { year: 2017, title: "The Vessel", summary: "Yuji swallows one of Sukuna's fingers and enters Tokyo Jujutsu High." },
    { year: 2018, title: "Shibuya Incident", summary: "Gojo is sealed, Nanami falls, and Sukuna is unleashed on Shibuya." },
    { year: 2018, title: "Culling Game", summary: "Kenjaku's ritual spreads across Japan. Awakened players enter the colonies." }
  ]
};

const state = { selected: null };

function initials(name) {
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("visible"), 2600);
}

function applyFilters() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const era = document.getElementById("eraFilter").value;
  const grade = document.getElementById("gradeFilter").value;
  return data.characters.filter(c => {
    const haystack = `${c.name} ${c.japaneseName} ${c.technique || ""}`.toLowerCase();
    return haystack.includes(query)
      && (era === "all" || c.era === era)
      && (grade === "all" || c.grade === grade);
  });
}

function render() {
  const list = applyFilters();
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  document.getElementById("resultCount").textContent = `${list.length} records`;

  for (const character of list) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = character.id;

    const portraitBox = document.createElement("div");
    portraitBox.className = "card-portrait";

    if (character.image) {
      const img = document.createElement("img");
      img.src = character.image;           // local .webp portrait
      img.alt = character.name;
      img.loading = "lazy";
      // If the .webp is missing, fall back to initials instead of a broken icon
      img.onerror = () => {
        img.remove();
        portraitBox.textContent = initials(character.name);
      };
      portraitBox.appendChild(img);
    } else {
      portraitBox.textContent = initials(character.name);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = character.name;

    const jp = document.createElement("div");
    jp.className = "jp";
    jp.textContent = character.japaneseName;

    const technique = document.createElement("div");
    technique.className = "technique";
    technique.textContent = character.technique || "No innate technique";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span class="grade">${character.grade}</span><span class="status">${character.status}</span>`;

    body.append(title, jp, technique, meta);
    card.append(portraitBox, body);
    card.addEventListener("click", () => select(character, card));
    grid.appendChild(card);
  }

  if (state.selected) {
    const active = grid.querySelector(`[data-id="${state.selected.id}"]`);
    if (active) active.classList.add("active");
  }
}

function select(character, card) {
  state.selected = character;
  document.getElementById("inspector").textContent = JSON.stringify(character, null, 2);
  document.querySelectorAll(".card").forEach(el => el.classList.remove("active"));
  card.classList.add("active");
  toast(`${character.name} loaded`);
}

function renderTimeline() {
  const container = document.getElementById("timelineList");
  container.innerHTML = "";
  for (const item of data.timeline) {
    const block = document.createElement("article");
    block.className = "timeline-item";
    block.innerHTML = `<div class="year">${item.year}</div><h3>${item.title}</h3><p>${item.summary}</p>`;
    container.appendChild(block);
  }
}

function init() {
  // Background hero video: guarantee muted playback
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.volume = 0;
    heroVideo.play().catch(() => { /* autoplay blocked: poster/first frame remains */ });
  }

  for (const era of data.eras) {
    const option = document.createElement("option");
    option.value = era.id;
    option.textContent = era.label;
    document.getElementById("eraFilter").appendChild(option);
  }

  const grades = [...new Set(data.characters.map(c => c.grade))].sort();
  for (const grade of grades) {
    const option = document.createElement("option");
    option.value = grade;
    option.textContent = grade;
    document.getElementById("gradeFilter").appendChild(option);
  }

  document.getElementById("heroMeta").textContent =
    `${data.characters.length} characters · ${data.eras.length} eras · JSON powered`;

  renderTimeline();
  render();

  document.getElementById("search").addEventListener("input", render);
  document.getElementById("eraFilter").addEventListener("change", render);
  document.getElementById("gradeFilter").addEventListener("change", render);
  document.getElementById("copyBtn").addEventListener("click", () => {
    if (!state.selected) return toast("Select a character first");
    navigator.clipboard.writeText(JSON.stringify(state.selected, null, 2))
      .then(() => toast("JSON copied"))
      .catch(() => toast("Copy failed"));
  });
}

init();