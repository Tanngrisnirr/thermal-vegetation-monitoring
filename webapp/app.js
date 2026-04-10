/* Thermal Zone Editor - Main Application */

(function() {
'use strict';
// === Internationalization ===
var translations = {
en: {
    title: 'Thermal Zone Editor',
    load: 'Load', import_btn: 'Import', range: 'Range',
    undo: 'Undo', redo: 'Redo', clear: 'Clear',
    select: 'Select', exclusion: 'Exclusion', edit: 'Edit',
    point: 'Point', line: 'Line', area: 'Area',
    images: 'Images', exclusion_zones: 'Exclusion Zones', measurements: 'Measurements',
    no_zones: 'No zones defined', no_measurements: 'No measurements',
    statistics: 'Statistics', load_image: 'Load an image to see statistics',
    hint_select: 'Click zone to select, Delete key to remove',
    hint_exclusion: 'Click to add points, double-click or click first point to close',
    hint_edit: 'Drag vertices to move them',
    hint_point: 'Click to place temperature marker',
    hint_line: 'Click two points to measure distance and temperature',
    hint_area: 'Draw polygon to measure area temperature',
    help_select: 'Select/Delete tool', help_exclusion: 'Exclusion zone tool', help_edit: 'Edit vertices tool',
    keyboard_shortcuts: 'Keyboard Shortcuts', close: 'Close',
    hover_histogram: 'Hover histogram for details',
    load_images_begin: 'Load images to begin',
    no_images_selected: 'No images selected for deletion',
    confirm_delete_images: 'Are you sure you want to delete these {n} image(s)?',
    tip_load: 'Load Images (Ctrl+O)', tip_import: 'Import JSON/CSV',
    tip_min_temp: 'Min temperature', tip_max_temp: 'Max temperature',
    tip_zoom_out: 'Zoom Out (-)', tip_zoom_in: 'Zoom In (+)', tip_zoom_fit: 'Fit (0)',
    tip_undo: 'Undo (Ctrl+Z)', tip_redo: 'Redo (Ctrl+Y)',
    tip_json: 'Export JSON (Ctrl+S)', tip_csv: 'Export CSV',
    tip_help: 'Keyboard Shortcuts (?)', tip_clear: 'Clear Zones',
    tip_select: 'Select/Delete zones (1)', tip_exclusion: 'Draw exclusion zone (2)', tip_edit: 'Edit vertices (3)',
    tip_point: 'Point measurement (4)', tip_line: 'Line measurement (5)', tip_area: 'Area measurement (6)',
    tip_delete_img: 'Delete selected images', tip_select_all: 'Select all', tip_deselect_all: 'Deselect all',
    imported_zones_data: 'Imported zone data for', images_suffix: 'image(s)',
    load_images_prompt: 'Use "Load" button to load these image files:',
    palette: 'Palette', source: 'Source'
},
fr: {
    title: 'Editeur de Zones Thermiques',
    load: 'Charger', import_btn: 'Importer', range: 'Plage',
    undo: 'Annuler', redo: 'Refaire', clear: 'Effacer',
    select: 'Sélect.', exclusion: 'Exclusion', edit: 'Éditer',
    point: 'Point', line: 'Ligne', area: 'Surface',
    images: 'Images', exclusion_zones: 'Zones d\'exclusion', measurements: 'Mesures',
    no_zones: 'Aucune zone définie', no_measurements: 'Aucune mesure',
    statistics: 'Statistiques', load_image: 'Charger une image pour voir les statistiques',
    hint_select: 'Cliquer sur une zone pour sélectionner, Suppr pour effacer',
    hint_exclusion: 'Cliquer pour ajouter des points, double-clic ou premier point pour fermer',
    hint_edit: 'Glisser les sommets pour les déplacer',
    hint_point: 'Cliquer pour placer un marqueur de température',
    hint_line: 'Cliquer deux points pour mesurer distance et température',
    hint_area: 'Dessiner un polygone pour mesurer la température de la zone',
    help_select: 'Outil Sélection/Suppression', help_exclusion: 'Outil Zone d\'exclusion', help_edit: 'Outil Édition des sommets',
    keyboard_shortcuts: 'Raccourcis Clavier', close: 'Fermer',
    hover_histogram: 'Survoler l\'histogramme pour les détails',
    load_images_begin: 'Charger des images pour commencer',
    no_images_selected: 'Aucune image sélectionnée pour suppression',
    confirm_delete_images: 'Êtes-vous sûr de vouloir supprimer ces {n} image(s) ?',
    tip_load: 'Charger Images (Ctrl+O)', tip_import: 'Importer JSON/CSV',
    tip_min_temp: 'Température min', tip_max_temp: 'Température max',
    tip_zoom_out: 'Zoom arrière (-)', tip_zoom_in: 'Zoom avant (+)', tip_zoom_fit: 'Ajuster (0)',
    tip_undo: 'Annuler (Ctrl+Z)', tip_redo: 'Refaire (Ctrl+Y)',
    tip_json: 'Exporter JSON (Ctrl+S)', tip_csv: 'Exporter CSV',
    tip_help: 'Raccourcis Clavier (?)', tip_clear: 'Effacer Zones',
    tip_select: 'Sélectionner/Supprimer zones (1)', tip_exclusion: 'Dessiner zone d\'exclusion (2)', tip_edit: 'Éditer sommets (3)',
    tip_point: 'Mesure ponctuelle (4)', tip_line: 'Mesure linéaire (5)', tip_area: 'Mesure de surface (6)',
    tip_delete_img: 'Supprimer images sélectionnées', tip_select_all: 'Tout sélectionner', tip_deselect_all: 'Tout désélectionner',
    imported_zones_data: 'Données importées pour', images_suffix: 'image(s)',
    load_images_prompt: 'Utilisez "Charger" pour charger ces fichiers image:',
    palette: 'Palette', source: 'Source'
},
pl: {
    title: 'Edytor Stref Termicznych',
    load: 'Wczytaj', import_btn: 'Importuj', range: 'Zakres',
    undo: 'Cofnij', redo: 'Ponów', clear: 'Wyczyść',
    select: 'Wybierz', exclusion: 'Wykluczenie', edit: 'Edytuj',
    point: 'Punkt', line: 'Linia', area: 'Obszar',
    images: 'Obrazy', exclusion_zones: 'Strefy wykluczenia', measurements: 'Pomiary',
    no_zones: 'Brak zdefiniowanych stref', no_measurements: 'Brak pomiarów',
    statistics: 'Statystyki', load_image: 'Wczytaj obraz, aby zobaczyć statystyki',
    hint_select: 'Kliknij strefę, aby wybrać, Delete aby usunąć',
    hint_exclusion: 'Kliknij, aby dodać punkty, podwójne kliknięcie lub pierwszy punkt, aby zamknąć',
    hint_edit: 'Przeciągnij wierzchołki, aby je przesunąć',
    hint_point: 'Kliknij, aby umieścić znacznik temperatury',
    hint_line: 'Kliknij dwa punkty, aby zmierzyć odległość i temperaturę',
    hint_area: 'Narysuj wielokąt, aby zmierzyć temperaturę obszaru',
    help_select: 'Narzędzie Wybór/Usuń', help_exclusion: 'Narzędzie Strefa wykluczenia', help_edit: 'Narzędzie Edycja wierzchołków',
    keyboard_shortcuts: 'Skróty Klawiszowe', close: 'Zamknij',
    hover_histogram: 'Najedź na histogram, aby zobaczyć szczegóły',
    load_images_begin: 'Wczytaj obrazy, aby rozpocząć',
    no_images_selected: 'Nie wybrano obrazów do usunięcia',
    confirm_delete_images: 'Czy na pewno chcesz usunąć te {n} obraz(y)?',
    tip_load: 'Wczytaj obrazy (Ctrl+O)', tip_import: 'Importuj JSON/CSV',
    tip_min_temp: 'Temp. minimalna', tip_max_temp: 'Temp. maksymalna',
    tip_zoom_out: 'Oddal (-)', tip_zoom_in: 'Przybliż (+)', tip_zoom_fit: 'Dopasuj (0)',
    tip_undo: 'Cofnij (Ctrl+Z)', tip_redo: 'Ponów (Ctrl+Y)',
    tip_json: 'Eksportuj JSON (Ctrl+S)', tip_csv: 'Eksportuj CSV',
    tip_help: 'Skróty klawiszowe (?)', tip_clear: 'Wyczyść strefy',
    tip_select: 'Wybierz/Usuń strefy (1)', tip_exclusion: 'Rysuj strefę wykluczenia (2)', tip_edit: 'Edytuj wierzchołki (3)',
    tip_point: 'Pomiar punktowy (4)', tip_line: 'Pomiar liniowy (5)', tip_area: 'Pomiar powierzchni (6)',
    tip_delete_img: 'Usuń wybrane obrazy', tip_select_all: 'Zaznacz wszystko', tip_deselect_all: 'Odznacz wszystko',
    imported_zones_data: 'Zaimportowano dane stref dla', images_suffix: 'obraz(ów)',
    load_images_prompt: 'Użyj "Wczytaj", aby załadować te pliki obrazów:',
    palette: 'Paleta', source: 'Źródło'
}
};
var currentLang = localStorage.getItem('thermalEditorLang') || 'en';
var i18n = translations[currentLang];

function setLanguage(lang) {
currentLang = lang;
i18n = translations[lang];
localStorage.setItem('thermalEditorLang', lang);
applyTranslations();
updateToolHint();
updateZonesList();
updateMeasurementsList();
if (!currentImage) renderEmpty();
}

function applyTranslations() {
// Title
var titleText = document.querySelector('.title-text');
if (titleText) titleText.textContent = i18n.title;
// Buttons and labels with data-i18n
document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (i18n[key]) el.textContent = i18n[key];
});
// Tooltips with data-tip
document.querySelectorAll('[data-tip]').forEach(function(el) {
    var key = el.getAttribute('data-tip');
    if (i18n[key]) el.setAttribute('title', i18n[key]);
});
// Panel headers
var panelHeaders = document.querySelectorAll('.panel h3');
if (panelHeaders[0]) panelHeaders[0].textContent = i18n.images;
if (panelHeaders[1]) panelHeaders[1].textContent = i18n.exclusion_zones;
// Measurements header
var measHeader = document.querySelector('.measurements-section h4');
if (measHeader) measHeader.textContent = i18n.measurements;
// Stats header
var statsHeader = document.querySelector('.stats-panel h4');
if (statsHeader) statsHeader.textContent = i18n.statistics;
// Help modal
var helpTitle = document.querySelector('.modal h2');
if (helpTitle) helpTitle.textContent = i18n.keyboard_shortcuts;
var closeBtn = document.querySelector('.modal .close-btn');
if (closeBtn) closeBtn.textContent = i18n.close;
// Histogram info
document.getElementById('histogramInfo').textContent = i18n.hover_histogram;
}

// === State ===
var canvas, ctx, hiddenCanvas, hiddenCtx, histCanvas, histCtx, container;
var images = [];
var currentImageIndex = -1;
var currentImage = null;
var imageData = null;
var zones = {};
var measurements = {};
var isDrawing = false;
var currentPolygon = [];
var currentLine = [];
var selectedZoneIndex = -1;
var selectedMeasurementIndex = -1;
var tool = 'select';
var tempMin = 15, tempMax = 40;
var dragVertex = null;
var selectedImagesForDelete = [];
var lastSelectedImageIndex = -1;

// Zoom/Pan state
var transform = { scale: 1, offsetX: 0, offsetY: 0 };
var isPanning = false;
var panStart = { x: 0, y: 0 };
var spacePressed = false;

// Undo/Redo state
var history = [];
var historyIndex = -1;
var MAX_HISTORY = 50;

// Histogram state
var histogramData = null;
var histogramBuckets = 60;

// === Initialization ===
document.addEventListener('DOMContentLoaded', init);

function init() {
canvas = document.getElementById('mainCanvas');
ctx = canvas.getContext('2d');
hiddenCanvas = document.createElement('canvas');
hiddenCtx = hiddenCanvas.getContext('2d');
histCanvas = document.getElementById('histogramCanvas');
histCtx = histCanvas.getContext('2d');
container = document.getElementById('canvasContainer');
setupEventListeners();
updateToolHint();
// Delay initial render to ensure container has dimensions
requestAnimationFrame(function() {
    canvas.width = container.clientWidth || 800;
    canvas.height = container.clientHeight || 600;
    renderEmpty();
});
renderHistogramEmpty();
updateUndoRedoButtons();
applyTranslations();
}

function setupEventListeners() {
// File inputs
document.getElementById('imageInput').onchange = function(e) {
    if (e.target.files && e.target.files.length > 0) loadImages(e.target.files);
};
document.getElementById('importInput').onchange = function(e) {
    if (e.target.files && e.target.files.length > 0) importFile(e.target.files[0]);
};

// Buttons
document.getElementById('exportJsonBtn').onclick = exportJSON;
document.getElementById('exportCsvBtn').onclick = exportCSV;
document.getElementById('clearBtn').onclick = clearCurrentZones;
document.getElementById('helpBtn').onclick = function() { document.getElementById('helpModal').classList.add('show'); };
document.getElementById('undoBtn').onclick = undo;
document.getElementById('redoBtn').onclick = redo;
document.getElementById('zoomInBtn').onclick = function() { zoomBy(1.2); };
document.getElementById('zoomOutBtn').onclick = function() { zoomBy(0.8); };
document.getElementById('zoomFitBtn').onclick = zoomFit;

// Temperature range
document.getElementById('tempMin').onchange = function(e) { tempMin = parseFloat(e.target.value); updateStats(); updateHistogram(); };
document.getElementById('tempMax').onchange = function(e) { tempMax = parseFloat(e.target.value); updateStats(); updateHistogram(); };

// Tool selection
document.querySelectorAll('input[name="tool"]').forEach(function(input) {
    input.onchange = function(e) {
        tool = e.target.value;
        updateToolHint();
        cancelDrawing();
        dragVertex = null;
        updateCursor();
        if (currentImage) render();
    };
});

// Canvas events
canvas.onclick = handleClick;
canvas.ondblclick = handleDoubleClick;
canvas.onmousemove = handleMouseMove;
canvas.onmousedown = handleMouseDown;
canvas.onmouseup = handleMouseUp;
canvas.onmouseleave = handleMouseLeave;
canvas.onwheel = handleWheel;
canvas.oncontextmenu = function(e) { e.preventDefault(); };

// Histogram events
histCanvas.onmousemove = handleHistogramHover;
histCanvas.onmouseleave = function() { document.getElementById('histogramInfo').textContent = 'Hover histogram for details'; };

// Keyboard events
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

// Modal close on overlay click
document.getElementById('helpModal').onclick = function(e) {
    if (e.target === this) this.classList.remove('show');
};

// Handle window resize
window.onresize = function() {
    if (currentImage) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        zoomFit();
    }
};

// Language flags
document.querySelectorAll('.lang-flag').forEach(function(btn) {
    if (btn.dataset.lang === currentLang) btn.classList.add('active');
    btn.onclick = function() {
        document.querySelectorAll('.lang-flag').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setLanguage(btn.dataset.lang);
    };
});

// Image selection buttons
document.getElementById('deleteImagesBtn').onclick = confirmDeleteImages;
document.getElementById('selectAllImagesBtn').onclick = selectAllImages;
document.getElementById('deselectAllImagesBtn').onclick = deselectAllImages;
}

// === Undo/Redo System ===
function saveState() {
// Remove any future states if we're not at the end
if (historyIndex < history.length - 1) {
    history = history.slice(0, historyIndex + 1);
}
// Deep copy current state
var state = {
    zones: JSON.parse(JSON.stringify(zones)),
    measurements: JSON.parse(JSON.stringify(measurements)),
    selectedZoneIndex: selectedZoneIndex
};
history.push(state);
if (history.length > MAX_HISTORY) history.shift();
historyIndex = history.length - 1;
updateUndoRedoButtons();
}

function undo() {
if (historyIndex > 0) {
    historyIndex--;
    restoreState(history[historyIndex]);
}
}

function redo() {
if (historyIndex < history.length - 1) {
    historyIndex++;
    restoreState(history[historyIndex]);
}
}

function restoreState(state) {
zones = JSON.parse(JSON.stringify(state.zones));
measurements = JSON.parse(JSON.stringify(state.measurements));
selectedZoneIndex = state.selectedZoneIndex;
render();
updateZonesList();
updateMeasurementsList();
updateStats();
updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
document.getElementById('undoBtn').disabled = historyIndex <= 0;
document.getElementById('redoBtn').disabled = historyIndex >= history.length - 1;
}

// === Zoom/Pan ===
function zoomBy(factor, centerX, centerY) {
var oldScale = transform.scale;
transform.scale = Math.max(0.1, Math.min(10, transform.scale * factor));

// Zoom toward center point
if (centerX !== undefined && centerY !== undefined) {
    transform.offsetX = centerX - (centerX - transform.offsetX) * (transform.scale / oldScale);
    transform.offsetY = centerY - (centerY - transform.offsetY) * (transform.scale / oldScale);
}

updateZoomDisplay();
render();
}

function zoomFit() {
if (!currentImage) return;
var imgW = currentImage.image.width;
var imgH = currentImage.image.height;
var padding = 20;
var scaleX = (canvas.width - padding * 2) / imgW;
var scaleY = (canvas.height - padding * 2) / imgH;
transform.scale = Math.min(scaleX, scaleY, 1);
transform.offsetX = (canvas.width - imgW * transform.scale) / 2;
transform.offsetY = (canvas.height - imgH * transform.scale) / 2;
updateZoomDisplay();
render();
}

function updateZoomDisplay() {
document.getElementById('zoomLevel').textContent = Math.round(transform.scale * 100) + '%';
}

function screenToCanvas(screenX, screenY) {
var rect = canvas.getBoundingClientRect();
return {
    x: (screenX - rect.left - transform.offsetX) / transform.scale,
    y: (screenY - rect.top - transform.offsetY) / transform.scale
};
}

function handleWheel(e) {
e.preventDefault();
var rect = canvas.getBoundingClientRect();
var mouseX = e.clientX - rect.left;
var mouseY = e.clientY - rect.top;
var factor = e.deltaY < 0 ? 1.1 : 0.9;
zoomBy(factor, mouseX, mouseY);
}

// === Tool Hints ===
function updateToolHint() {
var hint = document.getElementById('toolHint');
var hints = {
    'select': i18n.hint_select || 'Click zone to select, Delete key to remove',
    'polygon': i18n.hint_exclusion || 'Click to add points, double-click or click first point to close',
    'edit': i18n.hint_edit || 'Drag vertices to move them',
    'point': i18n.hint_point || 'Click to place temperature marker',
    'line': i18n.hint_line || 'Click two points to measure distance and temperature',
    'area': i18n.hint_area || 'Draw polygon to measure area temperature'
};
hint.textContent = hints[tool] || '';
}

function updateCursor() {
var cursors = {
    'polygon': 'crosshair',
    'edit': 'default',
    'select': 'pointer',
    'point': 'crosshair',
    'line': 'crosshair',
    'area': 'crosshair'
};
canvas.style.cursor = spacePressed ? 'grab' : (cursors[tool] || 'crosshair');
}

// === Rendering ===
function renderEmpty() {
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#555';
ctx.font = '16px sans-serif';
ctx.textAlign = 'center';
ctx.fillText(i18n.load_images_begin || 'Load images to begin', canvas.width / 2, canvas.height / 2);
}

function render() {
if (!currentImage) { renderEmpty(); return; }

// Clear and set transform
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.fillStyle = '#111';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Apply transform
ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.offsetX, transform.offsetY);

// Draw image
ctx.drawImage(currentImage.image, 0, 0);

// Draw zones
var zs = zones[currentImage.name] ? zones[currentImage.name].zones : [];
zs.forEach(function(z, i) { drawPolygon(z.polygon, i === selectedZoneIndex, false); });

// Draw measurements
var ms = measurements[currentImage.name] || [];
ms.forEach(function(m, i) { drawMeasurement(m, i === selectedMeasurementIndex); });

// Draw current polygon being drawn
if (currentPolygon.length > 0) drawCurrentPolygon();

// Draw current line being measured
if (currentLine.length > 0) drawCurrentLine();

// Reset transform
ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawPolygon(poly, selected, isArea) {
if (poly.length < 2) return;
ctx.beginPath();
ctx.moveTo(poly[0][0], poly[0][1]);
for (var i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
ctx.closePath();

ctx.fillStyle = isArea ? 'rgba(52, 152, 219, 0.3)' : (selected ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)');
ctx.fill();
ctx.strokeStyle = isArea ? '#3498db' : '#fff';
ctx.lineWidth = (selected ? 4 : 2) / transform.scale;
ctx.stroke();

// Draw vertices
var vertexRadius = (tool === 'edit' ? 8 : 5) / transform.scale;
poly.forEach(function(p) {
    ctx.beginPath();
    ctx.arc(p[0], p[1], vertexRadius, 0, Math.PI * 2);
    ctx.fillStyle = isArea ? '#3498db' : '#000';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2 / transform.scale;
    ctx.stroke();
});
}

function drawCurrentPolygon() {
var isAreaTool = tool === 'area';
ctx.beginPath();
ctx.moveTo(currentPolygon[0].x, currentPolygon[0].y);
for (var i = 1; i < currentPolygon.length; i++) {
    ctx.lineTo(currentPolygon[i].x, currentPolygon[i].y);
}
ctx.strokeStyle = isAreaTool ? '#3498db' : '#3498db';
ctx.lineWidth = 2 / transform.scale;
ctx.setLineDash([5 / transform.scale, 5 / transform.scale]);
ctx.stroke();
ctx.setLineDash([]);

// Draw vertices
currentPolygon.forEach(function(p, i) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, (i === 0 ? 8 : 5) / transform.scale, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? '#27ae60' : (isAreaTool ? '#3498db' : '#3498db');
    ctx.fill();
});

// Close indicator
if (currentPolygon.length >= 3) {
    ctx.beginPath();
    ctx.arc(currentPolygon[0].x, currentPolygon[0].y, 15 / transform.scale, 0, Math.PI * 2);
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2 / transform.scale;
    ctx.setLineDash([3 / transform.scale, 3 / transform.scale]);
    ctx.stroke();
    ctx.setLineDash([]);
}
}

function drawCurrentLine() {
if (currentLine.length === 0) return;
ctx.beginPath();
ctx.moveTo(currentLine[0].x, currentLine[0].y);
if (currentLine.length > 1) {
    ctx.lineTo(currentLine[1].x, currentLine[1].y);
}
ctx.strokeStyle = '#f39c12';
ctx.lineWidth = 2 / transform.scale;
ctx.stroke();

currentLine.forEach(function(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6 / transform.scale, 0, Math.PI * 2);
    ctx.fillStyle = '#f39c12';
    ctx.fill();
});
}

function drawMeasurement(m, selected) {
var pointColor = selected ? '#ff6b6b' : '#e74c3c';
var lineColor = selected ? '#f5b041' : '#f39c12';
var lineWidth = selected ? 4 : 2;
var vertexRadius = (tool === 'edit' ? 8 : (selected ? 7 : 5)) / transform.scale;

if (m.type === 'point') {
    ctx.beginPath();
    ctx.arc(m.x, m.y, (selected ? 10 : 8) / transform.scale, 0, Math.PI * 2);
    ctx.fillStyle = pointColor;
    ctx.fill();
    ctx.strokeStyle = selected ? '#fff' : '#fff';
    ctx.lineWidth = (selected ? 3 : 2) / transform.scale;
    ctx.stroke();

    // Label
    ctx.font = (12 / transform.scale) + 'px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3 / transform.scale;
    var label = m.temp.toFixed(1) + '°C';
    ctx.strokeText(label, m.x + 12 / transform.scale, m.y + 4 / transform.scale);
    ctx.fillText(label, m.x + 12 / transform.scale, m.y + 4 / transform.scale);
} else if (m.type === 'line') {
    ctx.beginPath();
    ctx.moveTo(m.points[0][0], m.points[0][1]);
    ctx.lineTo(m.points[1][0], m.points[1][1]);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth / transform.scale;
    ctx.stroke();

    m.points.forEach(function(p) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], vertexRadius, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
        if (selected) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2 / transform.scale;
            ctx.stroke();
        }
    });

    // Label at midpoint
    var midX = (m.points[0][0] + m.points[1][0]) / 2;
    var midY = (m.points[0][1] + m.points[1][1]) / 2;
    ctx.font = (11 / transform.scale) + 'px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3 / transform.scale;
    var label = m.distance.toFixed(0) + 'px | ' + m.tempMin.toFixed(1) + '-' + m.tempMax.toFixed(1) + '°C';
    ctx.strokeText(label, midX + 5 / transform.scale, midY - 5 / transform.scale);
    ctx.fillText(label, midX + 5 / transform.scale, midY - 5 / transform.scale);
} else if (m.type === 'area') {
    drawPolygon(m.polygon, selected, true);

    // Label at centroid
    var cx = 0, cy = 0;
    m.polygon.forEach(function(p) { cx += p[0]; cy += p[1]; });
    cx /= m.polygon.length;
    cy /= m.polygon.length;

    ctx.font = (11 / transform.scale) + 'px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3 / transform.scale;
    var label = m.area.toFixed(0) + 'px² | ' + m.tempMean.toFixed(1) + '°C';
    ctx.strokeText(label, cx, cy);
    ctx.fillText(label, cx, cy);
}
}

// === Image Loading ===
function loadImages(files) {
for (var i = 0; i < files.length; i++) {
    (function(file) {
        var binReader = new FileReader();
        binReader.onload = function(binEvent) {
            var bytes = new Uint8Array(binEvent.target.result);
            var deviceInfo = detectDevice(bytes);

            // Extract full raw thermal data for Noyafa
            var thermalData = null;
            if (deviceInfo.detected && deviceInfo.brand === 'Noyafa' && deviceInfo.tempRange) {
                var rawValues = extractNoyafaRawData(bytes, true);
                if (rawValues.length >= 49152) {
                    thermalData = {
                        raw: rawValues,
                        width: 256,
                        height: 192,
                        tempMin: deviceInfo.tempRange.min,
                        tempMax: deviceInfo.tempRange.max
                    };
                }
            }

            var dataReader = new FileReader();
            dataReader.onload = function(dataEvent) {
                var img = new Image();
                img.onload = function() {
                    images.push({
                        name: file.name,
                        image: img,
                        dataUrl: dataEvent.target.result,
                        device: deviceInfo,
                        thermalData: thermalData
                    });
                    if (!zones[file.name]) {
                        zones[file.name] = { image: file.name, width: img.width, height: img.height, zones: [], device: deviceInfo };
                    }
                    if (!measurements[file.name]) {
                        measurements[file.name] = [];
                    }
                    updateThumbnails();
                    if (currentImageIndex === -1) selectImage(0);
                    saveState();
                };
                img.src = dataEvent.target.result;
            };
            dataReader.readAsDataURL(file);
        };
        binReader.readAsArrayBuffer(file);
    })(files[i]);
}
}

function detectDevice(bytes) {
var searchLen = Math.min(bytes.length, 4096);
var header = '';
for (var i = 0; i < searchLen; i++) {
    if (bytes[i] >= 32 && bytes[i] <= 126) header += String.fromCharCode(bytes[i]);
    else header += ' ';
}

var result = { detected: false, brand: null, model: null, hasExif: false, error: null, tempRange: null, tempMeasured: null };

// Check for EXIF
for (var j = 0; j < searchLen - 1; j++) {
    if (bytes[j] === 0xFF && bytes[j+1] === 0xE1) {
        result.hasExif = true;
        break;
    }
}

// Noyafa detection
var TEMP_MAX_SLOPE = 0.015594, TEMP_MAX_OFFSET = -272.55;
var TEMP_MIN_SLOPE = 0.015772, TEMP_MIN_OFFSET = -275.86;
var RAW_MIN_REF = 15432, RAW_MAX_REF = 25674;

for (var m = 0; m < searchLen - 10; m++) {
    if (bytes[m] === 0xFF && bytes[m+1] === 0xE2) {
        if (bytes[m+4] === 0x64 && bytes[m+5] === 0x79 && bytes[m+6] === 0x74 && bytes[m+7] === 0x73) {
            var dytsOffset = m + 4;
            result.detected = true;
            result.brand = 'Noyafa';
            result.model = 'NF-521';

            var calOffset = dytsOffset + 0x1C;
            if (calOffset + 4 < bytes.length) {
                var v1c = bytes[calOffset] | (bytes[calOffset + 1] << 8);
                var v1e = bytes[calOffset + 2] | (bytes[calOffset + 3] << 8);
                var imgTempMax = TEMP_MAX_SLOPE * v1c + TEMP_MAX_OFFSET;
                var imgTempMin = TEMP_MIN_SLOPE * v1e + TEMP_MIN_OFFSET;
                result.tempRange = { min: Math.round(imgTempMin * 10) / 10, max: Math.round(imgTempMax * 10) / 10, v1c: v1c, v1e: v1e };
            }
            break;
        }
    }
}

if (result.detected && result.tempRange) {
    var rawValues = extractNoyafaRawData(bytes);
    if (rawValues.length > 0) {
        var minRaw = Math.min.apply(null, rawValues);
        var maxRaw = Math.max.apply(null, rawValues);
        var imgTempMin = result.tempRange.min;
        var imgTempMax = result.tempRange.max;
        var measuredMin = imgTempMin + (minRaw - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (imgTempMax - imgTempMin);
        var measuredMax = imgTempMin + (maxRaw - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (imgTempMax - imgTempMin);
        result.tempMeasured = { min: Math.round(measuredMin * 10) / 10, max: Math.round(measuredMax * 10) / 10, rawMin: minRaw, rawMax: maxRaw };
    }
}

// Fallback patterns
if (!result.detected) {
    var patterns = [
        { regex: /NF-521/i, brand: 'Noyafa', model: 'NF-521' },
        { regex: /CA10D/i, brand: 'Noyafa', model: 'NF-521' },
        { regex: /FLIR/i, brand: 'FLIR', model: 'Unknown' },
        { regex: /SEEK/i, brand: 'Seek Thermal', model: 'Unknown' },
        { regex: /InfiRay/i, brand: 'InfiRay', model: 'Unknown' }
    ];
    for (var k = 0; k < patterns.length; k++) {
        if (patterns[k].regex.test(header)) {
            result.detected = true;
            result.brand = patterns[k].brand;
            result.model = patterns[k].model;
            break;
        }
    }
}

if (!result.hasExif && !result.detected) {
    result.error = 'No EXIF - possibly stripped';
}

return result;
}

function extractNoyafaRawData(bytes, fullExtract) {
var rawValues = [];
var i = 1664;
var sampleStep = fullExtract ? 1 : 50;
var count = 0;

while (i < bytes.length - 4) {
    if (bytes[i] === 0xFF && bytes[i+1] === 0xE2) {
        var length = (bytes[i+2] << 8) | bytes[i+3];
        for (var j = i + 4; j < i + 2 + length - 1 && j < bytes.length - 1; j += 2) {
            count++;
            if (count % sampleStep === 0) {
                var val = bytes[j] | (bytes[j+1] << 8);
                if (fullExtract) {
                    rawValues.push(val);
                } else if (val >= 15000 && val <= 26000) {
                    rawValues.push(val);
                }
            }
        }
        i += 2 + length;
    } else {
        i++;
    }
}
// For full extract, return only first 256*192 = 49152 values (thermal sensor size)
if (fullExtract && rawValues.length > 49152) {
    rawValues = rawValues.slice(0, 49152);
}
return rawValues;
}

// === Import/Export ===
function importFile(file) {
var reader = new FileReader();
var isCSV = file.name.toLowerCase().endsWith('.csv');
reader.onload = function(e) {
    try {
        if (isCSV) {
            importCSVData(e.target.result);
        } else {
            importJSONData(e.target.result);
        }
    } catch (err) {
        alert('Error importing file: ' + err.message);
    }
};
reader.readAsText(file);
}

function importJSONData(text) {
var data = JSON.parse(text);
if (data.images) {
    var imageNames = Object.keys(data.images);
    var hasEmbeddedImages = imageNames.some(function(fn) {
        return data.images[fn].imageData;
    });

    if (data.temp_range) {
        tempMin = data.temp_range.min;
        tempMax = data.temp_range.max;
        document.getElementById('tempMin').value = tempMin;
        document.getElementById('tempMax').value = tempMax;
    }

    if (hasEmbeddedImages) {
        // Load embedded images
        var loadedCount = 0;
        imageNames.forEach(function(fn) {
            var imgData = data.images[fn];
            if (imgData.imageData) {
                var img = new Image();
                img.onload = function() {
                    images.push({
                        name: fn,
                        image: img,
                        dataUrl: imgData.imageData,
                        device: imgData.device || null
                    });
                    zones[fn] = {
                        image: fn,
                        width: imgData.width || img.width,
                        height: imgData.height || img.height,
                        zones: imgData.zones || [],
                        device: imgData.device || null
                    };
                    measurements[fn] = imgData.measurements || [];
                    loadedCount++;
                    if (loadedCount === imageNames.length) {
                        updateThumbnails();
                        if (currentImageIndex === -1) selectImage(0);
                        saveState();
                        updateZonesList();
                        updateMeasurementsList();
                    }
                };
                img.src = imgData.imageData;
            }
        });
    } else {
        // No embedded images - just load zone data
        imageNames.forEach(function(fn) {
            var imgData = data.images[fn];
            zones[fn] = {
                image: fn,
                width: imgData.width,
                height: imgData.height,
                zones: imgData.zones || [],
                device: imgData.device || null
            };
            measurements[fn] = imgData.measurements || [];
        });
        saveState();
        updateZonesList();
        updateMeasurementsList();
        var msg = (i18n.imported_zones_data || 'Imported zone data for') + ' ' + imageNames.length + ' ' + (i18n.images_suffix || 'image(s)') + '.\n\n';
        msg += (i18n.load_images_prompt || 'Use "Load" button to load these image files:') + '\n';
        msg += imageNames.slice(0, 10).join('\n');
        if (imageNames.length > 10) msg += '\n... +' + (imageNames.length - 10) + ' more';
        alert(msg);
    }
}
}

function importCSVData(text) {
var lines = text.split('\n').filter(function(l) { return l.trim(); });
if (lines.length < 2) { alert('CSV file is empty'); return; }

var headers = parseCSVLine(lines[0]);
var imgIdx = headers.indexOf('image');
var widthIdx = headers.indexOf('width');
var heightIdx = headers.indexOf('height');
var zoneIdIdx = headers.indexOf('zone_id');
var polyIdx = headers.indexOf('polygon_points');

if (imgIdx === -1) { alert('CSV must have "image" column'); return; }

var importedImages = {};
for (var i = 1; i < lines.length; i++) {
    var cols = parseCSVLine(lines[i]);
    var fn = cols[imgIdx];
    if (!fn) continue;

    if (!importedImages[fn]) {
        importedImages[fn] = {
            image: fn,
            width: parseInt(cols[widthIdx]) || 1000,
            height: parseInt(cols[heightIdx]) || 1000,
            zones: []
        };
    }

    if (zoneIdIdx !== -1 && polyIdx !== -1 && cols[zoneIdIdx] && cols[polyIdx]) {
        var polyStr = cols[polyIdx];
        var points = polyStr.split(';').map(function(pt) {
            var xy = pt.split(':');
            return [parseInt(xy[0]), parseInt(xy[1])];
        }).filter(function(p) { return !isNaN(p[0]) && !isNaN(p[1]); });

        if (points.length >= 3) {
            importedImages[fn].zones.push({
                id: cols[zoneIdIdx],
                type: 'exclusion',
                polygon: points
            });
        }
    }
}

var count = 0;
for (var fn in importedImages) {
    zones[fn] = importedImages[fn];
    if (!measurements[fn]) measurements[fn] = [];
    count++;
}

saveState();
updateZonesList();
updateMeasurementsList();
alert((i18n.imported_zones || 'Imported zones for') + ' ' + count + ' ' + (i18n.images_suffix || 'image(s). Load the corresponding images to view.'));
}

function parseCSVLine(line) {
var result = [];
var current = '';
var inQuotes = false;
for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (c === '"') {
        if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
    } else if (c === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
    } else {
        current += c;
    }
}
result.push(current.trim());
return result;
}

function imageToBase64(imgObj) {
var canvas = document.createElement('canvas');
canvas.width = imgObj.image.width;
canvas.height = imgObj.image.height;
var ctx = canvas.getContext('2d');
ctx.drawImage(imgObj.image, 0, 0);
return canvas.toDataURL('image/jpeg', 0.9);
}

function exportJSON() {
if (images.length === 0) { alert('No images loaded'); return; }
var exportImages = {};
images.forEach(function(imgObj) {
    var fn = imgObj.name;
    var tempStats = calcTempStatsForImage(imgObj);
    var device = imgObj.device || { detected: false, brand: null, model: null, error: 'Unknown' };
    exportImages[fn] = {
        image: fn,
        width: zones[fn].width,
        height: zones[fn].height,
        imageData: imageToBase64(imgObj),
        device: {
            detected: device.detected,
            brand: device.brand,
            model: device.model,
            has_exif: device.hasExif,
            temp_range_camera: device.tempRange || null,
            temp_measured: device.tempMeasured || null,
            error: device.error
        },
        temp_stats: tempStats,
        zones: zones[fn].zones,
        measurements: measurements[fn] || []
    };
});
var exportData = { exported_at: new Date().toISOString(), temp_range: {min: tempMin, max: tempMax}, images: exportImages };
var blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
a.download = 'thermal_zones_' + getTimestamp() + '.json';
document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function exportCSV() {
if (images.length === 0) { alert('No images loaded'); return; }
var rows = [['image', 'width', 'height', 'device_brand', 'device_model', 'temp_image_min', 'temp_image_max', 'temp_calc_min', 'temp_calc_max', 'temp_mean', 'temp_std', 'included_percent', 'zone_id', 'zone_type', 'num_vertices', 'area_pixels', 'polygon_points']];
images.forEach(function(imgObj) {
    var fn = imgObj.name;
    var img = zones[fn];
    var totalPixels = img.width * img.height;
    var tempStats = calcTempStatsForImage(imgObj);
    var device = imgObj.device || {};
    var measuredMin = device.tempMeasured ? device.tempMeasured.min : (device.tempRange ? device.tempRange.min : '');
    var measuredMax = device.tempMeasured ? device.tempMeasured.max : (device.tempRange ? device.tempRange.max : '');
    if (img.zones.length === 0) {
        rows.push([fn, img.width, img.height, device.brand || '', device.model || '', measuredMin, measuredMax, tempStats.min, tempStats.max, tempStats.mean, tempStats.std, tempStats.included_percent, '', '', '', '', '']);
    } else {
        img.zones.forEach(function(z) {
            var area = calcArea(z.polygon);
            var pts = z.polygon.map(function(p) { return p[0] + ':' + p[1]; }).join(';');
            rows.push([fn, img.width, img.height, device.brand || '', device.model || '', measuredMin, measuredMax, tempStats.min, tempStats.max, tempStats.mean, tempStats.std, tempStats.included_percent, z.id, z.type, z.polygon.length, Math.round(area), pts]);
        });
    }
});
var csv = rows.map(function(r) {
    return r.map(function(v) {
        var str = String(v === null ? '' : v);
        return (str.indexOf(',') >= 0 || str.indexOf('"') >= 0) ? '"' + str.replace(/"/g, '""') + '"' : str;
    }).join(',');
}).join('\n');
var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
a.download = 'thermal_zones_' + getTimestamp() + '.csv';
document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function getTimestamp() {
var d = new Date();
var pad = function(n) { return n < 10 ? '0' + n : n; };
return d.getFullYear() + '' + pad(d.getMonth() + 1) + pad(d.getDate()) + '_' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
}

// === Thumbnails ===
function updateThumbnails() {
var list = document.getElementById('thumbnailList');
list.innerHTML = '';
images.forEach(function(img, index) {
    var thumb = document.createElement('div');
    var isActive = index === currentImageIndex;
    var isSelectedForDelete = selectedImagesForDelete.indexOf(index) !== -1;
    thumb.className = 'thumbnail' + (isActive ? ' active' : '') + (isSelectedForDelete ? ' selected-for-delete' : '');
    var thumbImg = document.createElement('img');
    thumbImg.src = img.dataUrl;
    thumb.appendChild(thumbImg);
    var zoneCount = zones[img.name] ? zones[img.name].zones.length : 0;
    if (zoneCount > 0) {
        var badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = zoneCount;
        thumb.appendChild(badge);
    }
    thumb.onclick = function(e) { handleThumbnailClick(index, e); };
    list.appendChild(thumb);
});
}

function handleThumbnailClick(index, e) {
if (e.ctrlKey || e.metaKey) {
    // Ctrl+Click: toggle individual selection
    var pos = selectedImagesForDelete.indexOf(index);
    if (pos === -1) {
        selectedImagesForDelete.push(index);
    } else {
        selectedImagesForDelete.splice(pos, 1);
    }
    lastSelectedImageIndex = index;
    updateThumbnails();
} else if (e.shiftKey && lastSelectedImageIndex !== -1) {
    // Shift+Click: range selection
    var start = Math.min(lastSelectedImageIndex, index);
    var end = Math.max(lastSelectedImageIndex, index);
    for (var i = start; i <= end; i++) {
        if (selectedImagesForDelete.indexOf(i) === -1) {
            selectedImagesForDelete.push(i);
        }
    }
    updateThumbnails();
} else {
    // Normal click: select image for viewing and clear delete selection
    selectedImagesForDelete = [];
    lastSelectedImageIndex = index;
    selectImage(index);
}
}

function selectAllImages() {
selectedImagesForDelete = [];
for (var i = 0; i < images.length; i++) {
    selectedImagesForDelete.push(i);
}
updateThumbnails();
}

function deselectAllImages() {
selectedImagesForDelete = [];
lastSelectedImageIndex = -1;
updateThumbnails();
}

function confirmDeleteImages() {
if (selectedImagesForDelete.length === 0) {
    alert(i18n.no_images_selected || 'No images selected for deletion');
    return;
}
var msg = (i18n.confirm_delete_images || 'Are you sure you want to delete these {n} image(s)?').replace('{n}', selectedImagesForDelete.length);
if (confirm(msg)) {
    deleteSelectedImages();
}
}

function deleteSelectedImages() {
// Sort indices in descending order to remove from end first
selectedImagesForDelete.sort(function(a, b) { return b - a; });
selectedImagesForDelete.forEach(function(idx) {
    var imgName = images[idx].name;
    // Remove from zones and measurements
    delete zones[imgName];
    delete measurements[imgName];
    // Remove from images array
    images.splice(idx, 1);
});
selectedImagesForDelete = [];
lastSelectedImageIndex = -1;
// Adjust current image index
if (images.length === 0) {
    currentImageIndex = -1;
    currentImage = null;
    imageData = null;
    renderEmpty();
    updateStats();
    updateHistogram();
} else if (currentImageIndex >= images.length) {
    selectImage(images.length - 1);
} else {
    selectImage(currentImageIndex);
}
updateThumbnails();
updateZonesList();
updateMeasurementsList();
saveState();
}

function selectImage(index) {
if (index < 0 || index >= images.length) return;
currentImageIndex = index;
currentImage = images[index];
cancelDrawing();
selectedZoneIndex = -1;
selectedMeasurementIndex = -1;

// Hidden canvas at image size for pixel data
hiddenCanvas.width = currentImage.image.width;
hiddenCanvas.height = currentImage.image.height;
hiddenCtx.drawImage(currentImage.image, 0, 0);
imageData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);

// Detect color palette
detectedPalette = detectPalette(imageData);

// Main canvas fills container (use clientWidth/Height to exclude border)
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

// Auto-apply temperature range
if (currentImage.device) {
    if (currentImage.device.tempMeasured) {
        tempMin = currentImage.device.tempMeasured.min;
        tempMax = currentImage.device.tempMeasured.max;
    } else if (currentImage.device.tempRange) {
        tempMin = currentImage.device.tempRange.min;
        tempMax = currentImage.device.tempRange.max;
    }
    document.getElementById('tempMin').value = tempMin;
    document.getElementById('tempMax').value = tempMax;
}

// Reset zoom and fit
zoomFit();
updateThumbnails();
updateZonesList();
updateMeasurementsList();
updateStats();
updateHistogram();
}

// === Event Handlers ===
function handleClick(e) {
if (!currentImage || isPanning) return;
var coords = screenToCanvas(e.clientX, e.clientY);

if (tool === 'polygon' || tool === 'area') {
    if (currentPolygon.length >= 3) {
        var first = currentPolygon[0];
        var dist = Math.sqrt(Math.pow(coords.x - first.x, 2) + Math.pow(coords.y - first.y, 2));
        if (dist < 15 / transform.scale) {
            closePolygon();
            return;
        }
    }
    currentPolygon.push(coords);
    isDrawing = true;
    render();
} else if (tool === 'select') {
    // Try to find a measurement first, then a zone
    var foundMeas = findMeasurementAtPoint(coords);
    if (foundMeas !== -1) {
        selectedMeasurementIndex = foundMeas;
        selectedZoneIndex = -1;
    } else {
        selectedZoneIndex = findZoneAtPoint(coords);
        selectedMeasurementIndex = -1;
    }
    render();
    updateZonesList();
    updateMeasurementsList();
} else if (tool === 'point') {
    addPointMeasurement(coords);
} else if (tool === 'line') {
    currentLine.push(coords);
    if (currentLine.length === 2) {
        addLineMeasurement();
    }
    render();
}
}

function handleDoubleClick(e) {
if ((tool === 'polygon' || tool === 'area') && currentPolygon.length >= 3) {
    currentPolygon.pop();
    closePolygon();
}
}

function handleMouseDown(e) {
if (!currentImage) return;

// Middle mouse or space+click for panning
if (e.button === 1 || spacePressed) {
    isPanning = true;
    panStart = { x: e.clientX - transform.offsetX, y: e.clientY - transform.offsetY };
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
    return;
}

if (tool === 'edit') {
    var coords = screenToCanvas(e.clientX, e.clientY);
    var found = findVertexAtPoint(coords);
    if (found) {
        dragVertex = found;
        e.preventDefault();
    }
}
}

function handleMouseUp(e) {
if (isPanning) {
    isPanning = false;
    updateCursor();
}
if (dragVertex) {
    saveState();
    dragVertex = null;
    updateStats();
}
}

function handleMouseMove(e) {
if (!currentImage) return;
var coords = screenToCanvas(e.clientX, e.clientY);
var px = Math.floor(coords.x), py = Math.floor(coords.y);

// Panning
if (isPanning) {
    transform.offsetX = e.clientX - panStart.x;
    transform.offsetY = e.clientY - panStart.y;
    render();
    return;
}

// Update cursor info
var info = document.getElementById('cursorInfo');
var imgW = currentImage.image.width, imgH = currentImage.image.height;
if (px >= 0 && px < imgW && py >= 0 && py < imgH) {
    var temp = getPixelTemp(coords.x, coords.y);
    if (temp !== null) {
        info.innerHTML = '<span class="coords">X:' + px + ' Y:' + py + '</span> | <span class="temp">' + temp.toFixed(1) + ' °C</span>';
    } else {
        info.innerHTML = '<span class="coords">X:' + px + ' Y:' + py + '</span> | <span class="temp">-- °C</span>';
    }
} else {
    info.innerHTML = '<span class="coords">X: - Y: -</span> | <span class="temp">-- °C</span>';
}

// Vertex dragging
if (dragVertex && tool === 'edit') {
    var fn = currentImage.name;
    var newX = Math.round(coords.x), newY = Math.round(coords.y);
    if (dragVertex.type === 'zone') {
        var poly = zones[fn].zones[dragVertex.zoneIndex].polygon;
        poly[dragVertex.vertexIndex] = [newX, newY];
    } else if (dragVertex.type === 'measurement') {
        var m = measurements[fn][dragVertex.measIndex];
        if (dragVertex.measType === 'point') {
            m.x = newX; m.y = newY;
            // Recalculate temperature
            var temp = getPixelTemp(newX, newY);
            if (temp !== null) m.temp = temp;
        } else if (dragVertex.measType === 'line') {
            m.points[dragVertex.vertexIndex] = [newX, newY];
            // Recalculate line measurements
            recalculateLineMeasurement(m);
        } else if (dragVertex.measType === 'area') {
            m.polygon[dragVertex.vertexIndex] = [newX, newY];
            // Recalculate area measurements
            recalculateAreaMeasurement(m);
        }
        updateMeasurementsList();
    }
    render();
    return;
}

// Cursor style for edit mode
if (tool === 'edit') {
    var found = findVertexAtPoint(coords);
    canvas.style.cursor = found ? 'grab' : 'default';
}

// Preview line while drawing
if (isDrawing && currentPolygon.length > 0) {
    render();
    ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.offsetX, transform.offsetY);
    var last = currentPolygon[currentPolygon.length - 1];
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2 / transform.scale;
    ctx.setLineDash([5 / transform.scale, 5 / transform.scale]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Preview line measurement
if (tool === 'line' && currentLine.length === 1) {
    render();
    ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.offsetX, transform.offsetY);
    ctx.beginPath();
    ctx.moveTo(currentLine[0].x, currentLine[0].y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2 / transform.scale;
    ctx.setLineDash([5 / transform.scale, 5 / transform.scale]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
}

function handleMouseLeave() {
if (isPanning) {
    isPanning = false;
    updateCursor();
}
dragVertex = null;
document.getElementById('cursorInfo').innerHTML = '<span class="coords">X: - Y: -</span> | <span class="temp">-- °C</span>';
}

function handleKeyDown(e) {
// Prevent shortcuts when typing in inputs
if (e.target.tagName === 'INPUT') return;

var key = e.key.toLowerCase();

// Space for pan mode
if (key === ' ' && !spacePressed) {
    spacePressed = true;
    updateCursor();
    e.preventDefault();
    return;
}

// Tool selection (1-6)
if (key >= '1' && key <= '6') {
    var tools = ['select', 'polygon', 'edit', 'point', 'line', 'area'];
    var toolIndex = parseInt(key) - 1;
    if (toolIndex < tools.length) {
        tool = tools[toolIndex];
        document.querySelector('input[name="tool"][value="' + tool + '"]').checked = true;
        updateToolHint();
        cancelDrawing();
        updateCursor();
        render();
    }
    e.preventDefault();
    return;
}

// Zoom
if (key === '=' || key === '+') { zoomBy(1.2); e.preventDefault(); }
if (key === '-' || key === '_') { zoomBy(0.8); e.preventDefault(); }
if (key === '0') { zoomFit(); e.preventDefault(); }

// Arrow keys for pan
if (key === 'arrowleft') { transform.offsetX += 50; render(); e.preventDefault(); }
if (key === 'arrowright') { transform.offsetX -= 50; render(); e.preventDefault(); }
if (key === 'arrowup') { transform.offsetY += 50; render(); e.preventDefault(); }
if (key === 'arrowdown') { transform.offsetY -= 50; render(); e.preventDefault(); }

// Escape
if (key === 'escape') {
    cancelDrawing();
    document.getElementById('helpModal').classList.remove('show');
}

// Delete
if (key === 'delete' || key === 'backspace') {
    if (selectedZoneIndex >= 0) {
        deleteZone(selectedZoneIndex);
        e.preventDefault();
    } else if (selectedMeasurementIndex >= 0) {
        deleteMeasurement(selectedMeasurementIndex);
        selectedMeasurementIndex = -1;
        e.preventDefault();
    }
}

// Help
if (key === '?') {
    document.getElementById('helpModal').classList.add('show');
    e.preventDefault();
}

// Ctrl shortcuts
if (e.ctrlKey || e.metaKey) {
    if (key === 'z' && !e.shiftKey) { undo(); e.preventDefault(); }
    if (key === 'z' && e.shiftKey) { redo(); e.preventDefault(); }
    if (key === 'y') { redo(); e.preventDefault(); }
    if (key === 's') { exportJSON(); e.preventDefault(); }
    if (key === 'o') { document.getElementById('imageInput').click(); e.preventDefault(); }
}
}

function handleKeyUp(e) {
if (e.key === ' ') {
    spacePressed = false;
    updateCursor();
}
}

// === Polygon/Zone Management ===
function closePolygon() {
if (currentPolygon.length < 3) { cancelDrawing(); return; }
var fn = currentImage.name;

if (tool === 'area') {
    // Add as measurement
    var poly = currentPolygon.map(function(p) { return [Math.round(p.x), Math.round(p.y)]; });
    var areaStats = calcAreaStats(poly);
    measurements[fn].push({
        type: 'area',
        polygon: poly,
        area: areaStats.area,
        tempMin: areaStats.min,
        tempMax: areaStats.max,
        tempMean: areaStats.mean
    });
    updateMeasurementsList();
} else {
    // Add as exclusion zone
    zones[fn].zones.push({
        id: 'zone_' + (zones[fn].zones.length + 1),
        type: 'exclusion',
        polygon: currentPolygon.map(function(p) { return [Math.round(p.x), Math.round(p.y)]; })
    });
    updateZonesList();
}

currentPolygon = [];
isDrawing = false;
saveState();
render();
updateStats();
updateThumbnails();
}

function cancelDrawing() {
currentPolygon = [];
currentLine = [];
isDrawing = false;
if (currentImage) render();
}

function findZoneAtPoint(pt) {
if (!currentImage) return -1;
var zs = zones[currentImage.name] ? zones[currentImage.name].zones : [];
for (var i = zs.length - 1; i >= 0; i--) {
    if (isPointInPolygon(pt.x, pt.y, zs[i].polygon)) return i;
}
return -1;
}

function findMeasurementAtPoint(pt) {
if (!currentImage) return -1;
var ms = measurements[currentImage.name] || [];
var threshold = 15 / transform.scale;
for (var i = ms.length - 1; i >= 0; i--) {
    var m = ms[i];
    if (m.type === 'point') {
        var dx = pt.x - m.x, dy = pt.y - m.y;
        if (Math.sqrt(dx*dx + dy*dy) < threshold) return i;
    } else if (m.type === 'line') {
        // Check distance to line segment
        var p1 = m.points[0], p2 = m.points[1];
        var dist = pointToLineDistance(pt.x, pt.y, p1[0], p1[1], p2[0], p2[1]);
        if (dist < threshold) return i;
    } else if (m.type === 'area') {
        if (isPointInPolygon(pt.x, pt.y, m.polygon)) return i;
    }
}
return -1;
}

function pointToLineDistance(px, py, x1, y1, x2, y2) {
var A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
var dot = A * C + B * D;
var lenSq = C * C + D * D;
var param = lenSq !== 0 ? dot / lenSq : -1;
var xx, yy;
if (param < 0) { xx = x1; yy = y1; }
else if (param > 1) { xx = x2; yy = y2; }
else { xx = x1 + param * C; yy = y1 + param * D; }
var dx = px - xx, dy = py - yy;
return Math.sqrt(dx * dx + dy * dy);
}

function findVertexAtPoint(pt) {
if (!currentImage) return null;
var threshold = 10 / transform.scale;

// Check exclusion zones first
var zs = zones[currentImage.name] ? zones[currentImage.name].zones : [];
for (var zi = 0; zi < zs.length; zi++) {
    var poly = zs[zi].polygon;
    for (var vi = 0; vi < poly.length; vi++) {
        var dx = pt.x - poly[vi][0], dy = pt.y - poly[vi][1];
        if (Math.sqrt(dx*dx + dy*dy) < threshold) {
            return { type: 'zone', zoneIndex: zi, vertexIndex: vi };
        }
    }
}

// Check measurements
var ms = measurements[currentImage.name] || [];
for (var mi = 0; mi < ms.length; mi++) {
    var m = ms[mi];
    if (m.type === 'point') {
        var dx = pt.x - m.x, dy = pt.y - m.y;
        if (Math.sqrt(dx*dx + dy*dy) < threshold) {
            return { type: 'measurement', measIndex: mi, vertexIndex: 0, measType: 'point' };
        }
    } else if (m.type === 'line') {
        for (var pi = 0; pi < m.points.length; pi++) {
            var dx = pt.x - m.points[pi][0], dy = pt.y - m.points[pi][1];
            if (Math.sqrt(dx*dx + dy*dy) < threshold) {
                return { type: 'measurement', measIndex: mi, vertexIndex: pi, measType: 'line' };
            }
        }
    } else if (m.type === 'area') {
        for (var ai = 0; ai < m.polygon.length; ai++) {
            var dx = pt.x - m.polygon[ai][0], dy = pt.y - m.polygon[ai][1];
            if (Math.sqrt(dx*dx + dy*dy) < threshold) {
                return { type: 'measurement', measIndex: mi, vertexIndex: ai, measType: 'area' };
            }
        }
    }
}
return null;
}

function isPointInPolygon(x, y, poly) {
var inside = false, n = poly.length;
for (var i = 0, j = n - 1; i < n; j = i++) {
    var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
}
return inside;
}

function deleteZone(i) {
if (!currentImage) return;
var fn = currentImage.name;
zones[fn].zones.splice(i, 1);
zones[fn].zones.forEach(function(z, j) { z.id = 'zone_' + (j + 1); });
selectedZoneIndex = -1;
saveState();
render();
updateZonesList();
updateStats();
updateThumbnails();
}

function clearCurrentZones() {
if (!currentImage) return;
zones[currentImage.name].zones = [];
measurements[currentImage.name] = [];
selectedZoneIndex = -1;
saveState();
render();
updateZonesList();
updateMeasurementsList();
updateStats();
updateThumbnails();
}

// === Measurements ===
function addPointMeasurement(coords) {
if (!currentImage) return;
var fn = currentImage.name;
var temp = getPixelTemp(coords.x, coords.y);
if (temp === null) return;
measurements[fn].push({
    type: 'point',
    x: Math.round(coords.x),
    y: Math.round(coords.y),
    temp: temp
});
saveState();
render();
updateMeasurementsList();
}

function addLineMeasurement() {
if (!currentImage || currentLine.length !== 2) return;
var fn = currentImage.name;
var p1 = currentLine[0], p2 = currentLine[1];
var distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

// Sample temperatures along line
var temps = [];
var steps = Math.max(10, Math.floor(distance / 5));
for (var i = 0; i <= steps; i++) {
    var t = i / steps;
    var x = p1.x + (p2.x - p1.x) * t;
    var y = p1.y + (p2.y - p1.y) * t;
    var temp = getPixelTemp(x, y);
    if (temp !== null) temps.push(temp);
}

measurements[fn].push({
    type: 'line',
    points: [[Math.round(p1.x), Math.round(p1.y)], [Math.round(p2.x), Math.round(p2.y)]],
    distance: distance,
    tempMin: temps.length ? Math.min.apply(null, temps) : 0,
    tempMax: temps.length ? Math.max.apply(null, temps) : 0,
    tempMean: temps.length ? temps.reduce(function(a,b) { return a+b; }, 0) / temps.length : 0
});

currentLine = [];
saveState();
render();
updateMeasurementsList();
}

function recalculateLineMeasurement(m) {
var p1 = m.points[0], p2 = m.points[1];
m.distance = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
var temps = [];
var steps = Math.max(10, Math.floor(m.distance / 5));
for (var i = 0; i <= steps; i++) {
    var t = i / steps;
    var x = p1[0] + (p2[0] - p1[0]) * t;
    var y = p1[1] + (p2[1] - p1[1]) * t;
    var temp = getPixelTemp(x, y);
    if (temp !== null) temps.push(temp);
}
m.tempMin = temps.length ? Math.min.apply(null, temps) : 0;
m.tempMax = temps.length ? Math.max.apply(null, temps) : 0;
m.tempMean = temps.length ? temps.reduce(function(a,b) { return a+b; }, 0) / temps.length : 0;
}

function recalculateAreaMeasurement(m) {
var stats = calcAreaStats(m.polygon);
m.area = stats.area;
m.tempMin = stats.min;
m.tempMax = stats.max;
m.tempMean = stats.mean;
}

function calcAreaStats(poly) {
var temps = [];
var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
poly.forEach(function(p) {
    if (p[0] < minX) minX = p[0];
    if (p[0] > maxX) maxX = p[0];
    if (p[1] < minY) minY = p[1];
    if (p[1] > maxY) maxY = p[1];
});

var step = Math.max(1, Math.floor(Math.sqrt((maxX - minX) * (maxY - minY) / 1000)));
for (var y = minY; y <= maxY; y += step) {
    for (var x = minX; x <= maxX; x += step) {
        if (isPointInPolygon(x, y, poly)) {
            var temp = getPixelTemp(x, y);
            if (temp !== null) temps.push(temp);
        }
    }
}

return {
    area: calcArea(poly),
    min: temps.length ? Math.min.apply(null, temps) : 0,
    max: temps.length ? Math.max.apply(null, temps) : 0,
    mean: temps.length ? temps.reduce(function(a,b) { return a+b; }, 0) / temps.length : 0
};
}

// === UI Updates ===
function updateZonesList() {
var list = document.getElementById('zonesList');
list.innerHTML = '';
if (!currentImage) return;
var zs = zones[currentImage.name] ? zones[currentImage.name].zones : [];
if (zs.length === 0) {
    list.innerHTML = '<p style="color:#555;font-size:0.7rem;text-align:center;padding:1rem;">' + (i18n.no_zones || 'No zones defined') + '</p>';
    return;
}
zs.forEach(function(z, i) {
    var area = calcArea(z.polygon);
    var item = document.createElement('div');
    item.className = 'zone-item' + (i === selectedZoneIndex ? ' selected' : '');
    item.innerHTML = '<div class="zone-info"><span class="zone-name">' + z.id + '</span><span class="zone-meta">' + z.polygon.length + ' pts | ' + Math.round(area) + ' px²</span></div><button class="zone-delete">×</button>';
    item.querySelector('.zone-delete').onclick = function(e) { e.stopPropagation(); deleteZone(i); };
    item.onclick = function() { selectedZoneIndex = i; selectedMeasurementIndex = -1; render(); updateZonesList(); updateMeasurementsList(); };
    list.appendChild(item);
});
}

function updateMeasurementsList() {
var list = document.getElementById('measurementsList');
list.innerHTML = '';
if (!currentImage) return;
var ms = measurements[currentImage.name] || [];
if (ms.length === 0) {
    list.innerHTML = '<p style="color:#555;font-size:0.65rem;text-align:center;">' + (i18n.no_measurements || 'No measurements') + '</p>';
    return;
}
ms.forEach(function(m, i) {
    var item = document.createElement('div');
    item.className = 'measurement-item' + (i === selectedMeasurementIndex ? ' selected' : '');
    var typeLabel = '', valueLabel = '';
    if (m.type === 'point') {
        typeLabel = i18n.point || 'Point';
        valueLabel = m.temp.toFixed(1) + '°C @ ' + m.x + ',' + m.y;
    } else if (m.type === 'line') {
        typeLabel = i18n.line || 'Line';
        valueLabel = m.distance.toFixed(0) + 'px | ' + m.tempMin.toFixed(1) + '-' + m.tempMax.toFixed(1) + '°C';
    } else if (m.type === 'area') {
        typeLabel = i18n.area || 'Area';
        valueLabel = m.area.toFixed(0) + 'px² | ' + m.tempMean.toFixed(1) + '°C';
    }
    item.innerHTML = '<div class="meas-info"><span class="meas-type">' + typeLabel + '</span><span class="meas-value">' + valueLabel + '</span></div><button class="meas-delete">×</button>';
    item.querySelector('.meas-delete').onclick = function(e) { e.stopPropagation(); deleteMeasurement(i); };
    item.onclick = function() { selectedMeasurementIndex = i; selectedZoneIndex = -1; render(); updateZonesList(); updateMeasurementsList(); };
    list.appendChild(item);
});
}

function deleteMeasurement(index) {
if (!currentImage) return;
var fn = currentImage.name;
measurements[fn].splice(index, 1);
saveState();
render();
updateMeasurementsList();
}

function updateStats() {
var s = document.getElementById('imageStats');
if (!currentImage || !imageData) { s.textContent = i18n.load_image || 'Load an image'; return; }
var fn = currentImage.name;
var imgW = currentImage.image.width, imgH = currentImage.image.height;
var zs = zones[fn] ? zones[fn].zones : [];
var total = imgW * imgH;
var exclArea = 0;
zs.forEach(function(z) { exclArea += calcArea(z.polygon); });

var temps = [];
var step = Math.max(1, Math.floor(Math.sqrt(total / 10000)));
for (var y = 0; y < imgH; y += step) {
    for (var x = 0; x < imgW; x += step) {
        var excluded = false;
        for (var zi = 0; zi < zs.length; zi++) {
            if (isPointInPolygon(x, y, zs[zi].polygon)) { excluded = true; break; }
        }
        if (!excluded) {
            var temp = getPixelTemp(x, y);
            if (temp !== null) temps.push(temp);
        }
    }
}

var tMin = '-', tMax = '-', tMean = '-', tStd = '-';
if (temps.length > 0) {
    tMin = Math.min.apply(null, temps).toFixed(1);
    tMax = Math.max.apply(null, temps).toFixed(1);
    var sum = temps.reduce(function(a,b) { return a+b; }, 0);
    tMean = (sum / temps.length).toFixed(1);
    var sqDiff = temps.map(function(t) { return Math.pow(t - tMean, 2); });
    tStd = Math.sqrt(sqDiff.reduce(function(a,b) { return a+b; }, 0) / temps.length).toFixed(2);
}
var inclPct = (((total - exclArea) / total) * 100).toFixed(1);

var deviceHtml = '';
var device = currentImage.device;
if (device && device.detected) {
    deviceHtml = '<span class="device-info">' + device.brand + ' ' + device.model + '</span>';
    if (device.tempMeasured) {
        deviceHtml += ' | Measured: ' + device.tempMeasured.min + '-' + device.tempMeasured.max + '°C';
    }
}

// Data source and palette
var paletteGradient = '';
var paletteName = '';
var usesRawData = currentImage.thermalData && currentImage.thermalData.raw.length >= 49152;

if (usesRawData) {
    paletteName = 'Raw Thermal (16-bit)';
    paletteGradient = 'linear-gradient(to right, #000, #00008B, #0066CC, #00FF00, #FFFF00, #FF0000, #FFF)';
} else {
    // Generate gradient from actual palette data
    var pdata = detectedPaletteData;
    var stops = [];
    var indices = [0, 32, 64, 96, 128, 160, 192, 224, 255];
    for (var si = 0; si < indices.length; si++) {
        var pi = indices[si];
        var pr = pdata[pi * 3], pg = pdata[pi * 3 + 1], pb = pdata[pi * 3 + 2];
        stops.push('rgb(' + pr + ',' + pg + ',' + pb + ')');
    }
    paletteGradient = 'linear-gradient(to right, ' + stops.join(', ') + ')';
    var paletteDisplayNames = {
        ironbow: 'Ironbow', rainbow: 'Rainbow', grayred: 'Gray+Red',
        inverted: 'Inverted', grayscale: 'Grayscale', bluegray: 'Blue-Gray', spectrum: 'Spectrum'
    };
    paletteName = (paletteDisplayNames[detectedPalette] || detectedPalette) + ' (colormap)';
}
var paletteHtml = '<div style="margin-top:4px;"><span style="font-size:0.75rem;">' + (i18n.source || 'Source') + ': ' + paletteName + '</span>' +
    '<div style="height:10px;width:100%;border-radius:3px;margin-top:2px;background:' + paletteGradient + ';border:1px solid #444;"></div>' +
    '<div style="display:flex;justify-content:space-between;font-size:0.7rem;color:#888;"><span>' + tempMin + '°C</span><span>' + tempMax + '°C</span></div></div>';

s.innerHTML = '<div class="stat-group"><strong>' + fn + '</strong><br>' +
    imgW + '×' + imgH + ' | Zones: ' + zs.length + ' | Incl: ' + inclPct + '%' +
    (deviceHtml ? '<br>' + deviceHtml : '') + '</div>' +
    '<div class="stat-group"><strong>Temperature</strong><br>' +
    'Min: <span class="temp-val">' + tMin + '°C</span> Max: <span class="temp-val">' + tMax + '°C</span><br>' +
    'Mean: <span class="temp-val">' + tMean + '°C</span> Std: ' + tStd + paletteHtml + '</div>';
}

// === Histogram ===
function renderHistogramEmpty() {
histCtx.fillStyle = '#16213e';
histCtx.fillRect(0, 0, histCanvas.width, histCanvas.height);
histCtx.fillStyle = '#444';
histCtx.font = '11px sans-serif';
histCtx.textAlign = 'center';
histCtx.fillText('Load image for histogram', histCanvas.width / 2, histCanvas.height / 2 + 4);
}

function updateHistogram() {
if (!currentImage || !imageData) { renderHistogramEmpty(); return; }

var fn = currentImage.name;
var imgW = currentImage.image.width, imgH = currentImage.image.height;
var zs = zones[fn] ? zones[fn].zones : [];
var temps = [];
var step = Math.max(1, Math.floor(Math.sqrt(imgW * imgH / 5000)));

for (var y = 0; y < imgH; y += step) {
    for (var x = 0; x < imgW; x += step) {
        var excluded = false;
        for (var zi = 0; zi < zs.length; zi++) {
            if (isPointInPolygon(x, y, zs[zi].polygon)) { excluded = true; break; }
        }
        if (!excluded) {
            var temp = getPixelTemp(x, y);
            if (temp !== null) temps.push(temp);
        }
    }
}

if (temps.length === 0) { renderHistogramEmpty(); return; }

// Build histogram
var buckets = new Array(histogramBuckets).fill(0);
var range = tempMax - tempMin;
temps.forEach(function(t) {
    var idx = Math.floor((t - tempMin) / range * (histogramBuckets - 1));
    idx = Math.max(0, Math.min(histogramBuckets - 1, idx));
    buckets[idx]++;
});

histogramData = { buckets: buckets, temps: temps };

var maxCount = Math.max.apply(null, buckets);
var barWidth = histCanvas.width / histogramBuckets;

histCtx.fillStyle = '#0a0a15';
histCtx.fillRect(0, 0, histCanvas.width, histCanvas.height);

// Draw bars with gradient
for (var i = 0; i < histogramBuckets; i++) {
    var height = (buckets[i] / maxCount) * (histCanvas.height - 10);
    var hue = 240 - (i / histogramBuckets) * 240; // Blue to red
    histCtx.fillStyle = 'hsl(' + hue + ', 80%, 50%)';
    histCtx.fillRect(i * barWidth, histCanvas.height - height - 5, barWidth - 1, height);
}

// Draw axis labels
histCtx.fillStyle = '#888';
histCtx.font = '9px sans-serif';
histCtx.textAlign = 'left';
histCtx.fillText(tempMin.toFixed(0) + '°', 2, histCanvas.height - 1);
histCtx.textAlign = 'right';
histCtx.fillText(tempMax.toFixed(0) + '°', histCanvas.width - 2, histCanvas.height - 1);
}

function handleHistogramHover(e) {
if (!histogramData) return;
var rect = histCanvas.getBoundingClientRect();
var x = e.clientX - rect.left;
var bucketIndex = Math.floor(x / histCanvas.width * histogramBuckets);
bucketIndex = Math.max(0, Math.min(histogramBuckets - 1, bucketIndex));

var range = tempMax - tempMin;
var bucketMin = tempMin + (bucketIndex / histogramBuckets) * range;
var bucketMax = tempMin + ((bucketIndex + 1) / histogramBuckets) * range;
var count = histogramData.buckets[bucketIndex];
var pct = (count / histogramData.temps.length * 100).toFixed(1);

document.getElementById('histogramInfo').innerHTML =
    '<strong>' + bucketMin.toFixed(1) + '-' + bucketMax.toFixed(1) + '°C</strong><br>' +
    count + ' pixels (' + pct + '%)';
}

// === Temperature Calculation ===
// Noyafa NF-521 color palettes (extracted from Android app)
// Each palette: 256 RGB triplets, index 0=coldest, 255=hottest

// Get temperature from raw thermal data (Noyafa)
function getTempFromRaw(x, y) {
if (!currentImage || !currentImage.thermalData) return null;
var td = currentImage.thermalData;

// Scale from visible image coords to thermal sensor coords
var imgW = currentImage.image.width;
var imgH = currentImage.image.height;
var tx = Math.floor(x / imgW * td.width);
var ty = Math.floor(y / imgH * td.height);

if (tx < 0 || tx >= td.width || ty < 0 || ty >= td.height) return null;

var idx = ty * td.width + tx;
if (idx >= td.raw.length) return null;

var rawVal = td.raw[idx];
// Filter invalid values
if (rawVal < 14000 || rawVal > 27000) return null;

// Apply calibration formula
var temp = td.tempMin + (rawVal - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (td.tempMax - td.tempMin);
return temp;
}

// Get temperature at pixel - use raw data if available, else colormap
function getPixelTemp(x, y) {
// Try raw thermal data first
var rawTemp = getTempFromRaw(x, y);
if (rawTemp !== null) return rawTemp;

// Fall back to colormap estimation
var color = getPixelColor(x, y);
if (!color) return null;
return colorToTemp(color.r, color.g, color.b);
}

function getPixelColor(x, y) {
if (!imageData || !currentImage) return null;
var ix = Math.floor(x), iy = Math.floor(y);
var imgW = currentImage.image.width;
var imgH = currentImage.image.height;
if (ix < 0 || ix >= imgW || iy < 0 || iy >= imgH) return null;
var idx = (iy * imgW + ix) * 4;
return { r: imageData.data[idx], g: imageData.data[idx+1], b: imageData.data[idx+2] };
}

// Find closest color index in a palette using squared distance
function findClosestPaletteIndex(r, g, b, palette) {
var bestIdx = 0, bestDist = Infinity;
for (var i = 0; i < 256; i++) {
    var pr = palette[i * 3], pg = palette[i * 3 + 1], pb = palette[i * 3 + 2];
    var dist = (r - pr) * (r - pr) + (g - pg) * (g - pg) + (b - pb) * (b - pb);
    if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
    }
    if (dist === 0) break; // Exact match
}
return { index: bestIdx, distance: bestDist };
}

// Detect which Noyafa palette best matches the image
function detectPalette(imgData) {
var step = Math.max(1, Math.floor(Math.sqrt(imgData.width * imgData.height / 2000)));
var paletteTotals = {};
PALETTE_NAMES.forEach(function(name) { paletteTotals[name] = 0; });

// Sample pixels and find best matching palette for each
for (var y = 0; y < imgData.height; y += step) {
    for (var x = 0; x < imgData.width; x += step) {
        var idx = (y * imgData.width + x) * 4;
        var r = imgData.data[idx], g = imgData.data[idx + 1], b = imgData.data[idx + 2];

        // Skip near-black pixels (likely background/text)
        if (r < 10 && g < 10 && b < 10) continue;

        // Find which palette has the closest match for this pixel
        var bestPalette = 'grayscale', bestDist = Infinity;
        for (var pi = 0; pi < PALETTE_NAMES.length; pi++) {
            var pname = PALETTE_NAMES[pi];
            var result = findClosestPaletteIndex(r, g, b, NOYAFA_PALETTES[pname]);
            if (result.distance < bestDist) {
                bestDist = result.distance;
                bestPalette = pname;
            }
        }
        paletteTotals[bestPalette]++;
    }
}

// Find palette with most matches
var winner = 'grayscale', maxCount = 0;
PALETTE_NAMES.forEach(function(name) {
    if (paletteTotals[name] > maxCount) {
        maxCount = paletteTotals[name];
        winner = name;
    }
});

// Store detected palette data for colorToTemp
detectedPalette = winner;
detectedPaletteData = NOYAFA_PALETTES[winner];
return winner;
}

// Convert pixel color to temperature using nearest-neighbor palette lookup
function colorToTemp(r, g, b) {
// Find closest matching index in detected palette
var result = findClosestPaletteIndex(r, g, b, detectedPaletteData);
var paletteIndex = result.index;

// Handle inverted palette (index 0 = hot, 255 = cold)
if (detectedPalette === 'inverted') {
    paletteIndex = 255 - paletteIndex;
}

// Use per-image temperature range if available, else global
var tMin = tempMin, tMax = tempMax;
if (currentImage && currentImage.thermalData) {
    tMin = currentImage.thermalData.tempMin;
    tMax = currentImage.thermalData.tempMax;
}

// Map palette index (0-255) to temperature range
var intensity = paletteIndex / 255;
return tMin + intensity * (tMax - tMin);
}

function rgbToSaturation(r, g, b) {
r /= 255; g /= 255; b /= 255;
var max = Math.max(r, g, b), min = Math.min(r, g, b);
if (max === 0) return 0;
return (max - min) / max;
}

function rgbToHue(r, g, b) {
r /= 255; g /= 255; b /= 255;
var max = Math.max(r, g, b), min = Math.min(r, g, b);
var h;
if (max === min) return 0;
var d = max - min;
if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
else if (max === g) h = ((b - r) / d + 2) * 60;
else h = ((r - g) / d + 4) * 60;
return h;
}

function calcArea(poly) {
var a = 0, n = poly.length;
for (var i = 0; i < n; i++) {
    var j = (i + 1) % n;
    a += poly[i][0] * poly[j][1] - poly[j][0] * poly[i][1];
}
return Math.abs(a / 2);
}

function calcTempStatsForImage(imgObj) {
var fn = imgObj.name;
var zs = zones[fn] ? zones[fn].zones : [];
var imgW = imgObj.image.width, imgH = imgObj.image.height;
var total = imgW * imgH;
var exclArea = 0;
zs.forEach(function(z) { exclArea += calcArea(z.polygon); });

var temps = [];
var step = Math.max(1, Math.floor(Math.sqrt(total / 10000)));

// Use raw thermal data if available (Noyafa)
if (imgObj.thermalData && imgObj.thermalData.raw.length >= 49152) {
    var td = imgObj.thermalData;
    for (var y = 0; y < imgH; y += step) {
        for (var x = 0; x < imgW; x += step) {
            var excluded = false;
            for (var zi = 0; zi < zs.length; zi++) {
                if (isPointInPolygon(x, y, zs[zi].polygon)) { excluded = true; break; }
            }
            if (!excluded) {
                var tx = Math.floor(x / imgW * td.width);
                var ty = Math.floor(y / imgH * td.height);
                var idx = ty * td.width + tx;
                if (idx < td.raw.length) {
                    var rawVal = td.raw[idx];
                    if (rawVal >= 14000 && rawVal <= 27000) {
                        var temp = td.tempMin + (rawVal - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (td.tempMax - td.tempMin);
                        temps.push(temp);
                    }
                }
            }
        }
    }
} else {
    // Fall back to colormap estimation
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = imgW;
    tempCanvas.height = imgH;
    tempCtx.drawImage(imgObj.image, 0, 0);
    var imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

    for (var y = 0; y < imgH; y += step) {
        for (var x = 0; x < imgW; x += step) {
            var excluded = false;
            for (var zi = 0; zi < zs.length; zi++) {
                if (isPointInPolygon(x, y, zs[zi].polygon)) { excluded = true; break; }
            }
            if (!excluded) {
                var idx = (y * imgW + x) * 4;
                var r = imgData.data[idx], g = imgData.data[idx+1], b = imgData.data[idx+2];
                temps.push(colorToTemp(r, g, b));
            }
        }
    }
}

var stats = { min: null, max: null, mean: null, std: null, included_percent: ((total - exclArea) / total * 100).toFixed(1) };
if (temps.length > 0) {
    stats.min = parseFloat(Math.min.apply(null, temps).toFixed(2));
    stats.max = parseFloat(Math.max.apply(null, temps).toFixed(2));
    var sum = temps.reduce(function(a,b) { return a+b; }, 0);
    stats.mean = parseFloat((sum / temps.length).toFixed(2));
    var sqDiff = temps.map(function(t) { return Math.pow(t - stats.mean, 2); });
    stats.std = parseFloat(Math.sqrt(sqDiff.reduce(function(a,b) { return a+b; }, 0) / temps.length).toFixed(2));
}
return stats;
}
})();
