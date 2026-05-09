import { WalletSignals } from '../blockchain/solanaFetcher';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoreResult {
  score: number;
  risk: 'high' | 'medium' | 'trusted' | 'highly_trusted';
  riskLabel: string;
  breakdown: {
    walletAge: number;       // sur 20
    activity: number;        // sur 20
    defi: number;            // sur 20
    behavior: number;        // sur 20
    network: number;         // sur 20
  };
}

// ─── Fonction principale ──────────────────────────────────────────────────────

export function calculateScore(signals: WalletSignals): ScoreResult {

  // 1. Âge du wallet (max 20 points)
  const walletAge = scoreWalletAge(signals.walletAgeMonths);

  // 2. Activité (max 20 points)
  const activity = scoreActivity(signals.transactionCount);

  // 3. Interactions DeFi (max 20 points)
  const defi = scoreDefi(signals.defiInteractions);

  // 4. Comportement (max 20 points) — pénalité si suspect
  const behavior = scoreBehavior(signals.suspiciousActivity, signals.suspiciousReasons);

  // 5. Réseau (max 20 points)
  const network = scoreNetwork(signals.uniqueCounterparties);

  const total = walletAge + activity + defi + behavior + network;
  const score = Math.min(100, Math.max(0, Math.round(total)));

  return {
    score,
    risk: getRiskLevel(score),
    riskLabel: getRiskLabel(score),
    breakdown: { walletAge, activity, defi, behavior, network },
  };
}

// ─── Critères de scoring ──────────────────────────────────────────────────────

function scoreWalletAge(months: number): number {
  if (months >= 24) return 20;
  if (months >= 12) return 16;
  if (months >= 6)  return 12;
  if (months >= 3)  return 8;
  if (months >= 1)  return 4;
  return 0;
}

function scoreActivity(txCount: number): number {
  if (txCount >= 500) return 20;
  if (txCount >= 100) return 16;
  if (txCount >= 50)  return 12;
  if (txCount >= 20)  return 8;
  if (txCount >= 5)   return 4;
  return 0;
}

function scoreDefi(defiInteractions: number): number {
  if (defiInteractions >= 20) return 20;
  if (defiInteractions >= 10) return 16;
  if (defiInteractions >= 5)  return 12;
  if (defiInteractions >= 2)  return 8;
  if (defiInteractions >= 1)  return 4;
  return 0;
}

function scoreBehavior(suspicious: boolean, reasons: string[]): number {
  if (!suspicious) return 20;
  // Pénalité proportionnelle au nombre de signaux suspects
  const penalty = reasons.length * 5;
  return Math.max(0, 20 - penalty);
}

function scoreNetwork(counterparties: number): number {
  if (counterparties >= 100) return 20;
  if (counterparties >= 50)  return 16;
  if (counterparties >= 20)  return 12;
  if (counterparties >= 10)  return 8;
  if (counterparties >= 3)   return 4;
  return 0;
}

// ─── Niveau de risque ─────────────────────────────────────────────────────────

function getRiskLevel(score: number): ScoreResult['risk'] {
  if (score >= 81) return 'highly_trusted';
  if (score >= 61) return 'trusted';
  if (score >= 31) return 'medium';
  return 'high';
}

function getRiskLabel(score: number): string {
  if (score >= 81) return 'Highly Trusted';
  if (score >= 61) return 'Trusted';
  if (score >= 31) return 'Medium Risk';
  return 'High Risk';
}