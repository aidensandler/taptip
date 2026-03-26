/**
 * TapTip NFC Utilities
 *
 * In production this wraps the Web NFC API (NDEFReader).
 * In development / unsupported browsers it simulates a tag read.
 *
 * Web NFC requires:
 *   - Chrome 89+ on Android
 *   - HTTPS (or localhost)
 *   - User gesture to initiate scan
 */

const NFC_SUPPORTED = typeof window !== 'undefined' && 'NDEFReader' in window;

/**
 * Scan an NFC tag and return its id string.
 * Resolves with { id: string } or rejects with an Error.
 *
 * @param {object} options
 * @param {function} options.onReading  - called when tag is detected (before resolve)
 * @param {string}  [options.mockId]    - override mock id in dev
 * @returns {Promise<{ id: string }>}
 */
export async function scanTag({ onReading, mockId = 'MH-0041' } = {}) {
  if (NFC_SUPPORTED) {
    const ndef = new window.NDEFReader();
    await ndef.scan();
    return new Promise((resolve, reject) => {
      ndef.addEventListener('reading', ({ serialNumber, message }) => {
        const id = message?.records?.[0]?.data
          ? new TextDecoder().decode(message.records[0].data)
          : serialNumber;
        if (onReading) onReading(id);
        resolve({ id });
      });
      ndef.addEventListener('readingerror', () => {
        reject(new Error('NFC read error — hold your phone closer to the badge.'));
      });
    });
  }

  // Simulated scan (dev / non-NFC browser)
  return new Promise((resolve) => {
    setTimeout(() => {
      if (onReading) onReading(mockId);
      resolve({ id: mockId });
    }, 1800);
  });
}

/**
 * Write a provider ID to an NFC tag (for badge programming).
 * Only works in NFC-capable browsers.
 *
 * @param {string} providerId  e.g. "MH-0041"
 * @returns {Promise<void>}
 */
export async function writeTag(providerId) {
  if (!NFC_SUPPORTED) {
    // Simulate success in dev
    return new Promise((resolve) => setTimeout(resolve, 1200));
  }
  const ndef = new window.NDEFReader();
  await ndef.write({
    records: [{ recordType: 'text', data: providerId }],
  });
}

export { NFC_SUPPORTED };
