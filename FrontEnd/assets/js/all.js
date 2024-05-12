////// ELEMENTS REUTILISABLES ////////

const token = localStorage.getItem("token");

// Constantes URLs API

const API_BASE_URL = "http://localhost:5678/api";
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const WORKS_URL = `${API_BASE_URL}/works`;

// Constantes réutilisables

const body = document.querySelector("body");
const gallery = document.querySelector(".gallery");
const modal = document.querySelector("#modal");
const modalWrapperAdd = document.querySelector(".modal-wrapper-add");
const modalWrapperDelete = document.querySelector(".modal-wrapper-delete");
let categories = [];
let works = [];
let fileInput;

/////// FONCTIONNALITES PAGE D'ACCUEIL ////////

// Récupération des données de catégories
async function fetchCategories() {
  const response = await fetch(CATEGORIES_URL);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des données depuis ${CATEGORIES_URL}`
    );
  }
  categories = await response.json();
  if (!token) {
    displayFilters();
  }
}
fetchCategories();

// Récupération et affichage des travaux dans la galerie portfolio
async function fetchWorks() {
  const response = await fetch(WORKS_URL);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des données depuis ${WORKS_URL}`
    );
  }
  works = await response.json();
  console.log("Works:", works);
  displayWorks(0);
}
fetchWorks();

// Affichage des travaux selon leur catégorie
async function displayWorks(categoryId) {
  let filteredWorks = works;
  if (categoryId !== 0) {
    filteredWorks = works.filter((work) => work.categoryId === categoryId);
  }
  gallery.innerHTML = "";
  for (let work of filteredWorks) {
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

// Création des boutons de filtre pour chaque catégorie de travaux disponibles
async function displayFilters() {
  categories.unshift({ id: 0, name: "Tous" });
  const portfolio = document.getElementById("portfolio");
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

  // Activation du bouton "Tous" par défaut
  const allButton = document.querySelector(".button-filter[value='0']");
  allButton.classList.add("active");
}

// Filtre des travaux en fonction de leur catégorie
function filterWorks(event) {
  displayWorks(parseInt(event.target.value));

  const buttons = document.querySelectorAll(".button-filter");
  buttons.forEach((button) => {
    button.classList.remove("active");
    if (button.value === event.target.value) {
      button.classList.add("active");
    }
  });
}

/////// MODE EDITION ////////

// Vérifie si l'utilisateur est connecté
function isUserLoggedIn() {
  return token;
}

// Déconnection de l'utilisateur
function logoutUser() {
  // Supprime le token d'authentification du local storage
  localStorage.removeItem("token");
  // Redirection vers la page de connexion
  window.location.href = "index.html";
}

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
      // Si l'utilisateur n'est pas connecté, crée et affiche le lien de connexion
      const loginLink = document.createElement("a");
      loginLink.textContent = "login";
      loginLink.href = "login.html";
      loginNavItem.innerHTML = "";
      loginNavItem.appendChild(loginLink);
    }
  }
}
createLoginLink();

// Affichage mode admin si connexion réussie
if (token) {
  // Création de la bannière
  const bannerTemplate = `<div class="edit-mode-bar"><i class="fas fa-regular fa-pen-to-square"></i><p>Mode édition</p></div>`;
  body.insertAdjacentHTML("afterbegin", bannerTemplate);

  // Création du bouton "modifier"
  const editButtonTemplate = `<a href="#" id="edit-button"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`;
  const galleryTitle = document.querySelector("#portfolio h2");
  galleryTitle.insertAdjacentHTML("afterend", editButtonTemplate);
}

/////// MODALES ////////

// Ouverture
const editButtonGallery = document.querySelector("#edit-button");
if (editButtonGallery) {
  editButtonGallery.addEventListener("click", function () {
    modal.classList.add("active");
    modalDelete(works);
  });
}

// Bouton de fermeture
function createCloseButton() {
  const closeButton = document.createElement("i");
  closeButton.classList.add("fa-solid", "fa-xmark", "close-modal");
  closeButton.addEventListener("click", closeModal);
  return closeButton;
}

// Fermeture
function closeModal() {
  modalWrapperDelete.classList.remove("active");
  modalWrapperAdd.classList.remove("active");
  modal.classList.remove("active");
  modalWrapperDelete.innerHTML = "";
  modalWrapperAdd.innerHTML = "";
}

// Gestion de l'overlay
const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", closeModal);

// Icone de retour en arrière
function createBackButton() {
  const backButton = document.createElement("i");
  backButton.classList.add("fa-solid", "fa-arrow-left", "back-modal");
  backButton.addEventListener("click", switchToModalDelete);
  return backButton;
}

// Bascule vers la modale delete
function switchToModalDelete() {
  modalWrapperAdd.innerHTML = "";
  modalDelete(works);
  modalWrapperDelete.classList.add("active");
  modalWrapperAdd.classList.remove("active");
}

// Création contenu "modalDelete"
function modalDelete(works) {
  const modal = document.querySelector(".modal-wrapper-delete");
  modal.innerHTML = "";

  // Titre
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = "Galerie photo";

  // Conteneur galerie
  const modalGallery = document.createElement("div");
  modalGallery.setAttribute("id", "modal-gallery");

  // Bouton "Ajouter une photo"
  const addPhoto = document.createElement("button");
  addPhoto.classList.add("add-photo-button");
  addPhoto.innerText = "Ajouter une photo";
  addPhoto.addEventListener("click", modalAddPhoto);

  // Hiérarchisation des éléments
  modal.appendChild(createCloseButton());
  modal.appendChild(modalTitle);
  modal.appendChild(modalGallery);
  modal.appendChild(addPhoto);

  // Utilisation des données déjà récupérées pour afficher les travaux
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.setAttribute("crossorigin", "anonymous");
    image.setAttribute("src", work.imageUrl);
    image.alt = work.title;
    image.dataset.id = work.id;

    // Icône poubelle
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa", "fa-trash-alt", "delete-icon");
    deleteIcon.addEventListener("click", () => {
      console.log("Clic sur l'icône de poubelle");
      deleteWork(image);
    });

    figure.appendChild(image);
    figure.appendChild(deleteIcon);
    modalGallery.appendChild(figure);
  });
}

// Suppression d'un projet
async function deleteWork(work) {
  const workId = work.dataset.id;
  const response = await fetch(`${WORKS_URL}/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.ok) {
    if (response.status === 204) {
      fetchWorks().then(() => {
        modalDelete(works);
      });
    }
  }
}

// Création contenu "modalAddPhoto"
function modalAddPhoto() {
  const modal = document.querySelector(".modal-wrapper-add");

  // Efface le contenu "modal-wrapper-delete" s'il existe
  const modalDelete = document.querySelector(".modal-wrapper-delete");
  if (modalDelete) {
    modalDelete.innerHTML = "";
  }
  modal.innerHTML = "";

  // Titre
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = "Ajout photo";

  // Formulaire
  form = document.createElement("form");
  form.setAttribute("action", "");

  // Conteneur téléchargement photo
  const fileContainer = document.createElement("div");
  fileContainer.classList.add("containerFile");

  // Icône photo
  const uploadIcon = document.createElement("span");
  uploadIcon.classList.add("uploadImg");
  const uploadIconImage = document.createElement("i");
  uploadIconImage.classList.add("fa-regular", "fa-image");
  uploadIcon.appendChild(uploadIconImage);

  // Label champ téléchargement
  const fileLabel = document.createElement("label");
  fileLabel.setAttribute("for", "file");
  fileLabel.innerText = "+ Ajouter photo";

  // Champ téléchargement photo
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.setAttribute("id", "file");
  fileInput.setAttribute("name", "image");
  fileInput.setAttribute("accept", "image/*");

  // Indications
  const fileHint = document.createElement("p");
  fileHint.innerText = "jpg. png. : 4mo max";

  // Conteneur description fichier (titre et catégorie)
  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("descriptionFile");

  // Label et champ de saisie pour le titre de la photo
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.innerText = "Titre";
  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("id", "title");
  titleInput.setAttribute("name", "title");

  // Label et champ de sélection pour la catégorie de la photo
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.innerText = "Catégorie";
  const categorySelect = document.createElement("select");
  categorySelect.setAttribute("id", "selectCategory");

  // Option vide
  const emptyOption = document.createElement("option");
  emptyOption.setAttribute("value", "");
  categorySelect.appendChild(emptyOption);

  // Ajout des options de catégorie depuis les données récupérées
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.setAttribute("value", category.id);
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  // Bouton de validation
  const submitButton = document.createElement("button");
  submitButton.classList.add("btn-modalAddPhoto");
  submitButton.innerText = "Valider";
  submitButton.addEventListener("click", handleValidation);

  // Ajout des éléments au formulaire
  fileContainer.appendChild(uploadIcon);
  fileContainer.appendChild(fileLabel);
  fileContainer.appendChild(fileInput);
  fileContainer.appendChild(fileHint);
  descriptionContainer.appendChild(titleLabel);
  descriptionContainer.appendChild(titleInput);
  descriptionContainer.appendChild(categoryLabel);
  descriptionContainer.appendChild(categorySelect);
  form.appendChild(fileContainer);
  form.appendChild(descriptionContainer);
  form.appendChild(submitButton);

  // Hiérarchisation des éléments
  modal.appendChild(createCloseButton());
  modal.appendChild(createBackButton());
  modal.appendChild(modalTitle);
  modal.appendChild(form);
}

// Sélection d'un fichier image
document.addEventListener("change", function (event) {
  if (event.target.matches("#file")) {
    fileInput = event.target;
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file && file.size <= 4 * 1024 * 1024) {
      reader.addEventListener("load", () => {
        const containerFile = document.querySelector(".containerFile");
        containerFile.innerHTML = "";
        const imagePreview = document.createElement("img");
        imagePreview.classList.add("img-preview", "visible");
        imagePreview.src = reader.result;
        containerFile.appendChild(imagePreview);
      });
      reader.readAsDataURL(file);
    } else if (file) {
      alert("La taille du fichier doit être inférieure à 4 Mo");
    }
  }
});

// Validation formulaire d'ajout de photo
function handleValidation(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const category = document.getElementById("selectCategory").value;

  // Vérifie si l'élément fileInput existe
  if (fileInput) {
    const image = fileInput.files[0];

    // Vérifie si un fichier est sélectionné
    if (image) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("image", image);

      // Envoi des données à l'API
      fetch(WORKS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de la photo");
          }
          return response.json();
        })
        .then((json) => {
          console.log("Photo ajoutée avec succès:", json);
          closeModal();
          fetchWorks();
          handleButtonStyle();
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    } else {
      alert("Veuillez sélectionner une image.");
    }
  } else {
    alert("Erreur: Impossible de trouver l'élément 'file'.");
  }
}

// Changement style bouton formulaire validé
function handleButtonStyle() {
  const submitButton = document.querySelector(".btn-modalAddPhoto");
  if (submitButton) {
    submitButton.style.backgroundColor = "#1d6154";
  }
}
handleButtonStyle(true);
