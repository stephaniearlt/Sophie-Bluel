/////// FONCTIONNALITES PAGE D'ACCUEIL ////////

// Constantes pour les URLs de l'API
const API_BASE_URL = "http://localhost:5678/api";
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const WORKS_URL = `${API_BASE_URL}/works`;

let selectedCategoryId = 0; // Par défaut, afficher tous les travaux

// Fonction pour récupérer les données de l'API
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des données depuis ${url}`);
  }
  return await response.json();
}

// Suppression des travaux de la galerie
function deleteWorks() {
  const gallery = document.querySelector(".gallery");
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
}

// Affichage des travaux dans la galerie
async function displayWorks() {
  try {
    const response = await fetch(WORKS_URL);
    if (response.ok) {
      deleteWorks();
      const data = await response.json();
      const gallery = document.querySelector(".gallery");
      for (let work of data) {
        if (
          selectedCategoryId === 0 ||
          selectedCategoryId === work.categoryId
        ) {
          const figure = document.createElement("figure");
          const image = document.createElement("img");
          image.setAttribute("crossorigin", "anonymous");
          image.setAttribute("src", work.imageUrl);
          image.alt = work.title;
          const figCaption = document.createElement("figcaption");
          figCaption.textContent = work.title;
          figure.appendChild(image);
          figure.appendChild(figCaption);
          gallery.appendChild(figure);
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'affichage des works :", error);
  }
}

// Affichage des boutons de filtre par catégorie
async function displayFilters() {
  try {
    // N'affiche pas les filtres si le mode édition est activé
    if (isUserLoggedIn()) {
      return;
    }

    const categories = await fetchData(CATEGORIES_URL);
    categories.unshift({ id: 0, name: "Tous" });
    const portfolio = document.getElementById("portfolio");
    const gallery = document.querySelector(".gallery");
    const divFilters = document.createElement("div");
    divFilters.id = "container-filters";
    for (let category of categories) {
      const button = document.createElement("button");
      button.classList.add("button-filter");
      button.textContent = category.name;
      button.value = category.id;
      button.addEventListener("click", filterWorks);
      divFilters.appendChild(button);
    }
    portfolio.insertBefore(divFilters, gallery);

    // Active le bouton "Tous" par défaut
    const allButton = document.querySelector(".button-filter[value='0']");
    allButton.classList.add("active");
  } catch (error) {
    console.error("Erreur lors de l'affichage des filtres :", error);
  }
}

// Filtre les travaux en fonction de leur catégorie
function filterWorks(event) {
  selectedCategoryId = parseInt(event.target.value);
  displayWorks();

  const buttons = document.querySelectorAll(".button-filter");
  buttons.forEach((button) => {
    button.classList.remove("active");
    if (button.value === selectedCategoryId.toString()) {
      button.classList.add("active");
    }
  });
}

// Appel des fonctions au chargement de la page
(async function () {
  await displayWorks();
  await displayFilters();
})();