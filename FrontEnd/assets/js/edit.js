// Fonction pour vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Création du bandeau de mode édition
function createEditModeBar() {
    const editModeBar = document.createElement('div');
    editModeBar.classList.add('edit-mode-bar');

    // Création de l'icône avec la classe appropriée
    const editIcon = document.createElement('i');
    editIcon.classList.add('far', 'fa-pen-to-square');

    const editText = document.createElement('span');
    editText.textContent = 'Mode édition';

    // Ajout de l'icône avant le texte
    editModeBar.appendChild(editIcon);
    editModeBar.appendChild(editText);

    return editModeBar;
}

// Insertion du bandeau si l'utilisateur est connecté
if (isUserLoggedIn()) {
    const editModeBar = createEditModeBar();
    document.body.insertBefore(editModeBar, document.body.firstChild);
}
