class ComparisonService {
  
    identifyComparablePairs(documents, queryAnalysis) {
      const comparablePairs = [];
      
      // If query has comparison intent, find documents to compare
      if (queryAnalysis.intent.includes('comparison') || queryAnalysis.intent.includes('timeline')) {
        
        // Compare documents from different time periods
        const timeGrouped = this.groupDocumentsByTime(documents);
        if (Object.keys(timeGrouped).length >= 2) {
          const timeGroups = Object.values(timeGrouped);
          for (let i = 0; i < timeGroups.length - 1; i++) {
            for (let j = i + 1; j < timeGroups.length; j++) {
              comparablePairs.push({
                type: 'temporal_comparison',
                document1: timeGroups[i][0], // Take first doc from each time group
                document2: timeGroups[j][0],
                comparisonReason: 'Different time periods'
              });
            }
          }
        }
        
        // Compare documents from different speakers about same topic
        const speakerGrouped = this.groupDocumentsBySpeaker(documents);
        if (Object.keys(speakerGrouped).length >= 2) {
          const speakers = Object.keys(speakerGrouped);
          for (let i = 0; i < speakers.length - 1; i++) {
            for (let j = i + 1; j < speakers.length; j++) {
              comparablePairs.push({
                type: 'speaker_comparison',
                document1: speakerGrouped[speakers[i]][0],
                document2: speakerGrouped[speakers[j]][0],
                comparisonReason: `Different speakers: ${speakers[i]} vs ${speakers[j]}`
              });
            }
          }
        }
        
        // Compare documents from different source types
        const sourceGrouped = this.groupDocumentsBySourceType(documents);
        if (Object.keys(sourceGrouped).length >= 2) {
          const sourceTypes = Object.keys(sourceGrouped);
          for (let i = 0; i < sourceTypes.length - 1; i++) {
            for (let j = i + 1; j < sourceTypes.length; j++) {
              comparablePairs.push({
                type: 'source_comparison',
                document1: sourceGrouped[sourceTypes[i]][0],
                document2: sourceGrouped[sourceTypes[j]][0],
                comparisonReason: `Different sources: ${sourceTypes[i]} vs ${sourceTypes[j]}`
              });
            }
          }
        }
      }
      
      return comparablePairs;
    }
    
    groupDocumentsByTime(documents) {
      const groups = {};
      documents.forEach(doc => {
        const year = new Date(doc.date).getFullYear();
        if (!groups[year]) groups[year] = [];
        groups[year].push(doc);
      });
      return groups;
    }
    
    groupDocumentsBySpeaker(documents) {
      const groups = {};
      documents.forEach(doc => {
        const speaker = doc.speaker || 'Unknown';
        if (!groups[speaker]) groups[speaker] = [];
        groups[speaker].push(doc);
      });
      return groups;
    }
    
    groupDocumentsBySourceType(documents) {
      const groups = {};
      documents.forEach(doc => {
        const sourceType = doc.type || 'unknown';
        if (!groups[sourceType]) groups[sourceType] = [];
        groups[sourceType].push(doc);
      });
      return groups;
    }
    
    performDetailedComparison(document1, document2) {
      const comparison = {
        metadata_comparison: this.compareMetadata(document1, document2),
        content_analysis: this.analyzeContentDifferences(document1, document2),
        stance_comparison: this.compareStances(document1, document2),
        key_differences: this.extractKeyDifferences(document1, document2),
        similarities: this.findSimilarities(document1, document2)
      };
      
      return comparison;
    }
    
    compareMetadata(doc1, doc2) {
      return {
        time_difference: {
          document1_date: doc1.date,
          document2_date: doc2.date,
          days_apart: this.calculateDaysApart(doc1.date, doc2.date),
          chronological_order: new Date(doc1.date) < new Date(doc2.date) ? 'doc1_first' : 'doc2_first'
        },
        speaker_difference: {
          document1_speaker: doc1.speaker,
          document2_speaker: doc2.speaker,
          same_speaker: doc1.speaker === doc2.speaker
        },
        source_difference: {
          document1_source: doc1.source,
          document2_source: doc2.source,
          same_source_type: doc1.type === doc2.type
        }
      };
    }
    
    analyzeContentDifferences(doc1, doc2) {
      const content1 = doc1.content.toLowerCase();
      const content2 = doc2.content.toLowerCase();
      
      // Simple keyword analysis
      const words1 = new Set(content1.split(' '));
      const words2 = new Set(content2.split(' '));
      
      const commonWords = new Set([...words1].filter(x => words2.has(x)));
      const uniqueToDoc1 = new Set([...words1].filter(x => !words2.has(x)));
      const uniqueToDoc2 = new Set([...words2].filter(x => !words1.has(x)));
      
      return {
        content_overlap: (commonWords.size / Math.max(words1.size, words2.size) * 100).toFixed(1),
        unique_to_document1: Array.from(uniqueToDoc1).slice(0, 10), // Top 10 unique words
        unique_to_document2: Array.from(uniqueToDoc2).slice(0, 10),
        common_themes: Array.from(commonWords).filter(word => word.length > 4).slice(0, 5)
      };
    }
    
    compareStances(doc1, doc2) {
      const stance1 = this.extractStanceKeywords(doc1.content);
      const stance2 = this.extractStanceKeywords(doc2.content);
      
      return {
        document1_stance: stance1,
        document2_stance: stance2,
        stance_alignment: this.calculateStanceAlignment(stance1, stance2),
        potential_contradiction: stance1.tone !== stance2.tone && stance1.commitment !== stance2.commitment
      };
    }
    
    extractStanceKeywords(content) {
      const contentLower = content.toLowerCase();
      
      let tone = 'neutral';
      if (contentLower.includes('committed') || contentLower.includes('will implement')) tone = 'positive';
      else if (contentLower.includes('reject') || contentLower.includes('will not')) tone = 'negative';
      else if (contentLower.includes('considering') || contentLower.includes('review')) tone = 'cautious';
      
      let commitment = 'medium';
      if (contentLower.includes('definitely') || contentLower.includes('committed')) commitment = 'high';
      else if (contentLower.includes('might') || contentLower.includes('possibly')) commitment = 'low';
      
      let urgency = 'normal';
      if (contentLower.includes('immediate') || contentLower.includes('urgent')) urgency = 'high';
      else if (contentLower.includes('gradual') || contentLower.includes('long-term')) urgency = 'low';
      
      return { tone, commitment, urgency };
    }
    
    calculateStanceAlignment(stance1, stance2) {
      const alignmentScore = 
        (stance1.tone === stance2.tone ? 33 : 0) +
        (stance1.commitment === stance2.commitment ? 33 : 0) +
        (stance1.urgency === stance2.urgency ? 34 : 0);
      
      if (alignmentScore >= 67) return 'high_alignment';
      if (alignmentScore >= 34) return 'partial_alignment';
      return 'low_alignment';
    }
    
    extractKeyDifferences(doc1, doc2) {
      const differences = [];
      
      // Time-based differences
      const timeDiff = this.calculateDaysApart(doc1.date, doc2.date);
      if (timeDiff > 30) {
        differences.push(`Documents are ${Math.floor(timeDiff)} days apart`);
      }
      
      // Speaker differences
      if (doc1.speaker !== doc2.speaker) {
        differences.push(`Different speakers: ${doc1.speaker} vs ${doc2.speaker}`);
      }
      
      // Content tone differences
      const stance1 = this.extractStanceKeywords(doc1.content);
      const stance2 = this.extractStanceKeywords(doc2.content);
      if (stance1.tone !== stance2.tone) {
        differences.push(`Different tones: ${stance1.tone} vs ${stance2.tone}`);
      }
      
      return differences;
    }
    
    findSimilarities(doc1, doc2) {
      const similarities = [];
      
      // Same speaker
      if (doc1.speaker === doc2.speaker) {
        similarities.push(`Both from ${doc1.speaker}`);
      }
      
      // Similar timeframe (within 30 days)
      const timeDiff = this.calculateDaysApart(doc1.date, doc2.date);
      if (timeDiff <= 30) {
        similarities.push('Similar timeframe');
      }
      
      // Content overlap analysis
      const contentAnalysis = this.analyzeContentDifferences(doc1, doc2);
      if (parseFloat(contentAnalysis.content_overlap) > 30) {
        similarities.push(`${contentAnalysis.content_overlap}% content overlap`);
      }
      
      return similarities;
    }
    
    calculateDaysApart(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const timeDiff = Math.abs(d2.getTime() - d1.getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    
    generateComparisonSummary(comparison, document1, document2) {
      const summary = [];
      
      summary.push(`Comparing statements from ${document1.date} and ${document2.date}`);
      
      if (comparison.stance_comparison.potential_contradiction) {
        summary.push('Potential contradiction detected between positions');
      } else {
        summary.push(`Positions show ${comparison.stance_comparison.stance_alignment.replace('_', ' ')}`);
      }
      
      if (comparison.content_analysis.content_overlap > 50) {
        summary.push('High content similarity suggests consistent messaging');
      } else if (comparison.content_analysis.content_overlap < 20) {
        summary.push('Low content similarity suggests different focus areas');
      }
      
      return summary.join('. ');
    }
  }
  
  module.exports = new ComparisonService();