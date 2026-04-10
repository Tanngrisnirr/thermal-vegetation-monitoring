# Claude Code Guidelines for Thermal Vegetation Monitoring

## UI/UX Rules

- **No emojis**: Never use emojis anywhere in the code or UI.
- **No prefabricated icons**: Do not use icon libraries or icon fonts. Use simple text characters like `X`, `+`, `-`, `?` for buttons and UI elements.
- **Text contrast**: Text must always be white on dark backgrounds or black on light backgrounds. Never use colored text on colored backgrounds that reduces readability.
- **Minimum font size**: No font size under 12pt (0.75rem). All text must be readable.

## Attribution Rules

- **No AI co-author tags**: Never add `Co-Authored-By` or any AI attribution tags to git commits.
- **No author credits in code**: Do not add author or co-author comments/credits in source files.
- **Remove existing tags**: If any Claude/AI authorship or co-authorship tags exist in files or git history, remove them immediately.

### Removing AI Attribution from Git History

If co-author tags were accidentally added to commits, the GitHub repo must be deleted and recreated:

```bash
# 1. Delete the repo on GitHub
gh repo delete Tanngrisnirr/thermal-vegetation-monitoring --yes

# 2. Clean local git history (start fresh)
rm -rf .git
git init
git add .
git commit -m "Initial commit"

# 3. Create new repo and push
gh repo create Tanngrisnirr/thermal-vegetation-monitoring --public --source=. --remote=origin
git push -u origin main

# Note: If "Unable to add remote origin" error appears, the old remote still exists.
# The URL is the same, so just push directly:
git push -u origin main
```

## Project Structure

```
thermal-vegetation-monitoring/
├── webapp/
│   ├── index.html          # HTML structure only
│   ├── styles.css          # All CSS styles
│   ├── palettes.js         # Noyafa color palettes data
│   └── app.js              # Main application logic
├── thermal_veg/            # Python package for thermal image processing
│   ├── __init__.py         # Package initialization
│   ├── io.py               # Input/output operations
│   ├── temperature.py      # Temperature extraction and calibration
│   ├── zones.py            # Thermal zone management
│   ├── stats.py            # Statistical analysis
│   └── timeseries.py       # Time series analysis
├── docs/
│   └── Devices/            # Device-specific documentation
│       └── Nofaya_NF-512/  # Nofaya NF-512 thermal camera docs
├── tests/                  # Test data files (JSON/CSV exports)
├── IR-img/                 # Thermal image files
├── README.md
├── requirements.txt
└── LICENSE
```

## Code Style

- Webapp uses modular files (HTML, CSS, JS separated)
- Use vanilla JavaScript (no frameworks)
- Support internationalization (EN/FR/PL)
- Maintain compatibility with local file access (no server required)
