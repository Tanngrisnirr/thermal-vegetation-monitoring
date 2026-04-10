"""
Polygon exclusion zones management.

Allows defining regions to exclude from temperature analysis
(e.g., non-vegetation areas like paths, buildings, sky).
"""

import json
import numpy as np
from typing import List, Tuple, Dict, Optional


def is_point_in_polygon(x: float, y: float, polygon: List[Tuple[float, float]]) -> bool:
    """
    Check if a point is inside a polygon using ray casting algorithm.

    Adapted from ANTWORLD grader.html isPointInPolygon function.

    Args:
        x: X coordinate of the point
        y: Y coordinate of the point
        polygon: List of (x, y) tuples defining the polygon vertices

    Returns:
        True if point is inside the polygon
    """
    inside = False
    n = len(polygon)

    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]

        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
            inside = not inside
        j = i

    return inside


def load_zones(json_path: str) -> Dict:
    """
    Load exclusion zones from a JSON file.

    JSON format:
    {
        "image": "filename.jpg",
        "zones": [
            {
                "id": "zone_1",
                "type": "exclusion",
                "polygon": [[x1,y1], [x2,y2], ...]
            }
        ]
    }

    Args:
        json_path: Path to the JSON zones file

    Returns:
        Dictionary with zones data
    """
    with open(json_path, 'r') as f:
        return json.load(f)


def save_zones(zones: Dict, json_path: str) -> None:
    """
    Save exclusion zones to a JSON file.

    Args:
        zones: Dictionary with zones data
        json_path: Path to save the JSON file
    """
    with open(json_path, 'w') as f:
        json.dump(zones, f, indent=2)


def create_polygon_mask(
    shape: Tuple[int, int],
    polygon: List[Tuple[float, float]],
    include: bool = True
) -> np.ndarray:
    """
    Create a boolean mask from a polygon.

    Args:
        shape: (height, width) of the output mask
        polygon: List of (x, y) tuples defining the polygon
        include: If True, pixels inside polygon are True
                 If False, pixels inside polygon are False

    Returns:
        Boolean numpy array of shape (height, width)
    """
    height, width = shape
    mask = np.zeros((height, width), dtype=bool)

    # Get bounding box for optimization
    xs = [p[0] for p in polygon]
    ys = [p[1] for p in polygon]
    min_x, max_x = max(0, int(min(xs))), min(width, int(max(xs)) + 1)
    min_y, max_y = max(0, int(min(ys))), min(height, int(max(ys)) + 1)

    # Check each pixel in bounding box
    for y in range(min_y, max_y):
        for x in range(min_x, max_x):
            if is_point_in_polygon(x, y, polygon):
                mask[y, x] = True

    if not include:
        mask = ~mask

    return mask


def apply_exclusion_mask(
    data: np.ndarray,
    zones_data: Dict,
    fill_value: float = np.nan
) -> np.ndarray:
    """
    Apply exclusion zones to temperature data.

    Pixels inside exclusion zones are replaced with fill_value (default NaN).

    Args:
        data: 2D numpy array of temperature values
        zones_data: Dictionary with zones (from load_zones)
        fill_value: Value to assign to excluded pixels

    Returns:
        Copy of data with exclusion zones masked
    """
    result = data.copy().astype(float)

    zones = zones_data.get('zones', [])

    for zone in zones:
        if zone.get('type') == 'exclusion':
            polygon = [tuple(p) for p in zone['polygon']]
            mask = create_polygon_mask(data.shape, polygon, include=True)
            result[mask] = fill_value

    return result


def get_inclusion_mask(
    shape: Tuple[int, int],
    zones_data: Dict
) -> np.ndarray:
    """
    Get a boolean mask where True = pixel should be included in analysis.

    Args:
        shape: (height, width) of the output mask
        zones_data: Dictionary with zones data

    Returns:
        Boolean mask (True = include in analysis)
    """
    # Start with all pixels included
    mask = np.ones(shape, dtype=bool)

    zones = zones_data.get('zones', [])

    for zone in zones:
        if zone.get('type') == 'exclusion':
            polygon = [tuple(p) for p in zone['polygon']]
            exclusion_mask = create_polygon_mask(shape, polygon, include=True)
            mask[exclusion_mask] = False

    return mask


def create_empty_zones(image_path: str) -> Dict:
    """
    Create an empty zones structure for a new image.

    Args:
        image_path: Path or filename of the image

    Returns:
        Empty zones dictionary
    """
    return {
        "image": image_path,
        "zones": [],
        "metadata": {
            "created": None,  # Will be set by webapp
            "modified": None
        }
    }


def add_zone(
    zones_data: Dict,
    polygon: List[Tuple[float, float]],
    zone_type: str = "exclusion",
    zone_id: Optional[str] = None,
    label: Optional[str] = None
) -> Dict:
    """
    Add a new zone to the zones data.

    Args:
        zones_data: Existing zones dictionary
        polygon: List of (x, y) tuples defining the zone
        zone_type: Type of zone ("exclusion" or "inclusion")
        zone_id: Optional ID for the zone
        label: Optional label/description

    Returns:
        Updated zones dictionary
    """
    if zone_id is None:
        zone_id = f"zone_{len(zones_data.get('zones', [])) + 1}"

    new_zone = {
        "id": zone_id,
        "type": zone_type,
        "polygon": [list(p) for p in polygon]
    }

    if label:
        new_zone["label"] = label

    if 'zones' not in zones_data:
        zones_data['zones'] = []

    zones_data['zones'].append(new_zone)

    return zones_data
