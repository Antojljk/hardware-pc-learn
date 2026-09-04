/**
 * Parses a French price string into a number.
 * Handles: "399,95 €", "1 299,00 €", "450€", "12.50"
 */
export function parseFrenchPrice(raw: string): number | null {
  if (!raw) return null;

  // Replace currency symbol with a comma if it separates cents (e.g., "319€95" -> "319,95")
  const normalized = raw.replace(/€(\d{2})\b/, ',$1');

  // Remove currency symbols and non-breaking spaces/standard spaces
  let cleaned = normalized.replace(/[€\s\u00a0]/g, '').trim();

  // Handle cases like "1.299,95" where dot is thousand separator
  // If there is a comma and a dot, and the dot comes first, it's a thousand separator.
  if (cleaned.includes('.') && cleaned.includes(',')) {
    const dotIndex = cleaned.indexOf('.');
    const commaIndex = cleaned.indexOf(',');
    if (dotIndex < commaIndex) {
      cleaned = cleaned.replace(/\./g, '');
    }
  }

  // Replace comma with dot for parseFloat
  cleaned = cleaned.replace(',', '.');

  // Extract the first number-like sequence
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;

  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? n : null;

}

/**
 * Verifies if the found product name is a reasonable match for the query.
 * For RAM and SSD, we want to ensure the key specifications are present.
 */
export function isGoodMatch(query: string, productName: string): boolean {
  const q = query.toLowerCase();
  const n = productName.toLowerCase();

  if (!q || !n) return false;

  // Reject used/refurbished products
  const rejectTerms = ['occasion', 'reconditionné', 'reconditionne', 'used', 'refurbished'];
  if (rejectTerms.some(term => n.includes(term))) return false;

  // Reject bundles/kits if query is specific (no 'kit', 'bundle', 'pack' in query)
  const bundleTerms = ['kit', 'bundle', 'pack', 'upgrade'];
  if (!bundleTerms.some(term => q.includes(term)) && bundleTerms.some(term => n.includes(term))) {
    return false;
  }

  // Specification extraction for critical components
  const capacityMatch = q.match(/(\d+)\s*(gb|tb)/i);
  if (capacityMatch) {
    const capacity = capacityMatch[0].toLowerCase().replace(/\s+/g, '');
    // The product must contain the same capacity (e.g. "32gb" or "32 go")
    const normalizedCapacity = capacity.replace('gb', 'go').replace('tb', 'to');
    if (!n.includes(capacity) && !n.includes(normalizedCapacity)) return false;
  }

  // Exact model check for GPUs (avoid RTX 4080 -> RTX 4080 Super mixup)
  const gpuMatch = q.match(/(rtx\s*\d{4}\s*\w*|rx\s*\d{4}\s*\w*)/i);
  if (gpuMatch) {
    const model = gpuMatch[0].toLowerCase();
    if (!n.includes(model)) return false;
    // If query has 'super' or 'ti', product must also have it
    if (q.includes('super') && !n.includes('super')) return false;
    if (q.includes('ti') && !n.includes('ti')) return false;
  }

  // Exact model check for CPUs (Ryzen 5 5500 != 5600)
  const cpuMatch = q.match(/(ryzen\s*\d\s*\d{4}|core\s*i\d\s*\d{4,5})/i);
  if (cpuMatch) {
    const model = cpuMatch[0].toLowerCase();
    if (!n.includes(model)) return false;
  }

  // Generic fallback: keywords matching
  const keywords = q.split(/\s+/).filter(k => k.length > 2);
  if (keywords.length === 0) return n.includes(q);

  const matchedKeywords = keywords.filter(k => n.includes(k));
  return matchedKeywords.length / keywords.length >= 0.9;
}
