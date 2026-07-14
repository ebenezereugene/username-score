export interface ReadabilityScoreMetadata {
  penalties: {
    consonantClusterPenalty: number;
    numberPenalty: number;
    symbolPenalty: number;
    transitionPenalty: number;
  };

  bonuses: {
    vowelBalanceBonus: number;
    alphabeticCoverageBonus: number;
  };

  finalScore: number;
}
