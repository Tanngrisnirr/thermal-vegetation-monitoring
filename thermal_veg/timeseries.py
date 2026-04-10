"""
Time series analysis and sample management.

Organize thermal images by samples (location/time) and analyze trends.
"""

import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
import numpy as np

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

from . import io as io_module
from . import temperature
from . import stats
from . import zones


def load_sample_catalog(csv_path: str) -> 'pd.DataFrame':
    """
    Load a sample catalog from CSV.

    Expected columns:
    - filename: Image filename
    - sample_id: Sample identifier
    - location: Location name
    - latitude, longitude: Coordinates (optional)
    - datetime: ISO format datetime
    - notes: Optional notes

    Args:
        csv_path: Path to CSV file

    Returns:
        Pandas DataFrame with sample data
    """
    if not HAS_PANDAS:
        raise ImportError("pandas required for sample management")

    df = pd.read_csv(csv_path)

    # Parse datetime if present
    if 'datetime' in df.columns:
        df['datetime'] = pd.to_datetime(df['datetime'])

    return df


def save_sample_catalog(df: 'pd.DataFrame', csv_path: str) -> None:
    """
    Save sample catalog to CSV.

    Args:
        df: Sample DataFrame
        csv_path: Output path
    """
    df.to_csv(csv_path, index=False)


def create_sample_catalog(
    image_dir: str,
    output_csv: str,
    extract_datetime: bool = True
) -> 'pd.DataFrame':
    """
    Create a sample catalog from a directory of images.

    Args:
        image_dir: Directory containing images
        output_csv: Path for output CSV
        extract_datetime: Try to extract datetime from EXIF

    Returns:
        DataFrame with basic catalog
    """
    if not HAS_PANDAS:
        raise ImportError("pandas required for sample management")

    images = io_module.list_images(image_dir)

    records = []
    for img_path in images:
        filename = os.path.basename(img_path)

        record = {
            'filename': filename,
            'sample_id': '',
            'location': '',
            'latitude': None,
            'longitude': None,
            'datetime': None,
            'notes': ''
        }

        if extract_datetime:
            _, metadata = io_module.load_thermal_image(img_path)
            if metadata.get('datetime'):
                record['datetime'] = metadata['datetime']

        records.append(record)

    df = pd.DataFrame(records)
    save_sample_catalog(df, output_csv)

    return df


def analyze_time_series(
    catalog_df: 'pd.DataFrame',
    image_dir: str,
    zones_dir: Optional[str] = None,
    temp_range: Tuple[float, float] = (0, 50),
    colormap: str = 'iron'
) -> 'pd.DataFrame':
    """
    Analyze temperature time series across samples.

    Args:
        catalog_df: Sample catalog DataFrame
        image_dir: Directory containing images
        zones_dir: Optional directory with zone JSON files
        temp_range: (min, max) temperature range for extraction
        colormap: Colormap used in images

    Returns:
        DataFrame with temperature statistics for each image
    """
    if not HAS_PANDAS:
        raise ImportError("pandas required")

    results = []

    for idx, row in catalog_df.iterrows():
        img_path = os.path.join(image_dir, row['filename'])

        if not os.path.exists(img_path):
            continue

        # Load image
        img_array, metadata = io_module.load_thermal_image(img_path)

        # Extract temperature
        temp_array = temperature.extract_temperature_from_colormap(
            img_array,
            temp_min=temp_range[0],
            temp_max=temp_range[1],
            colormap=colormap
        )

        # Load zones if available
        exclusion_zones = None
        if zones_dir:
            zone_file = os.path.join(zones_dir, f"{row['filename']}.zones.json")
            if os.path.exists(zone_file):
                exclusion_zones = zones.load_zones(zone_file)

        # Compute statistics
        img_stats = stats.compute_stats(temp_array, exclusion_zones)

        result = {
            'filename': row['filename'],
            'sample_id': row.get('sample_id', ''),
            'location': row.get('location', ''),
            'datetime': row.get('datetime'),
            'temp_min': img_stats['min'],
            'temp_max': img_stats['max'],
            'temp_mean': img_stats['mean'],
            'temp_median': img_stats['median'],
            'temp_std': img_stats['std'],
            'valid_pixels': img_stats['count'],
            'excluded_pixels': img_stats['excluded_pixels']
        }

        results.append(result)

    return pd.DataFrame(results)


def group_by_sample(
    results_df: 'pd.DataFrame'
) -> 'pd.DataFrame':
    """
    Aggregate results by sample_id.

    Args:
        results_df: Time series results DataFrame

    Returns:
        Aggregated DataFrame
    """
    if not HAS_PANDAS:
        raise ImportError("pandas required")

    grouped = results_df.groupby('sample_id').agg({
        'location': 'first',
        'temp_min': ['min', 'mean'],
        'temp_max': ['max', 'mean'],
        'temp_mean': ['mean', 'std'],
        'datetime': ['min', 'max', 'count']
    })

    # Flatten column names
    grouped.columns = ['_'.join(col).strip() for col in grouped.columns.values]
    grouped = grouped.reset_index()

    return grouped


def group_by_location(
    results_df: 'pd.DataFrame'
) -> 'pd.DataFrame':
    """
    Aggregate results by location.

    Args:
        results_df: Time series results DataFrame

    Returns:
        Aggregated DataFrame
    """
    if not HAS_PANDAS:
        raise ImportError("pandas required")

    grouped = results_df.groupby('location').agg({
        'sample_id': 'nunique',
        'temp_min': ['min', 'mean'],
        'temp_max': ['max', 'mean'],
        'temp_mean': ['mean', 'std'],
        'filename': 'count'
    })

    grouped.columns = ['_'.join(col).strip() for col in grouped.columns.values]
    grouped = grouped.reset_index()
    grouped = grouped.rename(columns={'filename_count': 'image_count'})

    return grouped


def compute_temporal_trend(
    results_df: 'pd.DataFrame',
    temperature_column: str = 'temp_mean'
) -> Dict[str, Any]:
    """
    Compute temporal trend in temperature.

    Args:
        results_df: Time series results with datetime column
        temperature_column: Column to analyze

    Returns:
        Dictionary with trend analysis
    """
    if not HAS_PANDAS:
        raise ImportError("pandas required")

    df = results_df.dropna(subset=['datetime', temperature_column]).copy()

    if len(df) < 2:
        return {'error': 'Not enough data points'}

    df = df.sort_values('datetime')

    # Convert datetime to numeric (hours since start)
    start_time = df['datetime'].min()
    df['hours'] = (df['datetime'] - start_time).dt.total_seconds() / 3600

    # Linear regression
    x = df['hours'].values
    y = df[temperature_column].values

    A = np.vstack([x, np.ones(len(x))]).T
    slope, intercept = np.linalg.lstsq(A, y, rcond=None)[0]

    # Correlation
    correlation = np.corrcoef(x, y)[0, 1]

    return {
        'slope_per_hour': float(slope),
        'slope_per_day': float(slope * 24),
        'intercept': float(intercept),
        'correlation': float(correlation),
        'start_time': str(start_time),
        'duration_hours': float(x.max()),
        'n_points': len(df)
    }


def export_for_plotting(
    results_df: 'pd.DataFrame',
    output_path: str,
    format: str = 'csv'
) -> None:
    """
    Export results in a format suitable for plotting software.

    Args:
        results_df: Results DataFrame
        output_path: Output file path
        format: 'csv' or 'json'
    """
    if format == 'csv':
        results_df.to_csv(output_path, index=False)
    elif format == 'json':
        results_df.to_json(output_path, orient='records', date_format='iso')
    else:
        raise ValueError(f"Unknown format: {format}")
