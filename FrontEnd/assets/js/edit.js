// Fonction pour vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
  return localStorage.getItem("token");
}

// Fonction pour déconnecter l'utilisateur
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

// Fonction pour activer le mode édition
function enableEditMode() {
  // Masquer les boutons de catégorie si l'utilisateur est connecté
  const categoryButtonsContainer = document.getElementById("categoryButtonsContainer");
  if (categoryButtonsContainer) {
    categoryButtonsContainer.style.display = "none";
  }
}

// Fonction pour désactiver le mode édition
function disableEditMode() {
  // Afficher les boutons de catégorie si l'utilisateur est connecté
  const categoryButtonsContainer = document.getElementById("categoryButtonsContainer");
  if (categoryButtonsContainer) {
    categoryButtonsContainer.style.display = "block";
  }
}

// Création du bandeau de mode édition
function createEditModeBar() {
  const editModeBar = document.createElement("div");
  editModeBar.classList.add("edit-mode-bar");

  // Création de l'icône avec la classe appropriée
  const editIcon = document.createElement("i");
  editIcon.classList.add("far", "fa-pen-to-square");

  const editText = document.createElement("span");
  editText.textContent = "Mode édition";

  // Ajout de l'icône avant le texte
  editModeBar.appendChild(editIcon);
  editModeBar.appendChild(editText);

  return editModeBar;
}

// Insertion du bandeau et activation du mode édition si l'utilisateur est connecté
if (isUserLoggedIn()) {
  const editModeBar = createEditModeBar();
  document.body.insertBefore(editModeBar, document.body.firstChild);
  enableEditMode();
} else {
  // Masquer le bandeau s'il n'est pas connecté
  const editModeBar = document.querySelector(".edit-mode-bar");
  if (editModeBar) {
    editModeBar.style.display = "none";
  }
}

// Fonction pour activer le bouton "Modifier" en mode édition
function enableEditButton() {
  const editButton = document.getElementById("edit-button");
  if (editButton) {
    editButton.style.display = "block";
    editButton.addEventListener("click", handleEditButtonClick);
  }
}

// Fonction pour désactiver le bouton "Modifier"
function disableEditButton() {
  const editButton = document.getElementById("edit-button");
  if (editButton) {
    editButton.removeEventListener("click", handleEditButtonClick);
  }
}

// Fonction à exécuter lorsque le bouton "Modifier" est cliqué
function handleEditButtonClick() {
}

// Activation du bouton "Modifier" en mode édition
if (isUserLoggedIn()) {
  enableEditMode();
  enableEditButton();
} else {
  disableEditMode();
  disableEditButton();
}
