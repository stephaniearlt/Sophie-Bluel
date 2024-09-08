////// ELEMENTS REUTILISABLES ////////
const token = localStorage.getItem("token");

// Constantes URLs API
const API_BASE_URL = "http://localhost:5678/api";
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const WORKS_URL = `${API_BASE_URL}/works`;

// Constantes diverses
const body = document.querySelector("body");
const gallery = document.querySelector(".gallery");
const modal = document.querySelector("#modal");
const modalWrapperAdd = document.querySelector(".modal-wrapper-add");
const modalWrapperDelete = document.querySelector(".modal-wrapper-delete");
const overlay = document.querySelector(".overlay");
let categories = [];
let works = [];

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
  // Supprime le token du local storage
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

// Ouverture de la modale de suppression
const editButtonGallery = document.querySelector("#edit-button");
if (editButtonGallery) {
  editButtonGallery.addEventListener("click", function () {
    openModal(modalWrapperDelete);
    modalDelete(works);
  });
}

// Fonction pour ouvrir une modale spécifique
function openModal(modalWrapper) {
  closeModal();
  modal.classList.add("active");
  modalWrapper.classList.add("active");
}

// Fermeture des modales
function closeModal() {
  modal.classList.remove("active");
  modalWrapperDelete.classList.remove("active");
  modalWrapperAdd.classList.remove("active");
  modalWrapperDelete.innerHTML = "";
  modalWrapperAdd.innerHTML = "";
}

// Gestion de l'overlay
overlay.addEventListener("click", closeModal);

// Création du bouton de fermeture
function createCloseButton() {
  const closeButton = document.createElement("i");
  closeButton.classList.add("fa-solid", "fa-xmark", "close-modal");
  closeButton.addEventListener("click", closeModal);
  return closeButton;
}

// Création du bouton de retour
function createBackButton() {
  const backButton = document.createElement("i");
  backButton.classList.add("fa-solid", "fa-arrow-left", "back-modal");
  backButton.addEventListener("click", function () {
    openModal(modalWrapperDelete);
    modalDelete(works);
  });
  return backButton;
}

// Création contenu "modalDelete"
function modalDelete(works) {
  modalWrapperDelete.innerHTML = "";

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
  addPhoto.addEventListener("click", () => {
    openModal(modalWrapperAdd);
    modalAddPhoto();
  });

  // Hiérarchisation des éléments
  modalWrapperDelete.appendChild(createCloseButton());
  modalWrapperDelete.appendChild(modalTitle);
  modalWrapperDelete.appendChild(modalGallery);
  modalWrapperDelete.appendChild(addPhoto);

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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (response.ok) {
    // Suppression réussie
    work.parentElement.remove();
    fetchWorks(); // Mise à jour de la galerie principale
  } else {
    console.error("Erreur de suppression");
  }
}

// Création contenu "modalAdd"
function modalAddPhoto() {
  modalWrapperAdd.innerHTML = "";

  // Titre
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = "Ajout photo";

  // Formulaire
  const form = document.createElement("form");
  form.classList.add("form-add");
  form.id = "form-add-photo";

  // Bouton de soumission
  const submitButton = document.createElement("button");
  submitButton.classList.add("submit-add-button");
  submitButton.innerText = "Valider";

  // Écouteur d'événement sur le bouton "Valider"
  submitButton.addEventListener("click", function (event) {
    console.log("Le bouton 'Valider' a été cliqué.");
  });

  // Ajout des éléments au formulaire
  const imageInput = createImageInput();
  form.appendChild(imageInput.container);
  form.appendChild(imageInput.input);
  form.appendChild(createTitleInput());
  form.appendChild(createCategoryDropdown());
  form.appendChild(submitButton);

  // Hiérarchisation des éléments dans la modale
  modalWrapperAdd.appendChild(createCloseButton());
  modalWrapperAdd.appendChild(createBackButton());
  modalWrapperAdd.appendChild(modalTitle);
  modalWrapperAdd.appendChild(form);

  // Écouteurs d'événements pour la validation du formulaire
  form.addEventListener("submit", handleValidation);
  form.querySelector("#title").addEventListener("input", checkFormCompletion);
  form
    .querySelector("#category")
    .addEventListener("change", checkFormCompletion);
  form.querySelector("#image").addEventListener("change", checkFormCompletion);
}

// Création d'input pour l'image
function createImageInput() {
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  // Icône photo
  const uploadIcon = document.createElement("span");
  uploadIcon.classList.add("uploadImg");
  const uploadIconImage = document.createElement("i");
  uploadIconImage.classList.add("fa-regular", "fa-image");
  uploadIcon.appendChild(uploadIconImage);

  // Label et instructions
  const label = document.createElement("label");
  label.htmlFor = "image";
  label.textContent = "+ Ajouter photo";

  const fileHint = document.createElement("p");
  fileHint.innerText = "jpg. png. : 4mo max";

  // Ajout des éléments au conteneur d'image
  imageContainer.appendChild(uploadIcon);
  imageContainer.appendChild(label);
  imageContainer.appendChild(fileHint);

  // Input pour le téléchargement de l'image
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "image";
  imageInput.name = "image";
  imageInput.accept = "image/*";
  imageInput.classList.add("image-input");

  return { container: imageContainer, input: imageInput };
}

// Création d'input pour le titre
function createTitleInput() {
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = "title";
  titleInput.name = "title";
  titleInput.classList.add("title-input");

  const label = document.createElement("label");
  label.htmlFor = "title";
  label.textContent = "Titre";

  titleContainer.appendChild(label);
  titleContainer.appendChild(titleInput);

  return titleContainer;
}

// Création liste déroulante pour catégorie
function createCategoryDropdown() {
  const categoryContainer = document.createElement("div");
  categoryContainer.classList.add("category-container");

  const categorySelect = document.createElement("select");
  categorySelect.id = "category";
  categorySelect.name = "category";
  categorySelect.classList.add("category-dropdown");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  categorySelect.appendChild(emptyOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  const label = document.createElement("label");
  label.htmlFor = "category";
  label.textContent = "Catégorie";

  categoryContainer.appendChild(label);
  categoryContainer.appendChild(categorySelect);

  return categoryContainer;
}

// Sélection d'un fichier image
document.addEventListener("change", function (event) {
  if (event.target.matches(".image-input")) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const reader = new FileReader();
    const imageContainer = document.querySelector(".image-container");

    // Vérifie la taille du fichier
    if (file && file.size <= 4 * 1024 * 1024) {
      reader.addEventListener("load", () => {
        // Affiche l'aperçu de l'image chargée
        imageContainer.innerHTML = "";
        const imagePreview = document.createElement("img");
        imagePreview.classList.add("img-preview", "visible");
        imagePreview.src = reader.result;
        imageContainer.appendChild(imagePreview);
        console.log("Image chargée:", file.name);

        checkFormCompletion();
      });
      reader.readAsDataURL(file);
    } else if (file) {
      alert("La taille du fichier doit être inférieure à 4 Mo");
    }
  }
});

// Message d'erreur
function createErrorMessage() {
  const errorMessageDiv = document.createElement("div");
  errorMessageDiv.classList.add("error-message");
  document.body.appendChild(errorMessageDiv);
}

// Vérifie si la div d'erreur existe déjà, sinon la crée
function checkOrCreateErrorMessage() {
  if (!document.querySelector(".error-message")) {
    createErrorMessage();
  }
}

// Validation du formulaire "côté client" avec affichage des erreurs
function checkFormCompletion() {
  // Vérifie ou crée la div d'erreur
  checkOrCreateErrorMessage();

  // Sélection des éléments et vérification
  const title = document.querySelector(".title-input").value;
  const category = document.querySelector(".category-dropdown").value;
  const formImg = document.querySelector(".image-input").files.length > 0;
  const submitBtn = document.querySelector(".submit-add-button");
  const errorMessage = document.querySelector(".error-message");

  if (title && category && formImg) {
    console.log("Tous les champs sont remplis.");
    submitBtn.disabled = false;
    submitBtn.classList.add("active");
    errorMessage.textContent = ""; // Efface le message d'erreur s'il est affiché
  } else {
    console.log("Au moins un champ est vide.");
    submitBtn.disabled = false; // Le bouton reste actif même s'il y a des champs manquants
    submitBtn.classList.remove("active");
    errorMessage.textContent =
      "Veuillez remplir tous les champs et sélectionner une image.";
  }
}

// Envoi des nouvelles données
function handleValidation(event) {
  console.log("Soumission du formulaire");
  event.preventDefault();

  // Vérification des champs requis "coté serveur"
  const title = document.querySelector(".title-input").value;
  const category = document.querySelector(".category-dropdown").value;
  const formImg = document.querySelector(".image-input").files[0];
  console.log("Titre:", title);
  console.log("Catégorie:", category);
  console.log("Image:", formImg);

  let errorMessage = "";

  if (!title || !category || !formImg) {
    errorMessage =
      "Veuillez remplir tous les champs et sélectionner une image.";
    console.log("Erreur:", errorMessage);
    alert(errorMessage);
    return;
  }

  // Création de l'objet FormData
  let formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", formImg);

  // Envoi des données à l'API
  fetch(WORKS_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: formData,
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la photo");
      }
      return response.json();
    })
    .then(function (json) {
      console.log("Photo ajoutée avec succès:", json);
      //closeModal();
      modalAddPhoto();
      fetchWorks();
    })
    .catch(function (error) {
      console.error("Erreur lors de l'envoi des données à l'API: ", error);
      alert(
        "Une erreur est survenue lors de l'ajout de la photo. Veuillez réessayer."
      );
    });
}
