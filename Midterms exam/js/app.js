import { fetchCharacters } from "../api.js";

const RESULTS_PER_PAGE = 8;
const IDS_PER_PAGE = 50;
const TOTAL_IDS = 1025;

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#characterSearch");
const characterGrid = document.querySelector("#characterGrid");
const characterPagination = document.querySelector("#characterPagination");
const resultSummary = document.querySelector("#resultSummary");
const loadingState = document.querySelector("#loadingState");
const statusMessage = document.querySelector("#statusMessage");
const idGrid = document.querySelector("#idGrid");
const idPagination = document.querySelector("#idPagination");

let characters = [];
let characterPage = 1;
let totalCharacterPages = 0;
let serverPaginated = false;
let activeSearchTerm = "";
let requestController;
let requestSequence = 0;
let idPage = 1;

function setLoading(isLoading) {
  loadingState.classList.toggle("d-none", !isLoading);
}

function setStatus(message = "", type = "info") {
  statusMessage.textContent = message;
  statusMessage.className = `alert archive-alert alert-${type}${message ? "" : " d-none"}`;
}

function createField(label, value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }
  const field = document.createElement("p");
  field.className = "character-field";
  const name = document.createElement("span");
  name.className = "field-label";
  name.textContent = label;
  const content = document.createElement("span");
  content.className = "field-value";
  content.textContent = value;
  field.append(name, content);
  return field;
}

function createCharacterCard(character) {
  const card = document.createElement("article");
  card.className = "character-card";

  const imageLink = document.createElement("a");
  imageLink.className = "character-image-link";
  imageLink.setAttribute("aria-label", `View ${character.name} image`);
  const image = document.createElement("img");
  image.className = "character-image";
  image.alt = `${character.name} character`;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.classList.add("image-unavailable");
    image.alt = `${character.name} image unavailable`;
  }, { once: true });

  if (typeof character.image === "string" && character.image.trim()) {
    const viewerUrl = new URL("view.html", window.location.href);
    viewerUrl.searchParams.set("image", character.image);
    viewerUrl.searchParams.set("name", character.name);
    imageLink.href = viewerUrl.href;
    image.src = character.image;
  } else {
    image.classList.add("image-unavailable");
    image.alt = "Character image unavailable";
    imageLink.classList.add("image-link-disabled");
    imageLink.setAttribute("aria-disabled", "true");
  }

  const cardBody = document.createElement("div");
  cardBody.className = "character-card-body";
  const header = document.createElement("div");
  header.className = "character-card-heading";
  const name = document.createElement("h3");
  name.textContent = character.name;
  const recordId = document.createElement("span");
  recordId.className = "record-id";
  recordId.textContent = `#${character.id ?? "-"}`;
  header.append(name, recordId);

  const fields = document.createElement("div");
  fields.className = "character-fields";
  [
    createField("Race", character.race),
    createField("Gender", character.gender),
    createField("Affiliation", character.affiliation),
    createField("Power", character.ki),
    createField("Max power", character.maxKi)
  ].filter(Boolean).forEach((field) => fields.append(field));

  // Fixed logic: Check if the href attribute was actually set, rather than the property 
  // (which defaults to the current page URL for <a> tags and is always truthy)
  const hasHref = imageLink.hasAttribute("href");
  const viewLink = hasHref
    ? Object.assign(document.createElement("a"), {
        className: "view-image-link",
        href: imageLink.href,
        textContent: "View image ->"
      })
    : null;

  imageLink.append(image);
  card.append(imageLink);
  cardBody.append(header, fields);
  if (viewLink) {
    cardBody.append(viewLink);
  }
  card.append(cardBody);
  return card;
}

function createPageItem(label, page, disabled = false, active = false, ariaLabel = label) {
  const item = document.createElement("li");
  item.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`;
  const link = document.createElement("button");
  link.type = "button";
  link.className = "page-link";
  link.textContent = label;
  link.setAttribute("aria-label", ariaLabel);
  if (active) {
    link.setAttribute("aria-current", "page");
  }
  link.disabled = disabled || active;
  link.addEventListener("click", () => page());
  item.append(link);
  return item;
}

function renderCharacterPagination(totalPages) {
  characterPagination.replaceChildren();
  if (totalPages <= 1) {
    return;
  }
  characterPagination.append(createPageItem("Previous", () => changeCharacterPage(characterPage - 1), characterPage === 1));
  const start = Math.max(1, Math.min(characterPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let page = start; page <= end; page += 1) {
    characterPagination.append(createPageItem(String(page), () => changeCharacterPage(page), false, page === characterPage, `Page ${page}`));
  }
  characterPagination.append(createPageItem("Next", () => changeCharacterPage(characterPage + 1), characterPage === totalPages));
}

function renderCharacters() {
  characterGrid.replaceChildren();
  const totalPages = serverPaginated ? totalCharacterPages : Math.ceil(characters.length / RESULTS_PER_PAGE);
  const start = (characterPage - 1) * RESULTS_PER_PAGE;
  const visibleCharacters = serverPaginated ? characters : characters.slice(start, start + RESULTS_PER_PAGE);
  visibleCharacters.forEach((character) => {
    characterGrid.append(createCharacterCard(character));
  });
  if (!characters.length) {
    resultSummary.textContent = "No character records";
  } else {
    const recordCount = `${characters.length} result${characters.length === 1 ? "" : "s"}`;
    const searchLabel = activeSearchTerm ? ` for "${activeSearchTerm}"` : "";
    resultSummary.textContent = `${recordCount}${searchLabel} - page ${characterPage} of ${totalPages}`;
  }
  renderCharacterPagination(totalPages);
}

function changeCharacterPage(page) {
  const totalPages = serverPaginated ? totalCharacterPages : Math.ceil(characters.length / RESULTS_PER_PAGE);
  if (page < 1 || page > totalPages) {
    return;
  }
  if (serverPaginated) {
    runSearch(activeSearchTerm, page);
    return;
  }
  characterPage = page;
  renderCharacters();
  document.querySelector("#database").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function runSearch(searchTerm = "", page = 1) {
  activeSearchTerm = searchTerm.trim();
  
  // Replaced optional chaining (?.) with standard if-check for broader compatibility
  if (requestController) {
    requestController.abort();
  }
  requestController = new AbortController();
  const currentRequest = ++requestSequence;
  setLoading(true);
  setStatus();
  characterGrid.replaceChildren();
  characterPagination.replaceChildren();

  try {
    const records = await fetchCharacters(activeSearchTerm, page, requestController.signal);
    if (currentRequest !== requestSequence) {
      return;
    }
    characters = records.items;
    totalCharacterPages = records.totalPages;
    serverPaginated = records.serverPaginated;
    characterPage = records.currentPage;
    renderCharacters();
    if (!characters.length) {
      const message = activeSearchTerm
        ? `No characters found for "${activeSearchTerm}". Try another name.`
        : "The character database returned no records. Please try again later.";
      setStatus(message, "warning");
    }
  } catch (error) {
    if (error.name === "AbortError" || currentRequest !== requestSequence) {
      return;
    }
    characters = [];
    characterPage = 1;
    resultSummary.textContent = "Unable to load records.";
    setStatus(error.message || "An unexpected error occurred while loading character records.", "danger");
  } finally {
    if (currentRequest === requestSequence) {
      setLoading(false);
    }
  }
}

function renderIdArchive() {
  const totalPages = Math.ceil(TOTAL_IDS / IDS_PER_PAGE);
  const firstId = (idPage - 1) * IDS_PER_PAGE + 1;
  const lastId = Math.min(idPage * IDS_PER_PAGE, TOTAL_IDS);
  idGrid.replaceChildren();

  for (let id = firstId; id <= lastId; id += 1) {
    const entry = document.createElement("div");
    entry.className = "id-entry";
    const label = document.createElement("span");
    label.textContent = "ID";
    const value = document.createElement("strong");
    value.textContent = String(id).padStart(4, "0");
    entry.append(label, value);
    idGrid.append(entry);
  }

  document.querySelector("#idPageLabel").textContent = `PAGE ${idPage}`;
  document.querySelector("#idRangeLabel").textContent = `${firstId}-${lastId}`;
  idPagination.replaceChildren();
  idPagination.append(createPageItem("Previous", () => changeIdPage(idPage - 1), idPage === 1));
  const start = Math.max(1, Math.min(idPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let page = start; page <= end; page += 1) {
    idPagination.append(createPageItem(String(page), () => changeIdPage(page), false, page === idPage, `ID archive page ${page}`));
  }
  idPagination.append(createPageItem("Next", () => changeIdPage(idPage + 1), idPage === totalPages));
}

function changeIdPage(page) {
  const totalPages = Math.ceil(TOTAL_IDS / IDS_PER_PAGE);
  if (page < 1 || page > totalPages) {
    return;
  }
  idPage = page;
  renderIdArchive();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch(searchInput.value);
});

renderIdArchive();
runSearch();
