const params = new URLSearchParams(window.location.search);
const imageUrl = params.get("image");
const characterName = params.get("name");
const image = document.querySelector("#viewerImage");
const title = document.querySelector("#viewerTitle");
const error = document.querySelector("#viewerError");

title.textContent = characterName || "Character image";
image.alt = characterName ? `${characterName} character image` : "Dragon Ball character";
image.addEventListener("error", () => {
  image.classList.add("d-none");
  error.classList.remove("d-none");
});

if (imageUrl) {
  try {
    const parsedUrl = new URL(imageUrl);
    if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
      image.src = parsedUrl.href;
    } else {
      error.classList.remove("d-none");
    }
  } catch {
    error.classList.remove("d-none");
  }
} else {
  error.classList.remove("d-none");
}
