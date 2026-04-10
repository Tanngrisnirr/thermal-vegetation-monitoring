# Thermal Vegetation Monitoring

A Python toolkit and web application for analyzing thermal images of vegetation with polygon-based region exclusion and time series analysis. Includes calibrated support for Noyafa NF-521 thermal cameras.

![Thermal Zone Editor Screenshot](docs/screenshot.png)

## Features

- **Temperature Extraction**: Read calibrated temperature data from thermal images
- **Noyafa NF-521 Support**: Automatic detection and per-image temperature calibration (<0.05°C accuracy)
- **Polygon Exclusion Zones**: Define regions to exclude from analysis (non-vegetation areas)
- **Measurement Tools**: Point, line, and area temperature measurements
- **Statistical Analysis**: Compute min, max, mean, std on selected regions
- **Temperature Histogram**: Visualize temperature distribution
- **Time Series**: Track temperature evolution across sampling sessions
- **Export**: JSON and CSV export with metadata

## Web Application

The webapp (`webapp/index.html`) provides a full-featured thermal image editor:

- **Zoom/Pan**: Mouse wheel zoom, Space+drag or middle-click to pan
- **Polygon Tools**: Draw exclusion zones with vertex editing
- **Measurements**: Point (temperature), Line (distance + temp profile), Area (mean temp)
- **Undo/Redo**: Full history with Ctrl+Z / Ctrl+Y
- **Import/Export**: Save and reload your work as JSON
- **Histogram**: Interactive temperature distribution
- **Keyboard Shortcuts**: Press `?` for full list

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1-6 | Select tool (Polygon, Edit, Select, Point, Line, Area) |
| +/- | Zoom in/out |
| 0 | Fit to view |
| Space+drag | Pan |
| Ctrl+Z/Y | Undo/Redo |
| Ctrl+S | Export JSON |
| Delete | Delete selected zone |
| ? | Show help |

## Installation

```bash
git clone https://github.com/Tanngrisnirr/thermal-vegetation-monitoring.git
cd thermal-vegetation-monitoring
pip install -r requirements.txt
```

## Quick Start

### 1. Web Interface (Recommended)

Open `webapp/index.html` in a browser to:
- Load thermal images
- Draw exclusion zones
- Take measurements
- Export results

### 2. Python API

```python
from thermal_veg import temperature, stats

# Extract calibrated temperatures from Noyafa image
temps, metadata = temperature.extract_noyafa_temperatures("image.jpg")
print(f"Temperature range: {metadata['temp_min']:.1f}°C - {metadata['temp_max']:.1f}°C")

# Compute statistics
print(f"Mean: {metadata['temp_mean']:.1f}°C, Std: {metadata['temp_std']:.2f}")
```

### 3. With Exclusion Zones

```python
from thermal_veg import zones, stats

# Load exclusion zones from webapp export
exclusion = zones.load_zones("thermal_zones.json")

# Compute stats excluding those zones
results = stats.compute_stats(temps, exclusion_zones=exclusion)
```

## Project Structure

```
thermal-vegetation-monitoring/
├── webapp/
│   └── index.html              # Web application (self-contained)
├── thermal_veg/                # Python package
│   ├── __init__.py
│   ├── io.py                   # Image loading utilities
│   ├── temperature.py          # Temperature extraction (Noyafa calibration)
│   ├── zones.py                # Polygon zone management
│   ├── stats.py                # Statistical analysis
│   └── timeseries.py           # Time series analysis
├── docs/
│   └── NOYAFA_THERMAL_FORMAT.md  # Noyafa binary format documentation
├── tests/                      # Test data and exports
├── README.md
├── NOTES_PROJET.md             # Development notes (French)
├── HUMANS.txt
└── requirements.txt
```

## Supported Cameras

### Noyafa NF-521 (Full Support)
- Automatic detection via `dyts` signature
- Per-image temperature calibration from metadata
- Raw 16-bit thermal data extraction (256x192 sensor)
- Accuracy: <0.05°C vs displayed values

### Other Cameras (Colormap Estimation)
- FLIR (detection only, use flirimageextractor for full support)
- InfiRay, Seek Thermal (detection only)
- Any thermal image with iron/rainbow colormap

**Important Limitation**: Most consumer thermal cameras save images using color palettes (iron, rainbow, etc.) rather than raw thermal data. Converting these colorized images back to temperature values is inherently imprecise because:
- Multiple temperature values can map to similar colors
- Color quantization loses thermal precision
- Palette variations between manufacturers add uncertainty

For accurate temperature analysis, use greyscale as color scale rather than other scales like rainbow or iron.

## Noyafa Calibration Formula

The NF-521 stores per-image temperature calibration in the DYTS metadata:

```
temp_max = 0.015594 × v1c - 272.55
temp_min = 0.015772 × v1e - 275.86
temp_C = temp_min + (raw - 15432) / (25674 - 15432) × (temp_max - temp_min)
```

See `docs/NOYAFA_THERMAL_FORMAT.md` for complete binary format documentation.

## License

MIT License

## Author

Olivier Ruiz - [GitHub](https://github.com/Tanngrisnirr) - [AntWorld](https://antworld.org)
