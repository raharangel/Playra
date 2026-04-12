const grid = document.getElementById("grid");
const search = document.getElementById("search");
const info = document.getElementById("info");
const themeToggle = document.getElementById("themeToggle");

let allPokemon = [];
let favorites = new Set();

// Fetch data
async function fetchPokemon() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
  const data = await res.json();

  const promises = data.results.map(p =>
    fetch(p.url).then(res => res.json())
  );

  allPokemon = await Promise.all(promises);
  render();
}

// Render UI
function render() {
  const query = search.value.toLowerCase();

  let filtered = allPokemon.filter(p =>
    p.name.includes(query)
  );

  filtered.sort((a, b) =>
    favorites.has(b.name) - favorites.has(a.name)
  );

  grid.innerHTML = "";
  info.textContent = `Showing ${filtered.length} Pokémon`;

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    const types = p.types.map(t =>
      `<span class="${t.type.name}">${t.type.name}</span>`
    ).join("");

    const isFav = favorites.has(p.name);

    div.innerHTML = `
      <span class="star">${isFav ? "⭐" : "☆"}</span>
      <img src="${p.sprites.other['official-artwork'].front_default}">
      <h3>${p.name}</h3>
      <p>#${p.id.toString().padStart(3, '0')}</p>
      <div class="types">${types}</div>
    `;

    div.querySelector(".star").onclick = () => {
      if (favorites.has(p.name)) {
        favorites.delete(p.name);
      } else {
        favorites.add(p.name);
      }
      render();
    };

    grid.appendChild(div);
  });
}

// Events
search.addEventListener("input", render);

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

// Init
fetchPokemon();
