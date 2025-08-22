// app/lib/model.ts - Lightweight mock (no ML libs)

interface ModelInputSize {
  H: number;
  W: number;
  C: number;
}

// Keep labels for UI consistency
const LABELS = [
  'coconut', 'palm_tree', 'coconut_leaf', 'coconut_flower', 'other'
];

let modelReady = false;

/** Initialize mock model (simulates load) */
export async function initModel(): Promise<void> {
  if (modelReady) return;
  await new Promise((r) => setTimeout(r, 200));
  modelReady = true;
  console.log('Mock model initialized (no ML)');
}

/** Is mock model ready */
export function isModelReady(): boolean {
  return modelReady;
}

/** Expected input size (kept for UI usage) */
export function getExpectedInputSize(): ModelInputSize | null {
  return { H: 224, W: 224, C: 3 };
}

/** Class labels */
export function getLabels(): string[] {
  return LABELS;
}

/**
 * Mock prediction from a URI. Returns a deterministic faux result based on the URI string
 * so that UI works without ML dependencies.
 */
export async function predictFromUri(uri: string): Promise<{ label: string; index: number; confidence: number }>{
  if (!modelReady) throw new Error('Model not initialized. Call initModel() first.');

  // Simple hash to pick a stable label per URI
  let hash = 0;
  for (let i = 0; i < uri.length; i++) hash = (hash * 31 + uri.charCodeAt(i)) >>> 0;
  const idx = hash % LABELS.length;
  const confidence = 0.8 + ((hash % 20) / 100); // 0.80 - 0.99
  return { label: LABELS[idx], index: idx, confidence: Math.min(confidence, 0.99) };
}

/** Dispose mock */
export function disposeModel(): void {
  modelReady = false;
}

// Auto-init for convenience
initModel().catch((e) => console.warn('Mock model init failed:', e));