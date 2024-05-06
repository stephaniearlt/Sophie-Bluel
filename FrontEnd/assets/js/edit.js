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