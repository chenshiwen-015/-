/* Shared by the live preview and PNG renderer. */
(function (root) {
  'use strict';
  const clamp = (value, low, high, fallback) => Number.isFinite(value) ? Math.min(high, Math.max(low, value)) : fallback;
  function normalize(crop = {}) {
    return {
      zoom: clamp(crop.zoom, .2, 5, 1), opacity: clamp(crop.opacity, 0, 1, 1),
      x: clamp(crop.x, 0, 100, 50), y: clamp(crop.y, 0, 100, 50),
      offsetX: clamp(crop.offsetX, -100, 100, 0), offsetY: clamp(crop.offsetY, -100, 100, 0),
      fit: ['auto', 'contain', 'cover'].includes(crop.fit) ? crop.fit : 'auto'
    };
  }
  function rectangle(imageWidth, imageHeight, width, height, input, defaultContain = false) {
    const crop = normalize(input);
    const contain = crop.fit === 'contain' || (crop.fit === 'auto' && defaultContain);
    const scale = (contain ? Math.min(width / imageWidth, height / imageHeight) : Math.max(width / imageWidth, height / imageHeight)) * crop.zoom;
    const dw = imageWidth * scale, dh = imageHeight * scale;
    // Translation is measured against the frame, so neither axis becomes a no-op at exact fit.
    // Legacy anchors remain for opening existing v1/v2 projects without moving their pictures.
    return { x: (width - dw) * crop.x / 100 + width * crop.offsetX / 100,
      y: (height - dh) * crop.y / 100 + height * crop.offsetY / 100, width: dw, height: dh };
  }
  const api = { normalize, rectangle };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CoverImageTransform = api;
})(typeof window === 'object' ? window : this);
