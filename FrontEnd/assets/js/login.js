// URL de l'API pour se connecter
const token = localStorage.getItem("token");
const loginUrl = "http://localhost:5678/api/users/login";

if (token) {
  window.location.href = "index.html";
}
// Fonction pour gérer la soumission du formulaire de connexion
function LoginFormSubmission(event) {
  event.preventDefault();

  const loginForm = document.querySelector("#login-form");
  const email = loginForm.querySelector("#email").value;
  const password = loginForm.querySelector("#psw").value;

  // Envoi de la requête POST avec Fetch
  fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur dans l’identifiant ou le mot de passe");
      }
      return response.json();
    })
    .then((data) => {
      // Stockage du token d'authentification dans le local storage
      localStorage.setItem("token", data.token);
      // Redirection vers la page d'accueil
      window.location.href = "index.html";
    })

    .catch((error) => {
      // Affichage du message d'erreur
      alert(error.message);
    });
}

// Ajout de l'écouteur d'événements pour la soumission du formulaire
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", LoginFormSubmission);
