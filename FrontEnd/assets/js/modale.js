//////////// CONSTANTES ////////////

// Récupération des éléments pour la modale
const containerModals = document.querySelector(".containerModals");
const modalGallery = document.querySelector(".modalGallery");
const editButton = document.querySelector("#edit-button");
const closeModalButtons = document.querySelectorAll('.closeModal');
const modalContent = document.querySelector(".contentModalGallery");
const addButton = document.querySelector('.btn-modal');
const secondModal = document.querySelector('.modalAddPhoto');
const returnModalButton = document.querySelector(".returnModal");

// Variable pour stocker l'état précédent de la modale
let previousModal = null;

//////////// ECOUTEURS D'EVENEMENTS ////////////

// Pour ouvrir la modale "galerie photo"
editButton.addEventListener("click", () => {
  console.log("Clic sur le bouton 'Modifier'"); 
  openModal();
});

// Pour ouvrir la modale "ajout photo"
addButton.addEventListener('click', () => {
    console.log("Clic sur le bouton 'Ajouter une photo'");

    // Rendre la seconde modale visible
    secondModal.style.display = 'block';
    console.log("Affichage de la seconde modale");

    // Enregistrement de la modale précédente
    previousModal = modalGallery;

    // Masquer la première modale
    modalGallery.style.display = 'none';
    console.log("Masquage de la première modale");

    // Vérifie la valeur de previousModal après l'ouverture de la modale "ajout photo"
    console.log("previousModal après l'ouverture de la modale 'ajout photo':", previousModal);
});

// Bouton de retour modale "ajout photo"
returnModalButton.addEventListener("click", () => {
    console.log("Clic sur le bouton de retour");
    closeModal();
    // Affichage modale "galerie photo" si modale précédente "ajout photo"
    if (previousModal === secondModal) {
        modalGallery.style.display = 'block';
    } else {
        // Affichage modale précédente
        previousModal.style.display = 'block';
    }

    // Vérifie la valeur de previousModal après le clic sur le bouton de retour
    console.log("previousModal après le clic sur le bouton de retour:", previousModal);
});

// Pour fermer les modales
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        closeModal();
    });
});

// Pour fermer les modales en dehors
containerModals.addEventListener("click", (event) => {
  if (event.target === containerModals) {
    closeModal();
  }
});

//////////// FONCTIONS ////////////

// Fonction pour ouvrir la modale "galerie photo"
function openModal() {
    console.log("Ouverture de la modale");
    // Affichage de la modale "galerie photo" si la modale précédente est la modale "ajout photo"
    if (previousModal === secondModal) {
        modalGallery.style.display = "block";
    } else {
        containerModals.style.display = "block";
        modalGallery.style.display = "block";
    }
    // Enregistrement de la modale précédente
    previousModal = modalGallery;
}

// Fonction pour fermer les modales
function closeModal() {
    console.log("Fermeture de la modale");
    // Fermeture de toutes les modales
    containerModals.style.display = "none";
    modalGallery.style.display = "none";
    secondModal.style.display = "none";
}

// Chargement des images depuis l'API
fetch(worksUrl)
  .then((response) => response.json())
    .then((data) => {
      modalContent.innerHTML = "";
      data.forEach((project) => {
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");

        const imgElement = document.createElement("img");
        imgElement.src = project.imageUrl;
        imgElement.alt = project.title;

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa", "fa-trash", "delete-icon");
        deleteIcon.dataset.projectId = project.id; 
         deleteIcon.addEventListener("click", (event) => {
          event.stopPropagation(); 
          const projectId = deleteIcon.dataset.projectId;
          deleteProject(projectId);
        });

        projectContainer.appendChild(imgElement);
        projectContainer.appendChild(deleteIcon);
        modalContent.appendChild(projectContainer);
      });
      addDeleteEventListeners();
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });

// Test suppression sans effectuer l'appel à l'API réel
function deleteProjectTest(projectId) {
  const deleteUrl = `http://localhost:5678/api/works/${projectId}`;
  console.log("Appel à l'URL de suppression :", deleteUrl);

  // Simulation du succès
  console.log("Suppression réussie pour le projet avec l'ID :", projectId);
  openModal(); // Réouverture de la modale
}

function addDeleteEventListeners() {
  const deleteIcons = document.querySelectorAll('.delete-icon');
  deleteIcons.forEach(icon => {
    icon.addEventListener('click', (event) => {
      event.stopPropagation(); // Arrête la propagation de l'événement
      const projectId = icon.dataset.projectId;
      deleteProjectTest(projectId); // Utilise la fonction de test
    });
  });
}

// PAUSE POUR TEST //
/*
// Fonction pour supprimer un projet
function deleteProject(projectId) {
  const deleteUrl = `http://localhost:5678/api/works/${projectId}`;
  const token = localStorage.getItem("token"); // Récupère le jeton d'authentification

  fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  })
  .then(response => {
    if (response.ok) {
      openModal();
    } else {
      console.error('Erreur lors de la suppression du projet');
    }
  })
  .catch(error => {
    console.error('Une erreur s\'est produite :', error);
  });
}

// Ajoutez un gestionnaire d'événements à chaque icône de poubelle pour détecter le clic de l'utilisateur
function addDeleteEventListeners() {
  const deleteIcons = document.querySelectorAll('.delete-icon');
  deleteIcons.forEach(icon => {
    icon.addEventListener('click', (event) => {
      event.stopPropagation(); // Arrête la propagation de l'événement
      const projectId = icon.dataset.projectId;
      deleteProject(projectId);
    });
  });
}
*/