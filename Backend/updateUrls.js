const db = require('./models');
const Works = db.works;

async function updateImageUrls() {
  const oldHost = 'http://localhost:5678';
  const newHost = 'https://sophie-bluel-b3tj.onrender.com';

  try {
    // Récupérer toutes les œuvres avec les anciennes URLs
    const works = await Works.findAll({
      where: {
        imageUrl: {
          [db.Sequelize.Op.like]: `${oldHost}%`
        }
      }
    });

    // Mettre à jour les URLs pour chaque œuvre
    for (let work of works) {
      const newUrl = work.imageUrl.replace(oldHost, newHost);
      await work.update({ imageUrl: newUrl });
    }

    console.log(`Mise à jour des URLs réussie pour ${works.length} œuvres`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des URLs :', error);
  }
}

updateImageUrls();
