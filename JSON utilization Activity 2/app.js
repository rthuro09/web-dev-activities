const CONFIGURATION = {
  imageDirectory: "images",
  dataEndpoint: "data.json"
};

const applicationState = {
  selectedCharacter: null,
  dataset: null
};

function generateSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function getImagePath(slug) {
  return `${CONFIGURATION.imageDirectory}/${slug}.webp`;
}

function displayToast(message) {
  const toastElement = document.getElementById("toast");
  toastElement.textContent = message;
  toastElement.classList.add("visible");
  clearTimeout(displayToast.timer);
  displayToast.timer = setTimeout(() => {
    toastElement.classList.remove("visible");
  }, 2600);
}

function getFilteredCharacters() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const era = document.getElementById("eraFilter").value;
  const grade = document.getElementById("gradeFilter").value;

  return applicationState.dataset.characters.filter(character => {
    const searchHaystack = `${character.name} ${character.japaneseName} ${character.technique || ""}`.toLowerCase();
    const matchesQuery = searchHaystack.includes(query);
    const matchesEra = era === "all" || character.era === era;
    const matchesGrade = grade === "all" || character.grade === grade;
    return matchesQuery && matchesEra && matchesGrade;
  });
}

function createCharacterCard(character) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = character.id;

  const portraitBox = document.createElement("div");
  portraitBox.className = "card-portrait";

  if (character.aura) {
    portraitBox.style.background = `linear-gradient(135deg, ${character.aura[0]}, ${character.aura[1]})`;
  }

  if (character.image) {
    const img = document.createElement("img");
    img.src = character.image;
    img.alt = character.name;
    img.loading = "lazy";
    img.onerror = () => {
      img.remove();
      portraitBox.textContent = getInitials(character.name);
    };
    portraitBox.appendChild(img);
  } else {
    portraitBox.textContent = getInitials(character.name);
  }

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.textContent = character.name;

  const jpName = document.createElement("div");
  jpName.className = "jp";
  jpName.textContent = character.japaneseName;

  const technique = document.createElement("div");
  technique.className = "technique";
  technique.textContent = character.technique || "No innate technique";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span class="grade">${character.grade}</span><span class="status">${character.status}</span>`;

  body.append(title, jpName, technique, meta);
  card.append(portraitBox, body);
  
  card.addEventListener("click", () => {
    selectCharacter(character, card);
  });

  return card;
}

function renderCharacterGrid() {
  const filteredList = getFilteredCharacters();
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  
  document.getElementById("resultCount").textContent = `${filteredList.length} records`;

  filteredList.forEach(character => {
    const card = createCharacterCard(character);
    grid.appendChild(card);
  });

  if (applicationState.selectedCharacter) {
    const activeCard = grid.querySelector(`[data-id="${applicationState.selectedCharacter.id}"]`);
    if (activeCard) {
      activeCard.classList.add("active");
    }
  }
}

function selectCharacter(character, cardElement) {
  applicationState.selectedCharacter = character;
  
  const inspector = document.getElementById("inspector");
  inspector.textContent = JSON.stringify(character, null, 2);
  
  document.querySelectorAll(".card").forEach(el => el.classList.remove("active"));
  cardElement.classList.add("active");
  
  displayToast(`${character.name} loaded`);
}

function renderTimeline() {
  const container = document.getElementById("timelineList");
  container.innerHTML = "";
  
  applicationState.dataset.timeline.forEach(item => {
    const block = document.createElement("article");
    block.className = "timeline-item";
    block.innerHTML = `
      <div class="year">${item.year}</div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
    `;
    container.appendChild(block);
  });
}

function populateFilters() {
  const eraFilter = document.getElementById("eraFilter");
  applicationState.dataset.eras.forEach(era => {
    const option = document.createElement("option");
    option.value = era.id;
    option.textContent = era.label;
    eraFilter.appendChild(option);
  });

  const gradeFilter = document.getElementById("gradeFilter");
  const uniqueGrades = [...new Set(applicationState.dataset.characters.map(c => c.grade))].sort();
  uniqueGrades.forEach(grade => {
    const option = document.createElement("option");
    option.value = grade;
    option.textContent = grade;
    gradeFilter.appendChild(option);
  });
}

function updateHeroMeta() {
  const meta = document.getElementById("heroMeta");
  const charCount = applicationState.dataset.characters.length;
  const eraCount = applicationState.dataset.eras.length;
  meta.textContent = `${charCount} characters · ${eraCount} eras · JSON powered`;
}

function initializeEventListeners() {
  document.getElementById("search").addEventListener("input", renderCharacterGrid);
  document.getElementById("eraFilter").addEventListener("change", renderCharacterGrid);
  document.getElementById("gradeFilter").addEventListener("change", renderCharacterGrid);

  document.getElementById("copyBtn").addEventListener("click", () => {
    if (!applicationState.selectedCharacter) {
      return displayToast("Select a character first");
    }
    navigator.clipboard.writeText(JSON.stringify(applicationState.selectedCharacter, null, 2))
      .then(() => displayToast("JSON copied"))
      .catch(() => displayToast("Copy failed"));
  });
}

function initializeHeroVideo() {
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.volume = 0;
    heroVideo.play().catch(() => {});
  }
}

function getInitials(name) {
  return name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
}

function initializeApplication() {
  initializeHeroVideo();
  populateFilters();
  updateHeroMeta();
  renderTimeline();
  renderCharacterGrid();
  initializeEventListeners();
}

function loadApplicationData() {
  fetch(CONFIGURATION.dataEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(jsonData => {
      applicationState.dataset = jsonData;
      initializeApplication();
    })
    .catch(error => {
      console.error("Failed to load data.json:", error);
      document.body.innerHTML = `
        <h1 style="color: var(--accent-cursed-red); text-align: center; padding: 2rem; font-family: var(--font-display);">
          Error: Could not load data.json. Check console.
        </h1>
      `;
    });
}

loadApplicationData();
