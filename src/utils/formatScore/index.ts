export function formatScore(score: number): string {
  return score === 0 ? 'E' : score > 0 ? `+${score}` : `${score}`;
}
