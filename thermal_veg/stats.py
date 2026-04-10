"""
Statistical analysis of thermal images.

Computes temperature statistics with support for exclusion zones.
"""

import numpy as np
from typing import Dict, Optional, Any, List
from . import zones as zones_module


def compute_stats(
    temp_array: np.ndarray,
    exclusion_zones: Optional[Dict] = None,
    percentiles: List[int] = [5, 25, 50, 75, 95]
) -> Dict[str, Any]:
    """
    Compute comprehensive statistics on temperature data.

    Args:
        temp_array: 2D array of temperature values
        exclusion_zones: Optional zones data to exclude from analysis
        percentiles: List of percentiles to compute

    Returns:
        Dictionary with statistical measures
    """
    # Apply exclusion zones if provided
    if exclusion_zones is not None:
        data = zones_module.apply_exclusion_mask(temp_array, exclusion_zones)
    else:
        data = temp_array.astype(float)

    # Flatten and remove NaN values for statistics
    valid_data = data[~np.isnan(data)]

    if len(valid_data) == 0:
        return {
            'count': 0,
            'min': np.nan,
            'max': np.nan,
            'mean': np.nan,
            'median': np.nan,
            'std': np.nan,
            'var': np.nan,
            'range': np.nan,
            'percentiles': {p: np.nan for p in percentiles},
            'excluded_pixels': int(np.isnan(data).sum()),
            'total_pixels': int(data.size)
        }

    stats = {
        'count': len(valid_data),
        'min': float(np.min(valid_data)),
        'max': float(np.max(valid_data)),
        'mean': float(np.mean(valid_data)),
        'median': float(np.median(valid_data)),
        'std': float(np.std(valid_data)),
        'var': float(np.var(valid_data)),
        'range': float(np.max(valid_data) - np.min(valid_data)),
        'percentiles': {
            p: float(np.percentile(valid_data, p)) for p in percentiles
        },
        'excluded_pixels': int(np.isnan(data).sum()),
        'total_pixels': int(data.size)
    }

    return stats


def compute_histogram(
    temp_array: np.ndarray,
    exclusion_zones: Optional[Dict] = None,
    bins: int = 50,
    range_limits: Optional[tuple] = None
) -> Dict[str, Any]:
    """
    Compute temperature histogram.

    Args:
        temp_array: 2D array of temperature values
        exclusion_zones: Optional zones to exclude
        bins: Number of histogram bins
        range_limits: Optional (min, max) range for histogram

    Returns:
        Dictionary with histogram data
    """
    if exclusion_zones is not None:
        data = zones_module.apply_exclusion_mask(temp_array, exclusion_zones)
    else:
        data = temp_array.astype(float)

    valid_data = data[~np.isnan(data)]

    if range_limits is None:
        range_limits = (np.min(valid_data), np.max(valid_data))

    counts, bin_edges = np.histogram(valid_data, bins=bins, range=range_limits)

    return {
        'counts': counts.tolist(),
        'bin_edges': bin_edges.tolist(),
        'bin_centers': ((bin_edges[:-1] + bin_edges[1:]) / 2).tolist()
    }


def compute_spatial_gradient(temp_array: np.ndarray) -> Dict[str, np.ndarray]:
    """
    Compute spatial temperature gradients.

    Args:
        temp_array: 2D temperature array

    Returns:
        Dictionary with gradient arrays
    """
    grad_y, grad_x = np.gradient(temp_array)

    magnitude = np.sqrt(grad_x**2 + grad_y**2)
    direction = np.arctan2(grad_y, grad_x)

    return {
        'gradient_x': grad_x,
        'gradient_y': grad_y,
        'magnitude': magnitude,
        'direction': direction,
        'max_gradient': float(np.nanmax(magnitude)),
        'mean_gradient': float(np.nanmean(magnitude))
    }


def compare_regions(
    temp_array: np.ndarray,
    region_zones: Dict,
    region_ids: List[str]
) -> Dict[str, Dict]:
    """
    Compare statistics between multiple regions.

    Args:
        temp_array: 2D temperature array
        region_zones: Zones data with region definitions
        region_ids: List of zone IDs to compare

    Returns:
        Dictionary with stats for each region
    """
    results = {}

    for zone_id in region_ids:
        # Find the zone
        zone = None
        for z in region_zones.get('zones', []):
            if z.get('id') == zone_id:
                zone = z
                break

        if zone is None:
            results[zone_id] = {'error': 'Zone not found'}
            continue

        # Create mask for this zone
        polygon = [tuple(p) for p in zone['polygon']]
        mask = zones_module.create_polygon_mask(temp_array.shape, polygon, include=True)

        # Extract values inside zone
        zone_data = temp_array.copy().astype(float)
        zone_data[~mask] = np.nan

        # Compute stats
        valid = zone_data[~np.isnan(zone_data)]
        if len(valid) > 0:
            results[zone_id] = {
                'count': len(valid),
                'min': float(np.min(valid)),
                'max': float(np.max(valid)),
                'mean': float(np.mean(valid)),
                'std': float(np.std(valid))
            }
        else:
            results[zone_id] = {'error': 'No valid pixels in zone'}

    return results


def detect_hotspots(
    temp_array: np.ndarray,
    threshold: Optional[float] = None,
    percentile: float = 95,
    min_area: int = 10
) -> List[Dict]:
    """
    Detect temperature hotspots in the image.

    Args:
        temp_array: 2D temperature array
        threshold: Absolute temperature threshold (optional)
        percentile: Percentile threshold if no absolute threshold given
        min_area: Minimum number of pixels for a hotspot

    Returns:
        List of hotspot dictionaries with location and stats
    """
    from scipy import ndimage

    if threshold is None:
        threshold = np.nanpercentile(temp_array, percentile)

    # Create binary mask of hot regions
    hot_mask = temp_array >= threshold

    # Label connected regions
    labeled, num_features = ndimage.label(hot_mask)

    hotspots = []
    for i in range(1, num_features + 1):
        region_mask = labeled == i
        area = np.sum(region_mask)

        if area >= min_area:
            region_temps = temp_array[region_mask]

            # Find centroid
            coords = np.argwhere(region_mask)
            centroid_y = coords[:, 0].mean()
            centroid_x = coords[:, 1].mean()

            hotspots.append({
                'id': i,
                'centroid': (float(centroid_x), float(centroid_y)),
                'area_pixels': int(area),
                'max_temp': float(np.max(region_temps)),
                'mean_temp': float(np.mean(region_temps)),
                'bounding_box': {
                    'min_x': int(coords[:, 1].min()),
                    'max_x': int(coords[:, 1].max()),
                    'min_y': int(coords[:, 0].min()),
                    'max_y': int(coords[:, 0].max())
                }
            })

    return sorted(hotspots, key=lambda h: h['max_temp'], reverse=True)
