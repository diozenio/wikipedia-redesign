const SYNTHESIS_SHARE = 95;

export function synthesisProgress(done: number, total: number): number {
  if (total === 0) return SYNTHESIS_SHARE;
  return Math.floor((done / total) * SYNTHESIS_SHARE);
}
