// Search utilities for Greek language support including Greeklish transliteration
// Supports: accent-insensitive matching, greeklish-to-greek conversion, fuzzy matching

/**
 * Normalize Greek text - removes accents (tonos) and converts to lowercase
 * @param {string} str - Input string
 * @returns {string} - Normalized string
 */
export const normalizeGreek = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    // Replace accented Greek vowels with their non-accented versions
    .replace(/ά/g, 'α')
    .replace(/έ/g, 'ε')
    .replace(/ή/g, 'η')
    .replace(/ί/g, 'ι')
    .replace(/ό/g, 'ο')
    .replace(/ύ/g, 'υ')
    .replace(/ώ/g, 'ω')
    // Handle capital accented letters
    .replace(/Ά/g, 'α')
    .replace(/Έ/g, 'ε')
    .replace(/Ή/g, 'η')
    .replace(/Ί/g, 'ι')
    .replace(/Ό/g, 'ο')
    .replace(/Ύ/g, 'υ')
    .replace(/Ώ/g, 'ω')
    // Handle dialytika combinations
    .replace(/ϊ/g, 'ι')
    .replace(/ϋ/g, 'υ')
    .replace(/ΐ/g, 'ι')
    .replace(/ΰ/g, 'υ')
    // Remove punctuation for cleaner matching
    .replace(/[.,\-_'"!?;:()[\]{}]/g, '');
};

/**
 * Check if a string contains Greek characters
 * @param {string} str - Input string
 * @returns {boolean}
 */
const containsGreek = (str) => {
  return /[\u0370-\u03FF\u1F00-\u1FFF]/.test(str);
};

/**
 * Greeklish to Greek transliteration mappings
 * Ordered by length (longer patterns first) to handle multi-character mappings correctly
 */
const GREEKLISH_TO_GREEK = [
  // Multi-character mappings (3+ chars) - must come first
  { pattern: 'thi', greek: 'θι' },
  { pattern: 'the', greek: 'θε' },
  { pattern: 'tha', greek: 'θα' },
  { pattern: 'chi', greek: 'χι' },
  { pattern: 'che', greek: 'χε' },
  { pattern: 'cha', greek: 'χα' },
  { pattern: 'psi', greek: 'ψι' },
  { pattern: 'pse', greek: 'ψε' },
  { pattern: 'psa', greek: 'ψα' },
  
  // Two-character mappings
  { pattern: 'th', greek: 'θ' },
  { pattern: 'ps', greek: 'ψ' },
  { pattern: 'ch', greek: 'χ' },
  { pattern: 'ks', greek: 'ξ' },
  { pattern: 'ts', greek: 'τσ' },
  { pattern: 'tz', greek: 'τζ' },
  { pattern: 'mp', greek: 'μπ' },
  { pattern: 'nt', greek: 'ντ' },
  { pattern: 'gk', greek: 'γκ' },
  { pattern: 'ou', greek: 'ου' },
  { pattern: 'ai', greek: 'αι' },
  { pattern: 'ei', greek: 'ει' },
  { pattern: 'oi', greek: 'οι' },
  { pattern: 'ui', greek: 'υι' },
  { pattern: 'au', greek: 'αυ' },
  { pattern: 'eu', greek: 'ευ' },
  { pattern: 'af', greek: 'αφ' },  // Alternative for αυ before consonants
  { pattern: 'ef', greek: 'εφ' },  // Alternative for ευ before consonants
  { pattern: 'av', greek: 'αβ' },  // Alternative for αυ before vowels
  { pattern: 'ev', greek: 'εβ' },  // Alternative for ευ before vowels
  
  // Single character mappings
  { pattern: 'a', greek: 'α' },
  { pattern: 'b', greek: 'β' },
  { pattern: 'v', greek: 'β' },
  { pattern: 'g', greek: 'γ' },
  { pattern: 'd', greek: 'δ' },
  { pattern: 'e', greek: 'ε' },
  { pattern: 'z', greek: 'ζ' },
  { pattern: 'h', greek: 'η' },
  { pattern: 'i', greek: 'ι' },
  { pattern: 'k', greek: 'κ' },
  { pattern: 'c', greek: 'κ' },  // 'c' often used for 'κ'
  { pattern: 'l', greek: 'λ' },
  { pattern: 'm', greek: 'μ' },
  { pattern: 'n', greek: 'ν' },
  { pattern: 'x', greek: 'ξ' },
  { pattern: 'o', greek: 'ο' },
  { pattern: 'p', greek: 'π' },
  { pattern: 'r', greek: 'ρ' },
  { pattern: 's', greek: 'σ' },
  { pattern: 't', greek: 'τ' },
  { pattern: 'y', greek: 'υ' },
  { pattern: 'u', greek: 'ου' },  // 'u' often represents 'ου' sound
  { pattern: 'f', greek: 'φ' },
  { pattern: 'w', greek: 'ω' },
];

/**
 * Alternative mappings for ambiguous greeklish patterns
 * Used to generate multiple candidate strings
 */
const AMBIGUOUS_MAPPINGS = {
  'i': ['ι', 'η', 'υ', 'ει', 'οι'],  // 'i' sound in Greek can be multiple letters
  'e': ['ε', 'αι'],                   // 'e' sound can be ε or αι
  'o': ['ο', 'ω'],                    // 'o' sound can be ο or ω
  'u': ['ου', 'υ'],                   // 'u' sound
};

/**
 * Convert Greeklish text to Greek
 * @param {string} greeklish - Input greeklish text
 * @returns {string} - Greek text
 */
const greeklishToGreek = (greeklish) => {
  if (!greeklish) return '';
  
  let result = greeklish.toLowerCase().trim();
  
  // Skip if already contains Greek characters
  if (containsGreek(result)) {
    return normalizeGreek(result);
  }
  
  // Apply mappings from longest to shortest
  for (const { pattern, greek } of GREEKLISH_TO_GREEK) {
    result = result.split(pattern).join(greek);
  }
  
  return result;
};

/**
 * Generate multiple Greek candidate strings from Greeklish input
 * Handles ambiguous mappings by generating variations
 * @param {string} query - Greeklish query
 * @returns {string[]} - Array of possible Greek translations
 */
export const greeklishToGreekCandidates = (query) => {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // If already Greek, just normalize and return
  if (containsGreek(normalizedQuery)) {
    return [normalizeGreek(normalizedQuery)];
  }
  
  // Primary translation
  const primaryTranslation = greeklishToGreek(normalizedQuery);
  const candidates = new Set([primaryTranslation]);
  
  // Generate variations for common ambiguous vowels
  // This helps match words like "lipasma" -> "λίπασμα" or "λιπασμα"
  
  // Alternative with η instead of ι for 'i'
  let altWithEta = normalizedQuery;
  altWithEta = altWithEta.replace(/i/g, 'PLACEHOLDER_I');
  for (const { pattern, greek } of GREEKLISH_TO_GREEK) {
    if (pattern !== 'i') {
      altWithEta = altWithEta.split(pattern).join(greek);
    }
  }
  altWithEta = altWithEta.replace(/PLACEHOLDER_I/g, 'η');
  candidates.add(altWithEta);
  
  // Alternative with ω instead of ο for 'o'
  let altWithOmega = normalizedQuery;
  altWithOmega = altWithOmega.replace(/o/g, 'PLACEHOLDER_O');
  for (const { pattern, greek } of GREEKLISH_TO_GREEK) {
    if (pattern !== 'o') {
      altWithOmega = altWithOmega.split(pattern).join(greek);
    }
  }
  altWithOmega = altWithOmega.replace(/PLACEHOLDER_O/g, 'ω');
  candidates.add(altWithOmega);
  
  // Filter out invalid/duplicate results
  return [...candidates].filter(c => c && c.length > 0);
};

/**
 * Check if normalized query matches normalized text
 * Supports both Greek and Greeklish queries
 * @param {string} text - Text to search in
 * @param {string} query - Search query
 * @returns {boolean}
 */
export const matchesQuery = (text, query) => {
  if (!query || !text) return false;
  
  const normalizedText = normalizeGreek(text);
  const normalizedQuery = normalizeGreek(query);
  
  // Direct match with normalized Greek
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }
  
  // Try Greeklish candidates
  const greekCandidates = greeklishToGreekCandidates(query);
  for (const candidate of greekCandidates) {
    if (normalizedText.includes(candidate)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Calculate basic fuzzy match score (Levenshtein-inspired)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Score between 0 and 1 (1 = exact match)
 */
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  // If the shorter string is contained in longer, high score
  if (longer.includes(shorter)) {
    return shorter.length / longer.length;
  }
  
  // Check for partial word matches
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matchCount = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.includes(word2) || word2.includes(word1)) {
        matchCount++;
        break;
      }
    }
  }
  
  return matchCount / Math.max(words1.length, words2.length);
};

/**
 * Fuzzy match with scoring
 * @param {string} text - Text to search in
 * @param {string} query - Search query
 * @param {number} threshold - Minimum score to consider a match (default 0.3)
 * @returns {{ matches: boolean, score: number }}
 */
export const fuzzyMatch = (text, query, threshold = 0.3) => {
  if (!query || !text) return { matches: false, score: 0 };
  
  const normalizedText = normalizeGreek(text);
  const normalizedQuery = normalizeGreek(query);
  
  // Exact substring match
  if (normalizedText.includes(normalizedQuery)) {
    return { matches: true, score: 1 };
  }
  
  // Check Greeklish candidates
  const candidates = greeklishToGreekCandidates(query);
  for (const candidate of candidates) {
    if (normalizedText.includes(candidate)) {
      return { matches: true, score: 0.95 };
    }
  }
  
  // Fuzzy similarity score
  const score = calculateSimilarity(normalizedText, normalizedQuery);
  
  // Also check against Greek candidates
  let maxCandidateScore = score;
  for (const candidate of candidates) {
    const candidateScore = calculateSimilarity(normalizedText, candidate);
    if (candidateScore > maxCandidateScore) {
      maxCandidateScore = candidateScore;
    }
  }
  
  return {
    matches: maxCandidateScore >= threshold,
    score: maxCandidateScore
  };
};

/**
 * Search and rank results
 * @param {Array} items - Array of items to search
 * @param {string} query - Search query
 * @param {string[]} fields - Fields to search in each item
 * @returns {Array} - Sorted array of matching items with scores
 */
export const searchAndRank = (items, query, fields) => {
  if (!query || !items || items.length === 0) return [];
  
  const results = items
    .map(item => {
      let maxScore = 0;
      
      for (const field of fields) {
        const value = item[field];
        if (value) {
          const { matches, score } = fuzzyMatch(value, query);
          if (matches && score > maxScore) {
            maxScore = score;
          }
        }
      }
      
      return { item, score: maxScore };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);
  
  return results.map(r => r.item);
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export const debounce = (func, wait = 250) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
