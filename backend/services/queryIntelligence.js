class QueryIntelligenceService {
    constructor() {
      this.singaporeAcronyms = {
        'BTO': ['Build-To-Order', 'public housing', 'HDB flats'],
        'CPF': ['Central Provident Fund', 'retirement savings', 'provident fund'],
        'ERP': ['Electronic Road Pricing', 'road tolls', 'congestion pricing'],
        'COE': ['Certificate of Entitlement', 'vehicle quota', 'car permits'],
        'GST': ['Goods and Services Tax', 'consumption tax', 'sales tax'],
        'MAS': ['Monetary Authority of Singapore', 'central bank'],
        'MOH': ['Ministry of Health'],
        'MOE': ['Ministry of Education'],
        'MOM': ['Ministry of Manpower', 'labour ministry'],
        'HDB': ['Housing Development Board', 'public housing authority'],
        'LTA': ['Land Transport Authority'],
        'NEA': ['National Environment Agency'],
        'URA': ['Urban Redevelopment Authority'],
        'IRAS': ['Inland Revenue Authority of Singapore', 'tax authority'],
        'LTA':['Land Transport Authority'],
        'NEA':['National Environment Agency'],
        'SMRT':['Singapore Mass Rapid Transport'],
        'ICA':['Immigrations and Checkpoint Authority']
      };
  
      this.queryIntents = {
        comparison: ['compare', 'versus', 'vs', 'difference between', 'contrast'],
        timeline: ['change', 'evolution', 'over time', 'timeline', 'history', 'progression'],
        contradiction: ['contradict', 'conflict', 'disagree', 'inconsistent', 'opposite'],
        recent: ['latest', 'recent', 'newest', 'current', 'new', 'today'],
        causation: ['because', 'due to', 'caused by', 'reason', 'why'],
        impact: ['effect', 'impact', 'consequence', 'result', 'outcome']
      };
  
      this.timeIndicators = {
        relative: ['recently', 'lately', 'this year', 'last year', 'previous', 'before', 'after'],
        specific: /\b(20\d{2}|january|february|march|april|may|june|july|august|september|october|november|december)\b/gi,
        ranges: ['between', 'from', 'to', 'since', 'until']
      };
    }
  
    parseQuery(query) {
      const analysis = {
        originalQuery: query,
        expandedQuery: this.expandAcronyms(query),
        intent: this.detectIntent(query),
        entities: this.extractEntities(query),
        timeframe: this.extractTimeframe(query),
        searchStrategy: null,
        confidence: 0
      };
  
      analysis.searchStrategy = this.determineSearchStrategy(analysis);
      analysis.confidence = this.calculateParsingConfidence(analysis);
  
      return analysis;
    }
  
    expandAcronyms(query) {
      let expandedQuery = query;
      
      // Replace acronyms with their full forms and synonyms
      for (const [acronym, expansions] of Object.entries(this.singaporeAcronyms)) {
        const regex = new RegExp(`\\b${acronym}\\b`, 'gi');
        if (regex.test(query)) {
          // Add all variations to search terms
          expandedQuery += ` ${expansions.join(' ')}`;
        }
      }
  
      return expandedQuery;
    }
  
    detectIntent(query) {
      const queryLower = query.toLowerCase();
      const detectedIntents = [];
  
      for (const [intent, keywords] of Object.entries(this.queryIntents)) {
        for (const keyword of keywords) {
          if (queryLower.includes(keyword)) {
            detectedIntents.push(intent);
            break;
          }
        }
      }
  
      return detectedIntents.length > 0 ? detectedIntents : ['search'];
    }
  
    extractEntities(query) {
      const entities = {
        ministers: this.extractMinisters(query),
        organizations: this.extractOrganizations(query),
        policies: this.extractPolicies(query),
        acronyms: this.extractAcronyms(query)
      };
  
      return entities;
    }
  
    extractMinisters(query) {
      const ministerPatterns = [
        /\b(Prime Minister|PM)\b/gi,
        /\b(Deputy Prime Minister|DPM)\b/gi,
        /\bMinister\s+\w+/gi,
        /\b(Minister of|Minister for)\s+[\w\s]+/gi
      ];
  
      const ministers = [];
      ministerPatterns.forEach(pattern => {
        const matches = query.match(pattern);
        if (matches) ministers.push(...matches);
      });
  
      return ministers;
    }
  
    extractOrganizations(query) {
      const organizations = [];
      for (const acronym of Object.keys(this.singaporeAcronyms)) {
        const regex = new RegExp(`\\b${acronym}\\b`, 'gi');
        if (regex.test(query)) {
          organizations.push(acronym);
        }
      }
      return organizations;
    }
  
    extractPolicies(query) {
      const policyKeywords = [
        'housing', 'transport', 'healthcare', 'education', 'employment',
        'tax', 'immigration', 'environment', 'technology', 'defense'
      ];
  
      return policyKeywords.filter(keyword => 
        query.toLowerCase().includes(keyword)
      );
    }
  
    extractAcronyms(query) {
      const foundAcronyms = [];
      for (const acronym of Object.keys(this.singaporeAcronyms)) {
        const regex = new RegExp(`\\b${acronym}\\b`, 'gi');
        if (regex.test(query)) {
          foundAcronyms.push({
            acronym,
            expansions: this.singaporeAcronyms[acronym]
          });
        }
      }
      return foundAcronyms;
    }
  
    extractTimeframe(query) {
      const timeframe = {
        specific: [],
        relative: [],
        ranges: []
      };
  
      // Extract specific dates/years
      const specificMatches = query.match(this.timeIndicators.specific);
      if (specificMatches) {
        timeframe.specific = specificMatches;
      }
  
      // Extract relative time indicators
      this.timeIndicators.relative.forEach(indicator => {
        if (query.toLowerCase().includes(indicator)) {
          timeframe.relative.push(indicator);
        }
      });
  
      // Extract time ranges
      this.timeIndicators.ranges.forEach(range => {
        if (query.toLowerCase().includes(range)) {
          timeframe.ranges.push(range);
        }
      });
  
      return timeframe;
    }
  
    determineSearchStrategy(analysis) {
      const { intent, entities, timeframe } = analysis;
  
      if (intent.includes('comparison')) {
        return {
          type: 'comparative',
          requiresMultipleSources: true,
          needsTimelineAnalysis: true,
          priority: 'contradiction_detection'
        };
      }
  
      if (intent.includes('timeline')) {
        return {
          type: 'chronological',
          requiresMultipleSources: true,
          needsTimelineAnalysis: true,
          priority: 'policy_evolution'
        };
      }
  
      if (timeframe.specific.length > 1) {
        return {
          type: 'multi_temporal',
          requiresMultipleSources: true,
          needsTimelineAnalysis: true,
          priority: 'chronological_comparison'
        };
      }
  
      return {
        type: 'standard',
        requiresMultipleSources: false,
        needsTimelineAnalysis: false,
        priority: 'relevance'
      };
    }
  
    calculateParsingConfidence(analysis) {
      let confidence = 50;
  
      // Higher confidence if we detected specific entities
      if (analysis.entities.ministers.length > 0) confidence += 20;
      if (analysis.entities.organizations.length > 0) confidence += 15;
      if (analysis.entities.acronyms.length > 0) confidence += 15;
  
      // Higher confidence if we detected clear intent
      if (analysis.intent.length > 1) confidence += 10;
      if (analysis.intent.includes('comparison') || analysis.intent.includes('timeline')) confidence += 15;
  
      // Higher confidence if we extracted timeframes
      if (analysis.timeframe.specific.length > 0) confidence += 10;
  
      return Math.min(100, confidence);
    }
  
    generateSmartSearchTerms(analysis) {
      const searchTerms = [];
  
      // Add original query
      searchTerms.push(analysis.originalQuery);
  
      // Add expanded acronyms
      if (analysis.expandedQuery !== analysis.originalQuery) {
        searchTerms.push(analysis.expandedQuery);
      }
  
      // Add entity-specific searches
      analysis.entities.ministers.forEach(minister => {
        searchTerms.push(`${minister} ${analysis.entities.policies.join(' ')}`);
      });
  
      // Add organization-specific searches
      analysis.entities.organizations.forEach(org => {
        const expansions = this.singaporeAcronyms[org];
        if (expansions) {
          expansions.forEach(expansion => {
            searchTerms.push(`${expansion} ${analysis.entities.policies.join(' ')}`);
          });
        }
      });
  
      return [...new Set(searchTerms)]; // Remove duplicates
    }
  }
  
  module.exports = new QueryIntelligenceService();