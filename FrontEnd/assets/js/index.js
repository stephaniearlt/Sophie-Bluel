///////////// Récupération des projets provenant de l'API ///////////// 

// URL de l'API
const worksUrl = 'http://localhost:5678/api/works';

// Élément de la gallerie où l'on souhaite ajouter les projets
const gallery = document.querySelector('#portfolio .gallery');

// Appel de l'API et affichage dynamique
function fetchProjects() {
    fetch(worksUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des projets');
            }
            return response.json();
        })
        .then(projects => {
            // Pour chaque projet récupéré, nous créons l'élément HTML qui lui correspond
            projects.forEach(project => {
                const projectFigure = document.createElement('figure');
                const projectImg = document.createElement('img');
                const projectCaption = document.createElement('figcaption');

                projectImg.src = project.imageUrl;
                projectImg.alt = project.title;
                projectCaption.textContent = project.title;

                projectFigure.appendChild(projectImg);
                projectFigure.appendChild(projectCaption);

                gallery.appendChild(projectFigure);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des projets :', error);
        })
}

// Appel de la fonction au chargement de la page
fetchProjects();

// Suppression du HTML les travaux pré-existants
gallery.innerHTML = '';