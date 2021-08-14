# khalidouarga_7_20210807

## Projet d'application - réseau social

* Base de donnée : MySQL
* Back : Node-Express-mysql
* Front : React


### INSTALLATION :

1. Créez la base de donnée Mysql
	* -> le fichier sql se trouve dans le dossier database
	* /!\ Ligne 25, configurez un mot de passe pour l'administrateur !
	* Lancez votre serveur mysql XAmp/Mamp/Lamp ... ou je ne sais quel Amp

2. Installez l'API (backend)
	* Lancez Visual Studio depuis le dossier `/backend`,
	* Ouvrez le fichier `/config/.env`
	* Insérez votre mot de passe précédemment rempli pour vous connecter à la base de donnée
	* Depuis le terminal, executez `npm install`
	* Une fois les modules de node installés, vous pouvez lancer le serveur
	* -> `npm start`

3. Installez l'application client (frontend)
	* Lancez Visual Studio depuis le dossier `/frontend`,
	* `npm install` ...
	* dans le fichier .env vous pouvez (re)configurer l'url et le port du serveur (pour la connection à l'API)
	* ... `npm start`



##### Les images seront stockées dans 2 dossiers distincts sur le serveur :
* `/images/users/` pour les avatars des utilisateurs
* `/images/posts/` pour les images publiées



##### Depuis PostMan, on peut éxécuter une commande **dump** pour sauvegarder la base de donnée.
* Il faut au préalable s'authentifier avec une requête signin en tan qu'administrateur.
* La sauvegarde est stockée dans le dossier `/sqldump` de l'API.
* *Cependant, on peut tout aussi bien faire une sauvegarde depuis le serveur mysql.*
