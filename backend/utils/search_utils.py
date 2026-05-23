"""Greek text normalization and Greeklish transliteration (Python port of frontend searchUtils.js)."""
import re
from typing import List

GREEK_RE = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]')

_ACCENT_MAP = str.maketrans({
    'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω',
    'Ά': 'α', 'Έ': 'ε', 'Ή': 'η', 'Ί': 'ι', 'Ό': 'ο', 'Ύ': 'υ', 'Ώ': 'ω',
    'ϊ': 'ι', 'ϋ': 'υ', 'ΐ': 'ι', 'ΰ': 'υ',
    'ς': 'σ',
})

_PUNCT_RE = re.compile(r"[.,\-_'\"!?;:()\[\]{}]")


def normalize_greek(s: str) -> str:
    if not s:
        return ''
    s = s.lower().strip().translate(_ACCENT_MAP)
    s = _PUNCT_RE.sub('', s)
    return s


def contains_greek(s: str) -> bool:
    return bool(GREEK_RE.search(s or ''))


# Ordered by length (longer first)
GREEKLISH_MAP = [
    ('zootroph', 'ζωοτροφ'), ('zootrop', 'ζωοτροφ'), ('zootr', 'ζωοτρ'),
    ('thi', 'θι'), ('the', 'θε'), ('tha', 'θα'), ('tho', 'θο'),
    ('chi', 'χι'), ('che', 'χε'), ('cha', 'χα'), ('cho', 'χο'),
    ('psi', 'ψι'), ('pse', 'ψε'), ('psa', 'ψα'), ('pso', 'ψο'),
    ('oou', 'ου'), ('zoo', 'ζω'),
    ('th', 'θ'), ('ps', 'ψ'), ('ch', 'χ'), ('ks', 'ξ'),
    ('ts', 'τσ'), ('tz', 'τζ'), ('mp', 'μπ'), ('nt', 'ντ'), ('gk', 'γκ'),
    ('ou', 'ου'), ('oo', 'ου'),
    ('ai', 'αι'), ('ei', 'ει'), ('oi', 'οι'), ('ui', 'υι'),
    ('au', 'αυ'), ('eu', 'ευ'),
    ('af', 'αφ'), ('ef', 'εφ'), ('av', 'αβ'), ('ev', 'εβ'),
    ('ki', 'κι'), ('pi', 'πι'),
    ('a', 'α'), ('b', 'β'), ('v', 'β'), ('g', 'γ'), ('d', 'δ'),
    ('e', 'ε'), ('z', 'ζ'), ('h', 'η'), ('i', 'ι'),
    ('k', 'κ'), ('c', 'κ'), ('l', 'λ'), ('m', 'μ'),
    ('n', 'ν'), ('x', 'ξ'), ('o', 'ο'), ('p', 'π'),
    ('r', 'ρ'), ('s', 'σ'), ('t', 'τ'), ('y', 'υ'),
    ('u', 'ου'), ('f', 'φ'), ('w', 'ω'),
]


def greeklish_to_greek(query: str) -> str:
    if not query:
        return ''
    q = query.lower().strip()
    if contains_greek(q):
        return normalize_greek(q)
    for pat, gr in GREEKLISH_MAP:
        q = q.replace(pat, gr)
    return q


def greeklish_candidates(query: str) -> List[str]:
    if not query:
        return []
    q = query.lower().strip()
    if contains_greek(q):
        return [normalize_greek(q)]

    candidates = set()
    primary = greeklish_to_greek(q)
    candidates.add(primary)

    # variant with η instead of ι
    tmp = q.replace('i', '\x00')
    for pat, gr in GREEKLISH_MAP:
        if pat != 'i':
            tmp = tmp.replace(pat, gr)
    candidates.add(tmp.replace('\x00', 'η'))

    # variant with ω instead of ο
    tmp2 = q.replace('o', '\x01')
    for pat, gr in GREEKLISH_MAP:
        if pat != 'o':
            tmp2 = tmp2.replace(pat, gr)
    candidates.add(tmp2.replace('\x01', 'ω'))

    # ei / oi variations
    candidates.add(greeklish_to_greek(q.replace('i', 'ei')))
    candidates.add(greeklish_to_greek(q.replace('i', 'oi')))

    # endings
    if q.endswith('es'):
        base = q[:-2]
        candidates.add(greeklish_to_greek(base) + 'ες')
        candidates.add(greeklish_to_greek(base) + 'ης')
    if q.endswith('a'):
        base = q[:-1]
        candidates.add(greeklish_to_greek(base) + 'α')
        candidates.add(greeklish_to_greek(base) + 'ια')

    return [c for c in candidates if c]


def matches_query(text: str, query: str) -> bool:
    if not query or not text:
        return False
    nt = normalize_greek(text)
    nq = normalize_greek(query)
    if nq in nt:
        return True
    for cand in greeklish_candidates(query):
        if cand in nt:
            return True
        words = nt.split()
        for w in words:
            if w.startswith(cand) or (len(w) >= 3 and cand.startswith(w[:3])):
                return True
    return False


def build_search_text(*parts: str) -> str:
    """Concatenate and normalize fields for storing in product.search_text."""
    return normalize_greek(' '.join(p for p in parts if p))
