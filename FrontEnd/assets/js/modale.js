///////////// CRÉATION DE LA MODALE GALERIE PHOTO /////////////

// Sélection de la vue 
const galleryView = document.getElementById('gallery-view');

// Éléments de la vue 
const galleryHeading = document.createElement('h3');
galleryHeading.textContent = 'Galerie photo';
galleryView.appendChild(galleryHeading);







///////////// CRÉATION DE LA MODALE AJOUT PHOTO /////////////

// Sélection de la vue
const addPhotoView = document.getElementById('add-photo-view');

// Éléments de la vue 
const heading = document.createElement('h3');
heading.textContent = 'Ajout photo';
addPhotoView.appendChild(heading);