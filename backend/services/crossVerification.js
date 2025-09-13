class CrossVerificationService {

    detectContradictions(documents) {
        const contradictions = [];

        for (let i = 0; i < documents.length; i++) {
            for (let j = i + 1; j < documents.length; j++) {
                const doc1 = documents[i];
                const doc2 = documents[j];

                const contradiction = this.compareDocuments(doc1, doc2);
                if (contradiction) {
                    contradictions.push(contradiction);
                }
            }
        }

        return contradictions;
    }

    compareDocuments(doc1, doc2) {
        // Simple keyword-based contradiction detection
        const contradictoryPairs = [
            ['increase', 'decrease'],
            ['support', 'oppose'],
            ['approve', 'reject'],
            ['will implement', 'will not implement'],
            ['mandatory', 'optional'],
            ['temporary', 'permanent']
        ];

        const content1 = doc1.content.toLowerCase();
        const content2 = doc2.content.toLowerCase();

        for (const [word1, word2] of contradictoryPairs) {
            if (content1.includes(word1) && content2.includes(word2)) {
                return {
                    type: 'contradiction',
                    documents: [doc1, doc2],
                    conflictingTerms: [word1, word2],
                    severity: 'high',
                    description: `Document from ${doc1.date} mentions "${word1}" while document from ${doc2.date} mentions "${word2}"`
                };
            }
        }

        return null;
    }

    trackPolicyEvolution(documents, query) {
        // Sort documents by date
        const sortedDocs = documents.sort((a, b) => new Date(a.date) - new Date(b.date));

        const timeline = [];
        let previousStance = null;

        for (const doc of sortedDocs) {
            const stance = this.extractPolicyStance(doc, query);

            if (stance && stance !== previousStance) {
                timeline.push({
                    date: doc.date,
                    document: doc,
                    stance: stance,
                    change: previousStance ? 'position_change' : 'initial_position',
                    previousStance: previousStance
                });
                previousStance = stance;
            }
        }

        return {
            timeline,
            evolutionSummary: this.generateEvolutionSummary(timeline),
            totalChanges: timeline.filter(t => t.change === 'position_change').length
        };
    }

    extractPolicyStance(document, query) {
        const content = document.content.toLowerCase();
        const queryLower = query.toLowerCase();

        // Simple stance detection based on common policy language
        if (content.includes('will implement') || content.includes('committed to')) {
            return 'supportive';
        } else if (content.includes('will not') || content.includes('reject')) {
            return 'opposing';
        } else if (content.includes('under review') || content.includes('considering')) {
            return 'neutral';
        } else if (content.includes('increase') || content.includes('expand')) {
            return 'expanding';
        } else if (content.includes('reduce') || content.includes('limit')) {
            return 'restricting';
        }

        return 'unclear';
    }

    generateEvolutionSummary(timeline) {
        if (timeline.length === 0) return 'No policy evolution detected';
        if (timeline.length === 1) return 'Single policy position maintained';

        const changes = timeline.filter(t => t.change === 'position_change');
        return `Policy evolved ${changes.length} times from ${timeline[0].date} to ${timeline[timeline.length - 1].date}`;
    }

    calculateContentConfidence(documents, query) {
        return documents.map(doc => ({
            ...doc,
            confidenceScore: this.analyzeContentConfidence(doc, query),
            confidenceFactors: this.getConfidenceFactors(doc, query)
        }));
    }

    analyzeContentConfidence(document, query) {
        let score = 50; // Base score

        // Source reliability
        if (document.type === 'parliamentary_debate') score += 30;
        else if (document.type === 'press_release') score += 20;
        else score += 10;

        // Date relevance (more recent = higher confidence)
        const docDate = new Date(document.date);
        const now = new Date();
        const daysDiff = (now - docDate) / (1000 * 60 * 60 * 24);

        if (daysDiff < 30) score += 15;
        else if (daysDiff < 90) score += 10;
        else if (daysDiff < 365) score += 5;
        else score -= 5;

        // Content specificity
        const queryWords = query.toLowerCase().split(' ');
        const matchingWords = queryWords.filter(word =>
            document.content.toLowerCase().includes(word)
        ).length;

        score += (matchingWords / queryWords.length) * 20;

        // Clamp score between 0-100
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    getConfidenceFactors(document, query) {
        const factors = [];

        if (document.type === 'parliamentary_debate') {
            factors.push('Official parliamentary record');
        }

        const docDate = new Date(document.date);
        const daysDiff = (new Date() - docDate) / (1000 * 60 * 60 * 24);

        if (daysDiff < 30) {
            factors.push('Recent statement');
        } else if (daysDiff > 365) {
            factors.push('Older statement - may be outdated');
        }

        if (document.speaker && document.speaker.includes('Minister')) {
            factors.push('High-level government official');
        }

        return factors;
    }

    generateSideBySideComparisons(documents, queryAnalysis) {
        const comparisonService = require('./comparisonService');

        // Identify which documents should be compared
        const comparablePairs = comparisonService.identifyComparablePairs(documents, queryAnalysis);

        const sideBySideComparisons = comparablePairs.map(pair => {
            const detailedComparison = comparisonService.performDetailedComparison(pair.document1, pair.document2);

            return {
                comparison_id: `${pair.document1.date}_vs_${pair.document2.date}`,
                comparison_type: pair.type,
                comparison_reason: pair.comparisonReason,
                side_by_side: {
                    left_document: {
                        title: pair.document1.title,
                        date: pair.document1.date,
                        speaker: pair.document1.speaker,
                        source: pair.document1.source,
                        content_preview: pair.document1.content.substring(0, 200) + "...",
                        stance_analysis: detailedComparison.stance_comparison.document1_stance
                    },
                    right_document: {
                        title: pair.document2.title,
                        date: pair.document2.date,
                        speaker: pair.document2.speaker,
                        source: pair.document2.source,
                        content_preview: pair.document2.content.substring(0, 200) + "...",
                        stance_analysis: detailedComparison.stance_comparison.document2_stance
                    }
                },
                analysis: {
                    key_differences: detailedComparison.key_differences,
                    similarities: detailedComparison.similarities,
                    stance_alignment: detailedComparison.stance_comparison.stance_alignment,
                    potential_contradiction: detailedComparison.stance_comparison.potential_contradiction,
                    content_overlap: detailedComparison.content_analysis.content_overlap
                },
                summary: comparisonService.generateComparisonSummary(detailedComparison, pair.document1, pair.document2)
            };
        });

        return sideBySideComparisons;
    }

    generateSocialMediaCrossReference(documents) {
        const socialMediaService = require('./socialMediaService');
        
        const socialPosts = documents.filter(doc => doc.type === 'social_media');
        const officialDocs = documents.filter(doc => doc.type !== 'social_media');
        
        if (socialPosts.length === 0 || officialDocs.length === 0) {
          return [];
        }
        
        return socialMediaService.crossReferenceWithOfficialSources(socialPosts, officialDocs);
      }
}

module.exports = new CrossVerificationService();