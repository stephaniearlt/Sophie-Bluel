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