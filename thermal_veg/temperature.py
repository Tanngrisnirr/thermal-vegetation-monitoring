"""
Temperature extraction from thermal images.

Supports various methods depending on image format and camera type.
"""

import struct
import numpy as np
from typing import Tuple, Optional, Dict, Any, List
from PIL import Image


# =============================================================================
# Noyafa NF-521 Calibration Constants
# =============================================================================
# Two-step calibration formula:
# Step 1: Read per-image temp range from DYTS metadata
#   temp_max = 0.015594 * u16@0x1C - 272.55
#   temp_min = 0.015772 * u16@0x1E - 275.86
# Step 2: Map raw thermal values to temperature range
#   temp = temp_min + (raw - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (temp_max - temp_min)

# Per-image temperature extraction from DYTS
TEMP_MAX_SLOPE = 0.015594
TEMP_MAX_OFFSET = -272.55
TEMP_MIN_SLOPE = 0.015772
TEMP_MIN_OFFSET = -275.86

# Raw thermal value reference range (normalized across all images)
RAW_MIN_REF = 15432  # Corresponds to temp_min
RAW_MAX_REF = 25674  # Corresponds to temp_max

# Valid raw thermal value range (filters noise and artifacts)
NOYAFA_RAW_MIN = 15000
NOYAFA_RAW_MAX = 26000

# Thermal sensor dimensions
NOYAFA_SENSOR_WIDTH = 256
NOYAFA_SENSOR_HEIGHT = 192
NOYAFA_SENSOR_PIXELS = NOYAFA_SENSOR_WIDTH * NOYAFA_SENSOR_HEIGHT


def noyafa_raw_to_temp(raw: np.ndarray, temp_min: float, temp_max: float) -> np.ndarray:
    """
    Convert Noyafa raw thermal values to temperature in Celsius.

    Uses per-image calibration: maps raw values from [RAW_MIN_REF, RAW_MAX_REF]
    to [temp_min, temp_max].

    Args:
        raw: Raw 16-bit thermal values (single value or array)
        temp_min: Per-image minimum temperature from DYTS
        temp_max: Per-image maximum temperature from DYTS

    Returns:
        Temperature(s) in Celsius
    """
    raw_float = raw.astype(np.float32) if isinstance(raw, np.ndarray) else float(raw)
    return temp_min + (raw_float - RAW_MIN_REF) / (RAW_MAX_REF - RAW_MIN_REF) * (temp_max - temp_min)


def noyafa_temp_to_raw(temp_c: float, temp_min: float, temp_max: float) -> int:
    """
    Convert temperature in Celsius to Noyafa raw value.

    Args:
        temp_c: Temperature in Celsius
        temp_min: Per-image minimum temperature from DYTS
        temp_max: Per-image maximum temperature from DYTS

    Returns:
        Raw 16-bit thermal value
    """
    return int(RAW_MIN_REF + (temp_c - temp_min) / (temp_max - temp_min) * (RAW_MAX_REF - RAW_MIN_REF))


def is_noyafa_image(data: bytes) -> bool:
    """
    Check if image data is from a Noyafa thermal camera.

    Looks for 'dyts' signature in APP2 segment.

    Args:
        data: Raw bytes of the JPEG file

    Returns:
        True if Noyafa image detected
    """
    search_len = min(len(data), 200)
    for i in range(search_len - 8):
        if data[i:i+2] == b'\xff\xe2':  # APP2 marker
            if data[i+4:i+8] == b'dyts':
                return True
    return False


def extract_noyafa_metadata(data: bytes) -> Dict[str, Any]:
    """
    Extract metadata from Noyafa thermal image.

    Args:
        data: Raw bytes of the JPEG file

    Returns:
        Dictionary with metadata including per-image temperature range
    """
    metadata = {
        'detected': False,
        'brand': None,
        'model': None,
        'sensor_width': None,
        'sensor_height': None,
        'temp_min_img': None,  # Per-image min temperature from DYTS
        'temp_max_img': None,  # Per-image max temperature from DYTS
        'cal_values': {},
    }

    # Find dyts segment
    for i in range(min(len(data), 200) - 8):
        if data[i:i+2] == b'\xff\xe2' and data[i+4:i+8] == b'dyts':
            metadata['detected'] = True
            metadata['brand'] = 'Noyafa'
            metadata['model'] = 'NF-521'

            dyts_start = i + 4  # Start of dyts data (after 'dyts' signature)

            # Use known constants for NF-521 sensor
            metadata['sensor_width'] = NOYAFA_SENSOR_WIDTH
            metadata['sensor_height'] = NOYAFA_SENSOR_HEIGHT

            # Extract per-image temperature range from offsets 0x1C and 0x1E
            # These uint16 values encode the image's temperature scale
            if dyts_start + 0x20 < len(data):
                v1c = struct.unpack('<H', data[dyts_start + 0x1C:dyts_start + 0x1E])[0]
                v1e = struct.unpack('<H', data[dyts_start + 0x1E:dyts_start + 0x20])[0]

                # Convert to temperatures using derived formula
                metadata['temp_max_img'] = TEMP_MAX_SLOPE * v1c + TEMP_MAX_OFFSET
                metadata['temp_min_img'] = TEMP_MIN_SLOPE * v1e + TEMP_MIN_OFFSET
                metadata['cal_values']['v1c'] = v1c
                metadata['cal_values']['v1e'] = v1e

            # Also extract the static calibration floats for reference
            static_cal_offsets = {
                'cal_55_5': 0x118,
                'cal_33_3': 0x11C,
                'cal_88_8': 0x120,
                'cal_77_7': 0x128,
            }
            for name, offset in static_cal_offsets.items():
                pos = dyts_start + offset
                if pos + 4 < len(data):
                    metadata['cal_values'][name] = struct.unpack('<f', data[pos:pos+4])[0]

            break

    return metadata


def extract_noyafa_raw_thermal(data: bytes) -> np.ndarray:
    """
    Extract raw 16-bit thermal values from Noyafa image.

    Args:
        data: Raw bytes of the JPEG file

    Returns:
        Numpy array of raw thermal values, shape (192, 256) if complete
    """
    raw_values = []
    i = 1664  # Start after first APP2 (DYTS) segment

    while i < len(data) - 4 and len(raw_values) < NOYAFA_SENSOR_PIXELS:
        if data[i] == 0xFF and data[i+1] == 0xE2:
            length = (data[i+2] << 8) | data[i+3]
            # Read 16-bit LE values from segment
            for j in range(i + 4, min(i + 2 + length, len(data) - 1), 2):
                val = data[j] | (data[j+1] << 8)
                raw_values.append(val)
                if len(raw_values) >= NOYAFA_SENSOR_PIXELS:
                    break
            i += 2 + length
        else:
            i += 1

    # Create array and reshape
    raw = np.array(raw_values[:NOYAFA_SENSOR_PIXELS], dtype=np.uint16)

    # Reshape to sensor dimensions if we have exactly the right number
    if len(raw) == NOYAFA_SENSOR_PIXELS:
        raw = raw.reshape((NOYAFA_SENSOR_HEIGHT, NOYAFA_SENSOR_WIDTH))

    return raw


def extract_noyafa_temperatures(filepath: str) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Extract temperature array from a Noyafa thermal image file.

    Args:
        filepath: Path to the JPEG file

    Returns:
        Tuple of (temperature_array, metadata)
        Temperature array is shape (192, 256) in Celsius
    """
    with open(filepath, 'rb') as f:
        data = f.read()

    if not is_noyafa_image(data):
        raise ValueError("Not a Noyafa thermal image (no 'dyts' signature found)")

    metadata = extract_noyafa_metadata(data)
    raw = extract_noyafa_raw_thermal(data)

    # Get per-image temperature range
    temp_min_img = metadata.get('temp_min_img')
    temp_max_img = metadata.get('temp_max_img')

    if temp_min_img is None or temp_max_img is None:
        raise ValueError("Could not extract per-image temperature range from DYTS")

    # Convert raw to temperature using per-image calibration
    temps = noyafa_raw_to_temp(raw, temp_min_img, temp_max_img)

    # Mark invalid values as NaN (pixels outside valid thermal range)
    invalid_mask = (raw < NOYAFA_RAW_MIN) | (raw > NOYAFA_RAW_MAX)
    temps[invalid_mask] = np.nan

    # Add temperature stats to metadata
    valid_temps = temps[~np.isnan(temps)]
    if len(valid_temps) > 0:
        metadata['temp_min'] = float(np.min(valid_temps))
        metadata['temp_max'] = float(np.max(valid_temps))
        metadata['temp_mean'] = float(np.mean(valid_temps))
        metadata['temp_std'] = float(np.std(valid_temps))
        metadata['valid_pixels'] = int(len(valid_temps))
        metadata['total_pixels'] = int(temps.size)

    return temps, metadata


def extract_temperature_from_colormap(
    image: np.ndarray,
    temp_min: float = 0.0,
    temp_max: float = 50.0,
    colormap: str = 'iron'
) -> np.ndarray:
    """
    Estimate temperature from a colorized thermal image.

    This is an approximation for cameras that output colored JPEGs
    without embedded radiometric data.

    Args:
        image: RGB image array (height, width, 3)
        temp_min: Minimum temperature in the image (°C)
        temp_max: Maximum temperature in the image (°C)
        colormap: Color palette used ('iron', 'rainbow', 'grayscale')

    Returns:
        2D array of estimated temperatures
    """
    if len(image.shape) != 3:
        raise ValueError("Expected RGB image with 3 channels")

    height, width = image.shape[:2]
    temperatures = np.zeros((height, width), dtype=np.float32)

    if colormap == 'grayscale':
        # Simple grayscale: intensity maps to temperature
        gray = np.mean(image, axis=2)
        temperatures = temp_min + (gray / 255.0) * (temp_max - temp_min)

    elif colormap == 'iron':
        # Iron/Ironbow palette: blue (cold) -> red -> yellow -> white (hot)
        # Approximate by using a combination of channels
        r, g, b = image[:, :, 0], image[:, :, 1], image[:, :, 2]

        # Heuristic: high R and low B = hot, low R and high B = cold
        # Yellow/white = very hot
        heat_index = (r.astype(float) - b.astype(float) + 255) / 510.0
        heat_index += (g.astype(float) / 255.0) * 0.3  # Yellow boost

        heat_index = np.clip(heat_index, 0, 1)
        temperatures = temp_min + heat_index * (temp_max - temp_min)

    elif colormap == 'rainbow':
        # Rainbow: blue -> cyan -> green -> yellow -> red
        r, g, b = image[:, :, 0], image[:, :, 1], image[:, :, 2]

        # Convert to HSV-like hue
        heat_index = np.zeros((height, width), dtype=np.float32)

        # Blue (cold) -> Red (hot) using hue
        max_rgb = np.maximum(np.maximum(r, g), b)
        min_rgb = np.minimum(np.minimum(r, g), b)
        delta = max_rgb - min_rgb + 1e-6

        # Simplified hue calculation
        hue = np.zeros_like(heat_index)
        mask_r = (max_rgb == r)
        mask_g = (max_rgb == g)
        mask_b = (max_rgb == b)

        hue[mask_r] = ((g[mask_r] - b[mask_r]) / delta[mask_r]) % 6
        hue[mask_g] = ((b[mask_g] - r[mask_g]) / delta[mask_g]) + 2
        hue[mask_b] = ((r[mask_b] - g[mask_b]) / delta[mask_b]) + 4

        hue = hue / 6.0  # Normalize to 0-1

        # Rainbow goes from blue (hue ~0.66) through green to red (hue ~0)
        # Invert so blue=cold, red=hot
        heat_index = 1.0 - hue
        heat_index = np.clip(heat_index, 0, 1)

        temperatures = temp_min + heat_index * (temp_max - temp_min)

    else:
        raise ValueError(f"Unknown colormap: {colormap}")

    return temperatures


def extract_temperature_grayscale(
    image: np.ndarray,
    temp_min: float = 0.0,
    temp_max: float = 50.0
) -> np.ndarray:
    """
    Extract temperature from a grayscale thermal image.

    Args:
        image: Grayscale image (height, width) or RGB
        temp_min: Minimum temperature
        temp_max: Maximum temperature

    Returns:
        2D array of temperatures
    """
    if len(image.shape) == 3:
        gray = np.mean(image, axis=2)
    else:
        gray = image.astype(np.float32)

    # Normalize and scale
    normalized = gray / 255.0
    temperatures = temp_min + normalized * (temp_max - temp_min)

    return temperatures


def calibrate_temperature(
    image: np.ndarray,
    reference_points: list,
    colormap: str = 'iron'
) -> Tuple[float, float]:
    """
    Calibrate temperature range using known reference points.

    Args:
        image: RGB thermal image
        reference_points: List of dicts with 'x', 'y', 'temp' keys
                         representing known temperature points
        colormap: Color palette used

    Returns:
        Tuple of (temp_min, temp_max) calibrated values
    """
    if len(reference_points) < 2:
        raise ValueError("Need at least 2 reference points for calibration")

    # Get raw values at reference points
    raw_temps = extract_temperature_from_colormap(
        image, temp_min=0.0, temp_max=1.0, colormap=colormap
    )

    raw_values = []
    actual_temps = []

    for point in reference_points:
        x, y = int(point['x']), int(point['y'])
        raw_values.append(raw_temps[y, x])
        actual_temps.append(point['temp'])

    # Linear regression to find scale
    raw_values = np.array(raw_values)
    actual_temps = np.array(actual_temps)

    # y = mx + b => temp = scale * raw + offset
    A = np.vstack([raw_values, np.ones(len(raw_values))]).T
    scale, offset = np.linalg.lstsq(A, actual_temps, rcond=None)[0]

    temp_min = offset
    temp_max = scale + offset

    return temp_min, temp_max


def get_temperature_at_point(
    temp_array: np.ndarray,
    x: int,
    y: int,
    radius: int = 0
) -> float:
    """
    Get temperature at a specific point, optionally averaging a neighborhood.

    Args:
        temp_array: 2D temperature array
        x: X coordinate
        y: Y coordinate
        radius: Radius for averaging (0 = single pixel)

    Returns:
        Temperature value
    """
    if radius == 0:
        return float(temp_array[y, x])

    height, width = temp_array.shape
    y_min = max(0, y - radius)
    y_max = min(height, y + radius + 1)
    x_min = max(0, x - radius)
    x_max = min(width, x + radius + 1)

    region = temp_array[y_min:y_max, x_min:x_max]
    return float(np.nanmean(region))


def detect_colormap(image: np.ndarray) -> str:
    """
    Attempt to detect the colormap used in a thermal image.

    Args:
        image: RGB image array

    Returns:
        Detected colormap name ('iron', 'rainbow', 'grayscale', 'unknown')
    """
    if len(image.shape) != 3:
        return 'grayscale'

    r, g, b = image[:, :, 0], image[:, :, 1], image[:, :, 2]

    # Check if grayscale
    if np.allclose(r, g, atol=10) and np.allclose(g, b, atol=10):
        return 'grayscale'

    # Check color distribution
    r_mean, g_mean, b_mean = r.mean(), g.mean(), b.mean()

    # Iron palette tends to have more red/yellow
    if r_mean > b_mean * 1.2:
        return 'iron'

    # Rainbow has more even distribution with peaks
    return 'rainbow'
