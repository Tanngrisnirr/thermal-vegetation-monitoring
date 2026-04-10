# Noyafa NF-521 Thermal Image Format Documentation

## Overview

The Noyafa NF-521 USB-C thermal camera produces JPEG images with embedded raw thermal data in APP2 segments. This document describes the binary structure and calibration formula for extracting accurate temperature values.

## Calibration Formula

**Two-Step Per-Image Calibration:**

Each image has its own temperature scale stored in the DYTS metadata. The calibration is a two-step process:

### Step 1: Extract Per-Image Temperature Range from DYTS

Read uint16 values at offsets 0x1C and 0x1E in the DYTS segment:

```
v1c = uint16_LE @ DYTS offset 0x1C
v1e = uint16_LE @ DYTS offset 0x1E

temp_max = 0.015594 * v1c - 272.55
temp_min = 0.015772 * v1e - 275.86
```

### Step 2: Map Raw Thermal Values to Temperature

Raw thermal values are normalized to a reference range [15432, 25674], then mapped to the per-image temperature range:

```
temp_C = temp_min + (raw - 15432) / (25674 - 15432) * (temp_max - temp_min)
```

Or equivalently:
```
temp_C = temp_min + (raw - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (temp_max - temp_min)
```

Where:
- `RAW_MIN_REF` = 15432 (corresponds to temp_min)
- `RAW_MAX_REF` = 25674 (corresponds to temp_max)

### Example Calibration

| Image | v1c | v1e | temp_min | temp_max | Temperature Range |
|-------|-----|-----|----------|----------|-------------------|
| Image 1 | 19600 | 18496 | 15.9°C | 33.1°C | 17.2°C span |
| Image 2 | 19420 | 18644 | 18.2°C | 30.3°C | 12.1°C span |
| Image 3 | 19024 | 18500 | 15.9°C | 24.1°C | 8.2°C span |
| Image 4 | 18964 | 18532 | 16.4°C | 23.2°C | 6.8°C span |

## JPEG File Structure

```
Offset      Marker    Length    Description
--------    ------    ------    -----------
0x0000      FFD8      -         SOI (Start of Image)
0x0002      FFE0      16        APP0 (JFIF marker)
0x0014      FFE2      1642      APP2 - DYTS metadata segment
0x0680      FFE2      65535     APP2 - Thermal data segment 1
0x10681     FFE2      32773     APP2 - Thermal data segment 2
0x18688     FFDB      67        DQT (Quantization table)
...         ...       ...       Standard JPEG markers
0x18823     FFDA      ...       SOS (Start of Scan) - visible image data
...         FFD9      -         EOI (End of Image)
```

## APP2 DYTS Metadata Segment

The first APP2 segment contains device metadata with the signature `dyts`.

### Structure (1642 bytes total)

```
Offset    Type       Value/Description
------    ----       -----------------
0x000     char[4]    "dyts" - Segment signature
0x004     uint8      0x0B - Version?
0x006     uint16     0x0668 (1640) - Data length
0x01C     uint16     v1c - Per-image calibration (encodes temp_max)
0x01E     uint16     v1e - Per-image calibration (encodes temp_min)
0x030     char[32]   "CA10DYTCA10DJK010010CA10D1234567" - Internal code
0x084     char[16]   "sensor1234567890" - Sensor identifier
0x0E8     char[...]  "lensName=CA10D12lensPn===CA10D12lensSn===CA10D12"
0x118     float32    55.5 - Camera static calibration (not used per-image)
0x11C     float32    33.3 - Camera static calibration (not used per-image)
0x120     float32    88.8 - Calibration parameter (unknown purpose)
0x128     float32    77.7 - Calibration parameter (unknown purpose)
```

**Important:** The values at 0x01C and 0x01E are **per-image** and encode the temperature range for that specific image. The values 55.5, 33.3, 88.8, 77.7 at 0x118-0x128 are static camera constants and are NOT used for per-image temperature conversion.

### Detecting Noyafa Images

```python
# Check for 'dyts' signature in first APP2 segment
def is_noyafa_image(data):
    for i in range(min(len(data), 100)):
        if data[i:i+2] == b'\xff\xe2':  # APP2 marker
            if data[i+4:i+8] == b'dyts':
                return True
    return False
```

## APP2 Thermal Data Segments

Segments 2 and 3 contain raw 16-bit thermal data for the 256x192 pixel sensor.

### Structure

- **Total thermal pixels:** 256 × 192 = 49,152 pixels
- **Total thermal bytes:** 49,152 × 2 = 98,304 bytes
- **Segment 2:** 65,535 bytes (32,766 pixels)
- **Segment 3:** 32,773 bytes (16,386 pixels)
- **Format:** 16-bit unsigned integers, little-endian

### Extracting Raw Thermal Data

```python
import struct

def extract_thermal_data(filepath):
    """Extract raw 16-bit thermal values from Noyafa image."""
    with open(filepath, 'rb') as f:
        data = f.read()

    raw_values = []
    i = 1664  # Skip first APP2 (DYTS) segment

    while i < len(data) - 4:
        if data[i] == 0xFF and data[i+1] == 0xE2:
            length = (data[i+2] << 8) | data[i+3]
            # Read 16-bit LE values from segment
            for j in range(i + 4, i + 2 + length - 1, 2):
                if j + 1 < len(data):
                    val = data[j] | (data[j+1] << 8)
                    raw_values.append(val)
            i += 2 + length
        else:
            i += 1

    # Return first 256x192 values
    return raw_values[:256 * 192]
```

### Valid Thermal Value Range

- **Valid range:** ~15,000 - ~26,000 (for typical ambient temperatures)
- **Typical vegetation:** ~17,000 - ~21,000 (corresponds to ~19°C - ~26°C)
- **Values outside range:** May be noise, overlay text, or edge artifacts

### Filtering Strategy

```python
import numpy as np

raw = np.array(raw_values)

# Filter to plausible thermal range
valid_mask = (raw >= 15000) & (raw <= 26000)
valid_raw = raw[valid_mask]

# Convert to temperature
temps = valid_raw / 536.1 - 12.88
```

## Temperature Statistics

### Computing Image Statistics

```python
SCALE = 536.1
OFFSET = -12.88

def compute_temp_stats(raw_values):
    """Compute temperature statistics from raw thermal data."""
    raw = np.array(raw_values)

    # Filter valid thermal values
    valid_mask = (raw >= 15000) & (raw <= 26000)
    valid_raw = raw[valid_mask]

    # Convert to Celsius
    temps = valid_raw / SCALE + OFFSET

    return {
        'min': temps.min(),
        'max': temps.max(),
        'mean': temps.mean(),
        'std': temps.std(),
        'valid_pixels': len(temps),
        'total_pixels': len(raw)
    }
```

## JavaScript Implementation

```javascript
// Noyafa NF-521 two-step calibration constants
const TEMP_MAX_SLOPE = 0.015594;
const TEMP_MAX_OFFSET = -272.55;
const TEMP_MIN_SLOPE = 0.015772;
const TEMP_MIN_OFFSET = -275.86;
const RAW_MIN_REF = 15432;
const RAW_MAX_REF = 25674;

// Extract per-image temperature range from DYTS
function extractTempRange(bytes, dytsOffset) {
    var v1c = bytes[dytsOffset + 0x1C] | (bytes[dytsOffset + 0x1C + 1] << 8);
    var v1e = bytes[dytsOffset + 0x1E] | (bytes[dytsOffset + 0x1E + 1] << 8);
    return {
        tempMax: TEMP_MAX_SLOPE * v1c + TEMP_MAX_OFFSET,
        tempMin: TEMP_MIN_SLOPE * v1e + TEMP_MIN_OFFSET
    };
}

// Convert raw value to temperature using per-image calibration
function rawToTemp(raw, tempMin, tempMax) {
    return tempMin + (raw - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (tempMax - tempMin);
}

function extractNoyafaRawData(bytes) {
    var rawValues = [];
    var i = 1664; // After DYTS segment

    while (i < bytes.length - 4) {
        if (bytes[i] === 0xFF && bytes[i+1] === 0xE2) {
            var length = (bytes[i+2] << 8) | bytes[i+3];
            for (var j = i + 4; j < i + 2 + length - 1; j += 2) {
                var val = bytes[j] | (bytes[j+1] << 8);
                if (val >= 15000 && val <= 26000) {
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

## Known Limitations

1. **Colormap-based estimation:** When raw thermal data is unavailable, temperature must be estimated from the colorized JPEG pixels, which is less accurate.

2. **Edge artifacts:** Values at image edges may contain noise or invalid data.

3. **Temperature overlay:** The visible image includes temperature text overlays that don't affect the raw thermal data but may affect colormap-based estimation.

4. **Calibration drift:** Camera calibration may vary slightly between units; the formula was derived from a single camera.

## File Identification

| Feature | Value |
|---------|-------|
| Visible image size | 1412 × 1059 pixels |
| Thermal sensor size | 256 × 192 pixels |
| DYTS signature | `dyts` at offset 24 |
| APP2 segment count | 3 |
| Raw data format | 16-bit LE unsigned int |

## References

- Reverse-engineered from Noyafa NF-521 thermal images (April 2025)
- Calibration verified against displayed temperatures on reference images
- Document created: April 2026

---

*This documentation was created through reverse engineering of the Noyafa NF-521 thermal image format. Use at your own risk.*
