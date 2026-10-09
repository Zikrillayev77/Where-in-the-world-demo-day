let countries = [];
const modal = document.getElementById("country-modal");
const modalContent = document.querySelector("#country-modal > div");
const countriesContainer = document.getElementById("davlatlani-canteneri");
const searchInput = document.getElementById("search-input");
const regionfilter = document.getElementById("region-filter");
const darkModeBtn = document.getElementById("dark-mode-btn");

let currentRegion = "";

async function getRegionMap() {
  const res = await fetch(
    "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json",
  );
  const data = await res.json();

  const map = {};
  data.forEach((item) => {
    map[item["alpha-2"]] = item.region;
  });
  return map;
}

async function getCountries() {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/capital",
    );

    if (!response.ok) throw new Error("Ulanish xatosi");

    const result = await response.json();
    const regionMap = await getRegionMap();

    countries = result.data.map((item) => {
      const isoCode = item.iso2 ? item.iso2.toLowerCase() : "";
      const flagUrl = isoCode ? `https://flagcdn.com/w320/${isoCode}.png` : "";
      return {
        name: { common: item.name },
        capital: item.capital ? [item.capital] : [],
        flags: { png: flagUrl },
        region: regionMap[item.iso2] || "Unknown",
      };
    });

    displayCountries(countries);
  } catch (error) {
    console.error(error);
    countriesContainer.innerHTML = `<p>Ma'lumot topilmadi. Internetni tekshiring.</p>`;
  }
}

function displayCountries(data) {
  countriesContainer.innerHTML = "";

  data.forEach((country, index) => {
    const flag =
      country.flags.png || "https://placehold.co/320x200?text=Flag";
    const capital =
      country.capital && country.capital.length
        ? country.capital[0]
        : "Noma'lum";
    const region = country.region || "Unknown";

    countriesContainer.innerHTML += `
        <div class="country-card" data-index="${index}" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${flag}');">
            <h3>${country.name.common}</h3>
            <p>${region}</p>
            <p>Poytaxti: ${capital}</p>
        </div>
        `;
  });

  document.querySelectorAll(".country-card").forEach((card) => {
    card.addEventListener("click", () => {
      const index = card.dataset.index;
      showModal(data[index]);
    });
  });
}

function showModal(country) {
  const flag =
    country.flags.png || "https://placehold.co/320x200?text=Flag";
  const capital =
    country.capital && country.capital.length ? country.capital[0] : "Noma'lum";
  const region = country.region || "Unknown";

  modalContent.innerHTML = `
        <button id="modal-close" class="ml-auto mb-3 block text-2xl leading-none text-gray-600 hover:text-black cursor-pointer">&times;</button>
        <img src="${flag}" alt="${country.name.common} flag" class="w-full h-48 object-cover rounded-md mb-4" />
        <h2 class="text-2xl font-bold mb-3 text-gray-900">${country.name.common}</h2>
        <p class="text-gray-700 mb-1"><span class="font-semibold">Region:</span> ${region}</p>
        <p class="text-gray-700 mb-1"><span class="font-semibold">Poytaxti:</span> ${capital}</p>
    `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  document.getElementById("modal-close").addEventListener("click", closeModal);
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}


modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

getCountries();

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const region = regionfilter.value;

  const filtered = countries.filter((c) => {
    const matchesSearch = c.name.common.toLowerCase().includes(searchTerm);
    const matchesRegion = !region || c.region === region;
    return matchesSearch && matchesRegion;
  });

  displayCountries(filtered);
}

searchInput.addEventListener("input", applyFilters);
regionfilter.addEventListener("change", applyFilters);

function applyDarkPreference() {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", isDark);
  darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
}

darkModeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", isDark);
  darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

applyDarkPreference();


