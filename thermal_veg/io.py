"""
Image I/O module for thermal images.

Supports loading thermal images from various formats and extracting
temperature data when available.
"""

import os
from pathlib import Path
from typing import Tuple, Optional, Dict, Any
import numpy as np
from PIL import Image

try:
    import exifread
    HAS_EXIFREAD = True
except ImportError:
    HAS_EXIFREAD = False


def load_image(path: str) -> np.ndarray:
    """
    Load an image file as a numpy array.

    Args:
        path: Path to the image file

    Returns:
        Numpy array of shape (height, width, channels) or (height, width)
    """
    img = Image.open(path)
    return np.array(img)


def load_thermal_image(path: str) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Load a thermal image and extract metadata.

    Args:
        path: Path to the thermal image

    Returns:
        Tuple of (image_array, metadata_dict)
    """
    img_array = load_image(path)
    metadata = extract_metadata(path)

    return img_array, metadata


def extract_metadata(path: str) -> Dict[str, Any]:
    """
    Extract EXIF and thermal metadata from an image.

    Args:
        path: Path to the image

    Returns:
        Dictionary with metadata
    """
    metadata = {
        'filename': os.path.basename(path),
        'path': str(path),
        'format': None,
        'size': None,
        'datetime': None,
        'thermal': {}
    }

    # Basic file info
    img = Image.open(path)
    metadata['format'] = img.format
    metadata['size'] = img.size  # (width, height)

    # EXIF data
    if HAS_EXIFREAD:
        with open(path, 'rb') as f:
            tags = exifread.process_file(f, details=False)

            if 'EXIF DateTimeOriginal' in tags:
                metadata['datetime'] = str(tags['EXIF DateTimeOriginal'])

            # Look for thermal-specific tags
            for tag, value in tags.items():
                if 'thermal' in tag.lower() or 'temperature' in tag.lower():
                    metadata['thermal'][tag] = str(value)

    return metadata


def get_image_dimensions(path: str) -> Tuple[int, int]:
    """
    Get image dimensions without loading full image.

    Args:
        path: Path to the image

    Returns:
        Tuple of (width, height)
    """
    with Image.open(path) as img:
        return img.size


def list_images(
    directory: str,
    extensions: Tuple[str, ...] = ('.jpg', '.jpeg', '.png', '.tiff', '.tif')
) -> list:
    """
    List all image files in a directory.

    Args:
        directory: Path to the directory
        extensions: Tuple of valid file extensions

    Returns:
        List of image file paths
    """
    path = Path(directory)
    images = []

    for ext in extensions:
        images.extend(path.glob(f'*{ext}'))
        images.extend(path.glob(f'*{ext.upper()}'))

    return sorted([str(p) for p in images])


def save_array_as_image(
    array: np.ndarray,
    path: str,
    colormap: Optional[str] = None
) -> None:
    """
    Save a numpy array as an image.

    Args:
        array: 2D numpy array
        path: Output path
        colormap: Optional matplotlib colormap name for visualization
    """
    if colormap:
        import matplotlib.pyplot as plt
        import matplotlib.cm as cm

        # Normalize to 0-1
        normalized = (array - np.nanmin(array)) / (np.nanmax(array) - np.nanmin(array))
        cmap = cm.get_cmap(colormap)
        colored = cmap(normalized)
        img = Image.fromarray((colored[:, :, :3] * 255).astype(np.uint8))
    else:
        if array.dtype == np.float64 or array.dtype == np.float32:
            # Normalize float arrays
            array = ((array - array.min()) / (array.max() - array.min()) * 255).astype(np.uint8)
        img = Image.fromarray(array)

    img.save(path)
