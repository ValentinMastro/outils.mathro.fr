#!/usr/bin/env bash
#
# Déploiement du site « outils.mathro.fr » sur le VPS.
# À lancer depuis la racine du projet, sur le serveur :
#
#     ./deploy.sh
#
# Le script : met à jour le code (git), installe les dépendances, construit le
# site statique, synchronise le résultat vers le dossier servi par nginx,
# installe le vhost et demande un certificat si besoin, puis recharge nginx.

set -euo pipefail

# --- Réglages (surchargeable par variables d'environnement) -----------------
# Dossier servi par nginx (cf. `root` dans le bloc serveur).
TARGET_DIR="${TARGET_DIR:-/var/www/outils}"
# Propriétaire des fichiers déployés (utilisateur nginx).
WWW_USER="${WWW_USER:-http}"
# Nom de domaine servi et fichier de config nginx correspondant.
DOMAIN="${DOMAIN:-outils.mathro.fr}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/conf.d/${DOMAIN}.conf}"
# Adresse utilisée pour l'enregistrement du certificat Let's Encrypt (seulement
# si aucun compte certbot n'existe déjà sur la machine).
CERTBOT_EMAIL="${CERTBOT_EMAIL:-valentinmastro@gmail.com}"
# Mettre à 0 pour sauter le `git pull` (utile si on déploie un état local).
GIT_PULL="${GIT_PULL:-1}"

# Se placer à la racine du projet (dossier du script), quel que soit l'appelant.
cd "$(dirname "$0")"

# sudo seulement si on n'est pas déjà root.
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
	SUDO="sudo"
fi

echo "==> Déploiement vers ${TARGET_DIR}"

# --- 1. Récupérer la dernière version du code -------------------------------
if [ "${GIT_PULL}" = "1" ] && [ -d .git ]; then
	echo "==> git pull"
	git pull --ff-only
fi

# --- 2. Dépendances ---------------------------------------------------------
# `npm ci` = installation propre et reproductible à partir du package-lock.
echo "==> Installation des dépendances (npm ci)"
if [ -f package-lock.json ]; then
	npm ci
else
	npm install
fi

# --- 3. Tests puis construction du site statique ---------------------------
# Un test en échec arrête le déploiement (set -e) : le site en ligne reste intact.
echo "==> Tests (npm test)"
npm test

echo "==> Build (npm run build)"
npm run build

if [ ! -f build/index.html ]; then
	echo "!! Le build a échoué : build/index.html introuvable." >&2
	exit 1
fi

# --- 4. Synchronisation vers le dossier nginx -------------------------------
echo "==> Synchronisation vers ${TARGET_DIR}"
$SUDO mkdir -p "${TARGET_DIR}"
# --delete : retire les anciens assets hashés qui n'existent plus.
$SUDO rsync -a --delete build/ "${TARGET_DIR}/"
$SUDO chown -R "${WWW_USER}:${WWW_USER}" "${TARGET_DIR}"

# --- 5. Vhost nginx ----------------------------------------------------------
if command -v nginx >/dev/null 2>&1; then
	if [ ! -f "${NGINX_CONF}" ]; then
		echo "==> Config nginx absente (${NGINX_CONF}) : installation depuis le dépôt"
		$SUDO cp nginx/"${DOMAIN}".conf "${NGINX_CONF}"
	else
		echo "==> Config nginx déjà présente (${NGINX_CONF})"
	fi

	# --- 6. Certificat TLS ---------------------------------------------------
	# Si aucun certificat n'existe encore pour ce domaine, on en demande un à
	# Let's Encrypt ; certbot réécrit alors ${NGINX_CONF} pour ajouter le bloc
	# 443 et la redirection 80 → 443.
	if [ ! -e "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
		if command -v certbot >/dev/null 2>&1; then
			echo "==> Aucun certificat pour ${DOMAIN} : demande via certbot"
			# certbot --nginx a besoin que le vhost soit chargé.
			if $SUDO nginx -t >/dev/null 2>&1; then
				$SUDO systemctl reload nginx
			fi
			$SUDO certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos \
				-m "${CERTBOT_EMAIL}" --redirect
		else
			echo "!! certbot introuvable : ${DOMAIN} restera servi en HTTP seul." >&2
		fi
	else
		echo "==> Certificat déjà présent pour ${DOMAIN}"
	fi
fi

# --- 7. Reload nginx ---------------------------------------------------------
if command -v nginx >/dev/null 2>&1; then
	echo "==> Vérification de la configuration nginx"
	if $SUDO nginx -t >/dev/null 2>&1; then
		$SUDO systemctl reload nginx && echo "==> nginx rechargé"
	else
		echo "!! nginx -t a échoué : configuration non rechargée (le site reste servi)." >&2
	fi
fi

echo "==> Terminé. Site disponible sur https://${DOMAIN}"
