// URL de l'API pour récupérer les catégories
const categoriesUrl = "http://localhost:5678/api/categories";
// URL de l'API pour récupérer les projets
const worksUrl = "http://localhost:5678/api/works";

// Élément de la galerie où l'on souhaite ajouter les filtres de catégories
const portfolioSection = document.querySelector("#portfolio");
// Élément de la galerie où l'on souhaite ajouter les projets
const gallery = document.querySelector("#portfolio .gallery");

///////////// CRÉATION DE LA PAGE DE PRÉSENTATION DES TRAVAUX /////////////

/////// FONCTIONNALITÉ TRI PAR CATÉGORIE ////////

// Fonction pour créer les boutons de catégories
function createCategoryButtons(categories) {
  const categoryButtonsContainer = document.createElement("div");
  categoryButtonsContainer.id = "categoryButtonsContainer";

  // Création du bouton "Tous"
  const allProjectsButton = document.createElement("button");
  allProjectsButton.textContent = "Tous";
  allProjectsButton.setAttribute("data-category-id", "");
  allProjectsButton.classList.add("category-button");

  // Écouteur d'évènement pour filtrer les projets au clic sur le bouton "tous"
  allProjectsButton.addEventListener("click", () =>
    filterProjectsByCategory("")
  );

  // Ajout du bouton à son conteneur
  categoryButtonsContainer.appendChild(allProjectsButton);

  // Création des boutons pour chaque catégorie
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.textContent = category.name;
    categoryButton.setAttribute("data-category-id", category.id);
    categoryButton.classList.add("category-button");

    // Écouteur d'évènement pour filtrer les projets au clic sur le bouton
    categoryButton.addEventListener("click", function () {
      const categoryId = this.getAttribute("data-category-id");
      filterProjectsByCategory(categoryId);
    });

    categoryButtonsContainer.appendChild(categoryButton);
  });

  // Pour que les boutons apparaissent en dessous du titre
  portfolioSection
    .querySelector("h2")
    .insertAdjacentElement("afterend", categoryButtonsContainer);
}

// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(categoryId) {
  const projects = document.querySelectorAll(".gallery figure");

  projects.forEach((project) => {
    const projectCategoryId = project.dataset.categoryId;

    if (categoryId === "" || projectCategoryId === categoryId) {
      project.style.display = "block";
    } else {
      project.style.display = "none";
    }
  });

  // Retire la classe 'clicked' de tous les boutons
  document.querySelectorAll(".category-button").forEach((btn) => {
    btn.classList.remove("clicked");
  });

  // Ajoute la classe 'clicked' au bouton cliqué
  if (categoryId !== "") {
    const clickedButton = document.querySelector(
      `.category-button[data-category-id="${categoryId}"]`
    );
    clickedButton.classList.add("clicked");
  } else {
    // Si categoryId est vide (bouton "Tous" cliqué), ajoute la classe 'clicked' au bouton "Tous"
    const allProjectsButton = document.querySelector(
      `.category-button[data-category-id=""]`
    );
    allProjectsButton.classList.add("clicked");
  }
}

// Fonction pour récupérer les catégories depuis l'API et créer les boutons correspondants
function fetchCategoriesAndCreateButtons() {
  fetch(categoriesUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      return response.json();
    })
    .then((categories) => {
      createCategoryButtons(categories);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories :", error);
    });
}

/////// FONCTIONNALITÉ RÉCUPÉRATION DES PROJETS ////////

// Fonction pour récupérer les projets depuis l'API et les afficher
function fetchProjectsAndDisplay() {
  fetch(worksUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des projets");
      }
      return response.json();
    })
    .then((projects) => {
      projects.forEach((project) => {
        const projectFigure = document.createElement("figure");
        projectFigure.setAttribute("data-category-id", project.categoryId);

        const projectImg = document.createElement("img");
        projectImg.src = project.imageUrl;
        projectImg.alt = project.title;

        const projectCaption = document.createElement("figcaption");
        projectCaption.textContent = project.title;

        projectFigure.appendChild(projectImg);
        projectFigure.appendChild(projectCaption);

        gallery.appendChild(projectFigure);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets :", error);
    });
}

// Appel des fonctions au chargement de la page
fetchCategoriesAndCreateButtons();
fetchProjectsAndDisplay();
