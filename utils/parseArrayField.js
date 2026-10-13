/* =====================================================
   PARSE ARRAY FIELDS UTILITY
   ===================================================== */

/**

 */
const parseArrayField = value => {
  if (Array.isArray(value)) return value;

  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Obsługa zwykłego tekstu oddzielonego przecinkami.
  }

  return value.split(',').map(item => item.trim()).filter(Boolean);
};

/* =====================================================
   EXPORT
   ===================================================== */

module.exports = parseArrayField;