// Récupération des éléments pour la modale
const containerModals = document.querySelector(".containerModals");
const modalGallery = document.querySelector(".modalGallery");
const editButton = document.querySelector(".edit-button");
const closeModalButton = document.querySelector(".closeModal");
const modalContent = document.querySelector(".contentModalGallery");

// Fonction pour ouvrir la modale
function openModal() {
  console.log("Ouverture de la modale"); 
  containerModals.style.display = "block";

   // Charger les images depuis l'API
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
        deleteIcon.addEventListener("click", () => deleteProject(project.id));

        projectContainer.appendChild(imgElement);
        projectContainer.appendChild(deleteIcon);
        modalContent.appendChild(projectContainer);
      });
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
}

// Fonction pour fermer la modale
function closeModal() {
  console.log("Fermeture de la modale"); 
  containerModals.style.display = "none";
}

// Écouteur d'événement pour ouvrir la modale lors du clic sur le bouton "Modifier"
editButton.addEventListener("click", () => {
  console.log("Clic sur le bouton 'Modifier'"); 
  openModal();
});

// Écouteur d'événement pour fermer la modale lors du clic sur le bouton de fermeture
closeModalButton.addEventListener("click", () => {
  console.log("Clic sur le bouton de fermeture"); 
  closeModal();
});

// Ajout de l'événement de clic sur l'élément containerModals
containerModals.addEventListener("click", (event) => {
  // Vérifie si l'élément cliqué est en dehors de la modale
  if (event.target === containerModals) {
    // Ferme la modale
    closeModal();
  }
});