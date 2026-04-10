# Project Guidelines

## UI/UX Rules

- **No emojis**: Never use emojis anywhere in the code or UI.
- **No prefabricated icons**: Do not use icon libraries or icon fonts. Use simple text characters like `X`, `+`, `-`, `?` for buttons and UI elements.
- **Text contrast**: Text must always be white on dark backgrounds or black on light backgrounds. Never use colored text on colored backgrounds that reduces readability.
- **Minimum font size**: No font size under 12pt (0.75rem). All text must be readable.

## Attribution Rules

- **No AI co-author tags**: Never add `Co-Authored-By` or any AI attribution tags to git commits.
- **No author credits in code**: Do not add author or co-author comments/credits in source files.

### Removing AI Attribution from Files

Run from project root:
```bash
./remove_ai_attribution.sh
```

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

**Note:** When deleting and recreating a repo on the same account with the same name and path, the old links to that repo work because they are canonical.

### Remove AI Attribution Script

Create `remove_ai_attribution.sh` at project root (add to .gitignore):

```bash
#!/bin/bash
# Excludes HUMANS.txt

total_removed=0
files_cleaned=0

for file in $(find . -type f \( -name "*.md" -o -name "*.txt" -o -name "*.py" -o -name "*.js" -o -name "*.html" -o -name "*.css" -o -name "*.json" \) \
    ! -name "HUMANS.txt" \
    ! -path "./.git/*"); do


    if [ -n "$count" ] && [ "$count" -gt 0 ]; then
        echo "Cleaning: $file"
        echo "  Removing $count line(s): $lines"
        sed -i '/[Cc]laude\|[Aa]nthropic/d' "$file"
        total_removed=$((total_removed + count))
        files_cleaned=$((files_cleaned + 1))
    fi
done

if [ "$total_removed" -eq 0 ]; then
    echo "No AI attribution found. All files are clean."
else
    echo "Done. Removed $total_removed line(s) from $files_cleaned file(s)."
fi
```

Run from project root: `./remove_ai_attribution.sh`

## Project Structure

```
thermal-vegetation-monitoring/
├── webapp/
│   └── index.html          # Single self-contained HTML file (CSS+JS inline)
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

- Webapp is a single self-contained HTML file with all CSS and JS inlined
- This ensures compatibility with Flatpak sandboxed browsers (file:// protocol)
- Use vanilla JavaScript (no frameworks)
- Support internationalization (EN/FR/PL)
- No external dependencies - works offline with local file access
