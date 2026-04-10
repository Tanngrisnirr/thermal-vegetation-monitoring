# Thermal Vegetation Monitoring - Notes de Projet

## Date: 2026-04-08

## Emplacement du projet
`/var/mnt/DATUX/Documents/WEB/thermal-vegetation-monitoring/`

## Structure
```
thermal-vegetation-monitoring/
├── webapp/
│   └── index.html              # Application web complète (1675 lignes)
├── thermal_veg/                # Package Python
│   ├── __init__.py
│   ├── io.py                   # Chargement images
│   ├── temperature.py          # Extraction température (calibration Noyafa)
│   ├── zones.py                # Gestion zones polygonales
│   ├── stats.py                # Analyse statistique
│   └── timeseries.py           # Séries temporelles
├── docs/
│   └── NOYAFA_THERMAL_FORMAT.md  # Documentation format binaire
├── tests/                      # Fichiers d'export de test
├── README.md
├── NOTES_PROJET.md             # Ce fichier
├── HUMANS.txt
└── requirements.txt
```

---

## Application Web (webapp/index.html)

### Fonctionnalités implémentées
- **Chargement d'images** : multiple, avec vignettes et badge zone count
- **Dessin de polygones** : clic pour ajouter points, double-clic pour fermer
- **Édition des vertices** : mode "Edit" pour déplacer les points
- **Sélection/Suppression** : mode "Select" + touche Delete
- **Affichage température** : position curseur en temps réel
- **Statistiques** : min, max, mean, std par image (zone incluse)
- **Export/Import JSON/CSV** : avec timestamp, métadonnées appareil, stats température
- **Détection appareil** : Noyafa NF-521 détecté via signature "dyts" dans APP2
- **Zoom/Pan** : molette pour zoom, Space+drag ou middle-click pour pan
- **Undo/Redo** : historique complet avec Ctrl+Z / Ctrl+Y
- **Mesures** : Point (température), Ligne (distance + profil), Aire (temp moyenne)
- **Histogramme** : distribution de température interactive
- **Raccourcis clavier** : 1-6 pour outils, +/- zoom, ? pour aide

### Style des polygones
- **Tous les polygones** : remplissage noir semi-transparent, bordure blanche
- **Sélectionné** : bordure plus épaisse (4px vs 2px)
- **Vertices** : cercles noirs avec bordure blanche
- **Mode édition** : vertices plus grands (8px)

---

## Caméra Noyafa NF-521

### Structure des fichiers JPEG
```
Offset 20:    APP2 "dyts" (1642 bytes) - Métadonnées appareil
Offset 1664:  APP2 (65535 bytes) - Données thermiques brutes segment 1
Offset 67201: APP2 (32773 bytes) - Données thermiques brutes segment 2
```

### Métadonnées APP2 "dyts"
```
Offset 0x030: "CA10DYTCA10DJK010010CA10D1234567" (code interne, pas le nom du modèle)
Offset 0x084: "sensor1234567890"
Offset 0x0E8: "lensName=CA10D12..."
Offset 0x118: 55.5 (float32 LE) - Plage caméra MAX
Offset 0x11C: 33.3 (float32 LE) - Plage caméra MIN
Offset 0x120: 88.8 (float32 LE) - Paramètre inconnu
Offset 0x128: 77.7 (float32 LE) - Paramètre inconnu
```

### Données thermiques brutes
- Format: **16-bit little-endian** (2 bytes par pixel)
- Plage observée: **15431 - 24652** (raw values)
- Image: 1412 x 1059 pixels

### Affichage température sur les images
- **Max** : texte ROUGE avec bordure blanche
- **Min** : texte BLEU avec bordure blanche
- Position: probablement en haut ou bas de l'image

---

## FORMULE DE CALIBRATION CORRIGÉE ✓

### Calibration en deux étapes pour Noyafa NF-521

**Étape 1: Extraire la plage de température par image du segment DYTS**
```
v1c = uint16_LE @ offset 0x1C dans DYTS
v1e = uint16_LE @ offset 0x1E dans DYTS

temp_max = 0.015594 * v1c - 272.55
temp_min = 0.015772 * v1e - 275.86
```

**Étape 2: Convertir les valeurs raw en température**
```
temp_C = temp_min + (raw - 15432) / (25674 - 15432) * (temp_max - temp_min)
```

**Constantes:**
- **RAW_MIN_REF** = 15432 (correspond à temp_min)
- **RAW_MAX_REF** = 25674 (correspond à temp_max)
- **Plage raw valide** = 15000 - 26000 (filtre bruit/artefacts)

### Vérification sur 4 images
| Image | v1c | v1e | temp_min | temp_max | Erreur max |
|-------|-----|-----|----------|----------|------------|
| 1     | 19600 | 18496 | 15.9°C | 33.1°C | 0.04°C |
| 2     | 19420 | 18644 | 18.2°C | 30.3°C | 0.01°C |
| 3     | 19024 | 18500 | 15.9°C | 24.1°C | 0.02°C |
| 4     | 18964 | 18532 | 16.4°C | 23.2°C | 0.03°C |

### Documentation complète
Voir `docs/NOYAFA_THERMAL_FORMAT.md` pour la documentation détaillée du format.

---

## Code clé pour extraction Noyafa

### JavaScript (dans index.html)
```javascript
function extractNoyafaRawData(bytes) {
    var rawValues = [];
    var i = 1664; // Après premier segment APP2
    while (i < bytes.length - 4) {
        if (bytes[i] === 0xFF && bytes[i+1] === 0xE2) {
            var length = (bytes[i+2] << 8) | bytes[i+3];
            for (var j = i + 4; j < i + 2 + length - 1; j += 2) {
                var val = bytes[j] | (bytes[j+1] << 8);
                if (val > 15000 && val < 25000) {
                    rawValues.push(val);
                }
            }
            i += 2 + length;
        } else {
            i++;
        }
    }
    return rawValues;
}
```

### Python (pour analyse)
```python
import struct

# Lire APP2 segments
with open('image.jpg', 'rb') as f:
    data = f.read()

# Trouver dyts
for i in range(len(data) - 10):
    if data[i:i+2] == b'\xff\xe2' and data[i+4:i+8] == b'dyts':
        # Extraire plage caméra
        temp_offset = i + 4 + 0x118
        temp_max = struct.unpack('<f', data[temp_offset:temp_offset+4])[0]
        temp_min = struct.unpack('<f', data[temp_offset+4:temp_offset+8])[0]
        print(f"Plage caméra: {temp_min}°C - {temp_max}°C")
```

---

## Dépendances installées
```bash
pip3 install --user pillow exifread
```

---

## Autres notes

### TeX Live (pour les lettres de motivation)
- Installation: `/var/mnt/DATUX/Software/texlive/2026/`
- PATH configuré dans `~/.bashrc`
- Wrapper pour Flatpak: `~/.local/bin/pdflatex`

### Firefox Flatpak
- L'app web fonctionne car tout est inline (pas de fichiers JS/CSS externes)
- Les chemins `file:///run/user/1000/doc/...` sont dus au portail Flatpak

---

## Limitation importante: Couleurs vs Niveaux de gris

La plupart des cameras thermiques grand public enregistrent les images avec des palettes de couleurs (iron, rainbow, etc.) plutot que les donnees thermiques brutes. La reconversion de ces images colorisees en valeurs de temperature est inheremment imprecise car:
- Plusieurs valeurs de temperature peuvent correspondre a des couleurs similaires
- La quantification des couleurs fait perdre la precision thermique
- Les variations de palettes entre fabricants ajoutent de l'incertitude

Pour une analyse de temperature precise, utiliser l'echelle de gris plutot que d'autres palettes comme rainbow ou iron.

---

## Prochaines étapes
1. [x] Calibrer la formule raw → température avec vraies valeurs ✓
2. [ ] Optionnel: OCR pour lire automatiquement min/max des images
3. [x] Développer le package Python `thermal_veg/` (fonctions Noyafa ajoutées) ✓
4. [ ] Ajouter analyse de séries temporelles
5. [ ] Documentation README.md

---
