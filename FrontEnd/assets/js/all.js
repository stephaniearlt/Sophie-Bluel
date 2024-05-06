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

/////// MODE EDITION ////////

// Vérifie si l'utilisateur est connecté
function isUserLoggedIn() {
  return localStorage.getItem("token");
}

// Déconnection de l'utilisateur
function logoutUser() {
  // Supprime le token d'authentification du local storage
  localStorage.removeItem("token");
  // Redirection vers la page de connexion
  window.location.href = "index.html";
}

// Appel de la fonction pour créer le lien de connexion ou de déconnexion
createLoginLink();

// Création du lien de connexion ou de déconnexion
function createLoginLink() {
  const loginNavItem = document.querySelector("#login-link");

  if (loginNavItem) {
    if (isUserLoggedIn()) {
      const logoutLink = document.createElement("a");
      logoutLink.textContent = "logout";
      logoutLink.href = "#";
      logoutLink.addEventListener("click", logoutUser);

      // Remplace le contenu du lien de déconnexion
      loginNavItem.innerHTML = "";
      loginNavItem.appendChild(logoutLink);
    } else {
      // Si l'utilisateur n'est pas connecté, affiche le lien de connexion
      loginNavItem.innerHTML = '<a href="login.html">login</a>';
    }
  }
}

// Affichage mode admin si connexion réussie
function adminMode() {
  if (localStorage.getItem("token")) {
    // Création de la bannière
    const bannerTemplate = `<div class="edit-mode-bar"><i class="fas fa-regular fa-pen-to-square"></i><p>Mode édition</p></div>`;
    const body = document.querySelector("body");
    body.insertAdjacentHTML("afterbegin", bannerTemplate);
    // Création du bouton modifier
    const editButtonTemplate = `<a href="#" id="edit-button"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`;
    // Positionnement du bouton modifier
    const galleryTitle = document.querySelector("#portfolio h2");
    galleryTitle.insertAdjacentHTML("afterend", editButtonTemplate);
    // Ajout d'un href="#modal" sur le bouton modifier de la galerie
    const editButtonGallery = document.querySelector("#portfolio a");
    editButtonGallery.href = "#modal";
    editButtonGallery.classList.add("open-modal");
  }
}

adminMode();

/////// MODALES ////////

// Fonction pour afficher les projets dans la galerie
async function displayProjectsInModal(container) {
  try {
    const works = document.querySelectorAll(".gallery img");
    works.forEach((work, index) => {
      // Crée une figure pour chaque projet
      const figure = document.createElement("figure");

      // Crée l'image du projet
      const image = document.createElement("img");
      image.setAttribute("crossorigin", "anonymous");
      image.setAttribute("src", work.getAttribute("src"));
      image.alt = work.alt;
      image.dataset.id = index + 1; 

      // Crée l'icône de poubelle 
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa", "fa-trash-alt", "delete-icon");
      deleteIcon.addEventListener("click", () => deleteWork(image)); 

      // Ajoute l'image et l'icône de poubelle 
      figure.appendChild(image);
      figure.appendChild(deleteIcon);

      // Ajoute la figure à la galerie
      container.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors de l'affichage des projets dans la modale :", error);
  }
}

// Fonction pour gérer la suppression d'un projet
async function deleteWork(work) {
  try {
    const workId = work.dataset.id; 
    const response = await fetch(`${WORKS_URL}/${workId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      // Si la suppression est réussie, actualisation de l'affichage dans la modale et dans la galerie du portfolio
      await displayWorks();
      const modalGallery = document.querySelector(".modal-wrapper-delete #modal-gallery");
      deleteWorksInModal();
      await displayProjectsInModal(modalGallery);
    } else {
      throw new Error("Erreur lors de la suppression du projet");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
  }
}

// Fonction pour ouvrir la modale
function openModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  // Affiche les projets dans la galerie de la modale
  const containerGallery = document.querySelector(
    ".modal-wrapper-delete #modal-gallery"
  );
  displayProjectsInModal(containerGallery);
}

// Suppression des travaux de la galerie
function deleteWorksInModal() {
  const gallery = document.querySelector(
    ".modal-wrapper-delete #modal-gallery"
  );
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
}

// Fonction pour fermer la modale
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  // Supprime les projets de la galerie de la modale lors de la fermeture
  deleteWorksInModal();
}

// Fermeture au clic sur la croix ou hors de la modale
document.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-wrapper-delete");

  // Vérifie si l'élément cliqué est la croix de fermeture
  if (event.target.matches(".close-modal")) {
    closeModal();
  }

  // Vérifie si l'élément cliqué est en dehors de la modale
  if (!modalContent.contains(event.target) && event.target !== modal) {
    closeModal();
  }
});

// Ouverture au clic sur le bouton modifier
document.addEventListener("click", function (event) {
  if (event.target.matches(".open-modal")) {
    openModal();
  }
});

function modalDeleteWorks() {
  try {
    // Récupération de la modale de suppression des travaux
    const modalWrapper = document.querySelector(".modal-wrapper-delete");

    // Création du bouton de fermeture de la modale
    const closeModalButton = document.createElement("i");
    closeModalButton.classList.add("fa-solid", "fa-xmark", "close-modal");

    // Création du titre de la modale
    const titleModal = document.createElement("h3");
    titleModal.innerText = "Galerie photo";

    // Création du conteneur de la galerie
    const containerGallery = document.createElement("div");
    containerGallery.setAttribute("id", "modal-gallery");

    // Affiche les projets dans la galerie de la modal
    displayProjectsInModal(containerGallery);

    // Création du bouton "Ajouter photo"
    const addWork = document.createElement("button");
    addWork.classList.add("add-photo-button");
    addWork.innerText = "Ajouter une photo";

    // Rattachement des éléments au DOM
    modalWrapper.appendChild(closeModalButton);
    modalWrapper.appendChild(titleModal);
    modalWrapper.appendChild(containerGallery);
    modalWrapper.appendChild(addWork);
  } catch (error) {
    console.error("Erreur lors de l'affichage des travaux dans la modale :", error);
  }
}

// Appel de la fonction pour afficher les travaux dans la modale
modalDeleteWorks();
