// --- Probability Calculations ---

// Initialize probability variables for up to 5 consecutive up/down days
p_uu = 0.0  // Probability of Up given previous Up
p_ud = 0.0  // Probability of Up given previous Down
p_du = 0.0  // Probability of Down given previous Up
p_dd = 0.0  // Probability of Down given previous Down
p_uuu = 0.0  // Probability of Up given previous Up Up
p_uud = 0.0  // Probability of Up given previous Up Down
p_udu = 0.0  // Probability of Up given previous Up Down Up
p_udd = 0.0  // Probability of Up given previous Down Down
p_duu = 0.0  // Probability of Down given previous Up Up
p_dud = 0.0  // Probability of Down given previous Up Down
p_ddu = 0.0  // Probability of Down given previous Down Up
p_ddd = 0.0  // Probability of Down given previous Down Down
p_uuuu = 0.0  // Probability of Up given previous Up Up Up
p_uuud = 0.0  // Probability of Up given previous Up Up Up Down
p_uudu = 0.0  // Probability of Up given previous Up Up Down Up
p_uudd = 0.0  // Probability of Up given previous Up Up Down Down
p_uduu = 0.0  // Probability of Up given previous Up Down Up Up
p_udud = 0.0  // Probability of Up given previous Up Down Up Down
p_uddu = 0.0  // Probability of Up given previous Up Down Down Up
p_uddd = 0.0  // Probability of Up given previous Up Down Down Down
p_duuu = 0.0  // Probability of Down given previous Down Up Up Up
p_duud = 0.0  // Probability of Down given previous Down Up Up Down
p_dudu = 0.0  // Probability of Down given previous Down Up Down Up
p_dudd = 0.0  // Probability of Down given previous Down Up Down Down
p_dduu = 0.0  // Probability of Down given previous Down Down Up Up
p_ddud = 0.0  // Probability of Down given previous Down Down Up Down
p_dddu = 0.0  // Probability of Down given previous Down Down Down Up
p_dddd = 0.0  // Probability of Down given previous Down Down Down Down
// ... and so on for higher-order probabilities

// Calculate counts for different sequences
upCount = 0
downCount = 0
upUpCount = 0
upDownCount = 0
downUpCount = 0
downDownCount = 0
upUpUpCount = 0
upUpDownCount = 0
upDownUpCount = 0
upDownDownCount = 0
downUpUpCount = 0
downUpDownCount = 0
downDownUpCount = 0
downDownDownCount = 0
upUpUpUpCount = 0
upUpUpDownCount = 0
upUpDownUpCount = 0
upUpDownDownCount = 0
upDownUpUpCount = 0
upDownUpDownCount = 0
upDownDownUpCount = 0
upDownDownDownCount = 0
downUpUpUpCount = 0
downUpUpDownCount = 0
downUpDownUpCount = 0
downUpDownDownCount = 0
downDownUpUpCount = 0
downDownUpDownCount = 0
downDownDownUpCount = 0
downDownDownDownCount = 0
// ... and so on for higher-order counts

// Loop through historical bars to calculate counts
let i = barsToAnalyze;
while (i >= 1) {
    if (close[i] > close[i + 1]) {
        upCount += 1;
        if (close[i + 1] > close[i + 2]) {
            upUpCount += 1;
        } else {
            upDownCount += 1;
        }
    } else {
        downCount += 1;
        if (close[i + 1] > close[i + 2]) {
            downUpCount += 1;
        } else {
            downDownCount += 1;
        }
    }
    i -= 1;
}
// Loop through historical bars to calculate counts
while (i >= 4) {
    if (close[i] > close[i + 1]) {
        upCount += 1;
        if (close[i + 1] > close[i + 2]) {
            upUpCount += 1;
            if (close[i + 2] > close[i + 3]) {
                upUpUpCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    upUpUpUpCount += 1;
                } else {
                    upUpUpDownCount += 1;
                }
            } else {
                upUpDownCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    upUpDownUpCount += 1;
                } else {
                    upUpDownDownCount += 1;
                }
            }
        } else {
            upDownCount += 1;
            if (close[i + 2] > close[i + 3]) {
                upDownUpCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    upDownUpUpCount += 1;
                } else {
                    upDownUpDownCount += 1;
                }
            } else {
                upDownDownCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    upDownDownUpCount += 1;
                } else {
                    upDownDownDownCount += 1;
                }
            }
        }
    } else {
        downCount += 1;
        if (close[i + 1] > close[i + 2]) {
            downUpCount += 1;
            if (close[i + 2] > close[i + 3]) {
                downUpUpCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    downUpUpUpCount += 1;
                } else {
                    downUpUpDownCount += 1;
                }
            } else {
                downUpDownCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    downUpDownUpCount += 1;
                } else {
                    downUpDownDownCount += 1;
                }
            }
        } else {
            downDownCount += 1;
            if (close[i + 2] > close[i + 3]) {
                downDownUpCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    downDownUpUpCount += 1;
                } else {
                    downDownUpDownCount += 1;
                }
            } else {
                downDownDownCount += 1;
                if (close[i + 3] > close[i + 4]) {
                    downDownDownUpCount += 1;
                } else {
                    downDownDownDownCount += 1;
                }
            }
        }
    }
    i -= 1;
}
for i = barsToAnalyze to 1 by 1
    if close[i] > close[i + 1]
        upCount := upCount + 1
        if close[i + 1] > close[i + 2]
            upUpCount := upUpCount + 1
        else
            upDownCount := upDownCount + 1
    else
        downCount := downCount + 1
        if close[i + 1] > close[i + 2]
            downUpCount := downUpCount + 1
        else
            downDownCount := downDownCount + 1

            // Function to calculate probability
            function calculateProbability(dir, count) {
                return dir / (count === 0 ? 1 : count);
            }

            // Calculate probabilities based on counts
            p_uu = calculateProbability(upAfterUp, upCount);
            p_ud = calculateProbability(upAfterDown, downCount);
            p_du = calculateProbability(downAfterUp, upCount);
            p_dd = calculateProbability(downAfterDown, downCount);
            p_uuu = calculateProbability(upAfterUpUp, upUpCount);
            p_uud = calculateProbability(upAfterUpDown, upDownCount);
            p_udu = calculateProbability(upAfterDownUp, downUpCount);
            p_udd = calculateProbability(upAfterDownDown, downDownCount);
            p_duu = calculateProbability(downAfterUpUp, upUpCount);
            p_dud = calculateProbability(downAfterUpDown, upDownCount);
            p_ddu = calculateProbability(downAfterDownUp, downUpCount);
            p_ddd = calculateProbability(downAfterDownDown, downDownCount);
            p_uuuu = calculateProbability(upAfterUpUpUp, upUpUpCount);
            p_uuud = calculateProbability(upAfterUpUpDown, upUpDownCount);
            p_uudu = calculateProbability(upAfterUpDownUp, upDownUpCount);
            p_uudd = calculateProbability(upAfterUpDownDown, upDownDownCount);
            p_uduu = calculateProbability(upAfterDownUpUp, downUpUpCount);
            p_udud = calculateProbability(upAfterDownUpDown, downUpDownCount);
            p_uddu = calculateProbability(upAfterDownDownUp, downDownUpCount);
            p_uddd = calculateProbability(upAfterDownDownDown, downDownDownCount);
            p_duuu = calculateProbability(downAfterUpUpUp, upUpUpCount);
            p_duud = calculateProbability(downAfterUpUpDown, upUpDownCount);
            p_dudu = calculateProbability(downAfterUpDownUp, upDownUpCount);
            p_dudd = calculateProbability(downAfterUpDownDown, upDownDownCount);
            p_dduu = calculateProbability(downAfterDownUpUp, downUpUpCount);
            p_ddud = calculateProbability(downAfterDownUpDown, downUpDownCount);
            p_dddu = calculateProbability(downAfterDownDownUp, downDownUpCount);
            p_dddd = calculateProbability(downAfterDownDownDown, downDownDownCount);
p_uu = p(upAfterUp, upCount)
// Calculate probabilities based on counts
p_uu = upAfterUp / (upCount == 0 ? 1 : upCount)
p_ud = upAfterDown / (downCount == 0 ? 1 : downCount)
p_du = downAfterUp / (upCount == 0 ? 1 : upCount)
p_dd = downAfterDown / (downCount == 0 ? 1 : downCount)
p_uuu = upAfterUpUp / (upUpCount == 0 ? 1 : upUpCount)
p_uud = upAfterUpDown / (upDownCount == 0 ? 1 : upDownCount)
p_udu = upAfterDownUp / (downUpCount == 0 ? 1 : downUpCount)
p_udd = upAfterDownDown / (downDownCount == 0 ? 1 : downDownCount)
p_duu = downAfterUpUp / (upUpCount == 0 ? 1 : upUpCount)
p_dud = downAfterUpDown / (upDownCount == 0 ? 1 : upDownCount)
p_ddu = downAfterDownUp / (downUpCount == 0 ? 1 : downUpCount)
p_ddd = downAfterDownDown / (downDownCount == 0 ? 1 : downDownCount)
p_uuuu = upAfterUpUpUp / (upUpUpCount == 0 ? 1 : upUpUpCount)
p_uuud = upAfterUpUpDown / (upUpDownCount == 0 ? 1 : upUpDownCount)
p_uudu = upAfterUpDownUp / (upDownUpCount == 0 ? 1 : upDownUpCount)
p_uudd = upAfterUpDownDown / (upDownDownCount == 0 ? 1 : upDownDownCount)
p_uduu = upAfterDownUpUp / (downUpUpCount == 0 ? 1 : downUpUpCount)
p_udud = upAfterDownUpDown / (downUpDownCount == 0 ? 1 : downUpDownCount)
p_uddu = upAfterDownDownUp / (downDownUpCount == 0 ? 1 : downDownUpCount)
p_uddd = upAfterDownDownDown / (downDownDownCount == 0 ? 1 : downDownDownCount)
p_duuu = downAfterUpUpUp / (upUpUpCount == 0 ? 1 : upUpUpCount)
p_duud = downAfterUpUpDown / (upUpDownCount == 0 ? 1 : upUpDownCount)
p_dudu = downAfterUpDownUp / (upDownUpCount == 0 ? 1 : upDownUpCount)
p_dudd = downAfterUpDownDown / (upDownDownCount == 0 ? 1 : upDownDownCount)
p_dduu = downAfterDownUpUp / (downUpUpCount == 0 ? 1 : downUpUpCount)
p_ddud = downAfterDownUpDown / (downUpDownCount == 0 ? 1 : downUpDownCount)
p_dddu = downAfterDownDownUp / (downDownUpCount == 0 ? 1 : downDownUpCount)
p_dddd = downAfterDownDownDown / (downDownDownCount == 0 ? 1 : downDownDownCount)
// --- Strategy Logic ---
