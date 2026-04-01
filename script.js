const grid = document.getElementById("grid");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

let allData = [];

// Fetch Pokémon API
fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
  .then(res => res.json())
  .then(data => {
    const promises = data.results.map(p =>
      fetch(p.url).then(res => res.json())
    );

    Promise.all(promises).then(results => {
      allData = results;
      displayData(allData);
      loading.style.display = "none";
    });
  });

// Display data
function displayData(data) {
  grid.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.name}</h3>
      <img src="${item.sprites.front_default}" />
    `;

    grid.appendChild(div);
  });
}

// Search using filter (HOF)
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();

  const filtered = allData.filter(p =>
    p.name.includes(value)
  );

  displayData(filtered);
});