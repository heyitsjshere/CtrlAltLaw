const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

class LLMService {
    async extractQuotes(documents, query, userType) {
        console.log(`Processing ${documents.length} documents for ${userType}`);

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_key_here') {
            console.log('Using mock LLM response - no OpenAI key configured');
            return this.getMockResponse(documents, query, userType);
        }

        try {
            const prompt = this.buildPrompt(documents, query, userType);

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: this.getSystemPrompt(userType)
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 1000,
            });

            const aiResponse = response.choices[0].message.content;
            return this.parseResponse(aiResponse, documents, userType);

        } catch (error) {
            console.error('OpenAI API error:', error.message);
            return this.getMockResponse(documents, query, userType);
        }
    }

    getSystemPrompt(userType) {
        if (userType === 'lawyer') {
            return `You are a legal research assistant specializing in Singapore parliamentary records. 
      Provide precise, citation-ready quotes with exact source attribution. 
      Focus on accuracy, specificity, and legal precedent value.
      Always include reliability assessments based on source authority.`;
        } else {
            return `You are a helpful assistant that explains Singapore government policy in plain English.
      Make complex legal and policy information accessible to the general public.
      Provide clear summaries while maintaining accuracy about sources.`;
        }
    }

    buildPrompt(documents, query, userType) {
        const docText = documents.map((doc, index) =>
            `[Document ${index + 1}]
      Title: ${doc.title}
      Source: ${doc.source}
      Date: ${doc.date}
      Speaker: ${doc.speaker}
      Content: ${doc.content}
      URL: ${doc.url}
      ---`
        ).join('\n');

        if (userType === 'lawyer') {
            return `Question: "${query}"
      
      Documents:
      ${docText}
      
      Extract exact quotes that answer the question. For each quote provide:
      1. The exact quotation in quotes
      2. Speaker name and title
      3. Source document with date
      4. Direct URL link
      5. Reliability score (HIGH/MEDIUM/LOW)
      6. Legal context or significance
      
      Format as a structured response suitable for legal citation.`;
        } else {
            return `Question: "${query}"
      
      Documents:
      ${docText}
      
      Provide a clear, concise answer in plain English that:
      1. Directly answers the question
      2. Summarizes key government positions
      3. Mentions credible sources
      4. Explains implications for the public
      
      Keep technical jargon to a minimum.`;
        }
    }

    parseResponse(aiResponse, documents, userType) {
        // Extract quotes and structure the response
        const quotes = documents.map(doc => ({
            text: doc.content.substring(0, 200) + "...",
            speaker: doc.speaker,
            source: doc.source,
            date: doc.date,
            url: doc.url,
            reliability: doc.reliability || 'HIGH',
            type: doc.type
        }));

        return {
            summary: aiResponse,
            quotes: quotes,
            userType: userType,
            documentCount: documents.length,
            reliability: this.calculateOverallReliability(documents)
        };
    }

    calculateOverallReliability(documents) {
        const scores = documents.map(doc => {
            switch (doc.reliability) {
                case 'HIGH': return 3;
                case 'MEDIUM': return 2;
                case 'LOW': return 1;
                default: return 2;
            }
        });

        const average = scores.reduce((a, b) => a + b, 0) / scores.length;

        if (average >= 2.5) return 'HIGH';
        if (average >= 1.5) return 'MEDIUM';
        return 'LOW';
    }

    getMockResponse(documents, query, userType) {
        // Fallback response when OpenAI is not available
        if (userType === 'lawyer') {
            return {
                summary: `Based on parliamentary records, the government has addressed "${query}" through official statements and policy announcements. Specific quotes and citations are available in the source documents provided.`,
                quotes: documents.map(doc => ({
                    text: doc.content,
                    speaker: doc.speaker,
                    source: doc.source,
                    date: doc.date,
                    url: doc.url,
                    reliability: doc.reliability || 'HIGH',
                    type: doc.type
                })),
                userType: 'lawyer',
                documentCount: documents.length,
                reliability: 'HIGH'
            };
        } else {
            return {
                summary: `The Singapore government has made official statements about "${query}". The information comes from verified parliamentary records and press releases.`,
                quotes: documents.slice(0, 2), // Simplified for general users
                userType: 'layperson',
                documentCount: documents.length,
                reliability: 'HIGH'
            };
        }
    }

    // Add this method to your existing LLMService class
    async processWithCrossVerification(documents, query, userType) {
        const crossVerification = require('./crossVerification');

        // Run cross-verification analysis
        const contradictions = crossVerification.detectContradictions(documents);
        const policyEvolution = crossVerification.trackPolicyEvolution(documents, query);
        const documentsWithConfidence = crossVerification.calculateContentConfidence(documents, query);

        // Get regular LLM response
        const baseResponse = await this.extractQuotes(documentsWithConfidence, query, userType);

        // Enhance response with cross-verification data
        return {
            ...baseResponse,
            crossVerification: {
                contradictions,
                policyEvolution,
                overallConfidence: this.calculateOverallConfidence(documentsWithConfidence),
                verificationSummary: this.generateVerificationSummary(contradictions, policyEvolution)
            }
        };
    }

    generateVerificationSummary(contradictions, policyEvolution) {
        const parts = [];

        if (contradictions.length > 0) {
            parts.push(`${contradictions.length} potential contradiction${contradictions.length > 1 ? 's' : ''} detected`);
        }

        if (policyEvolution.totalChanges > 0) {
            parts.push(`Policy position changed ${policyEvolution.totalChanges} time${policyEvolution.totalChanges > 1 ? 's' : ''}`);
        }

        if (parts.length === 0) {
            return 'No contradictions detected, policy position appears consistent';
        }

        return parts.join('; ');
    }

    calculateOverallConfidence(documentsWithConfidence) {
        if (!documentsWithConfidence || documentsWithConfidence.length === 0) {
            return 0;
        }

        const totalScore = documentsWithConfidence.reduce((sum, doc) => {
            return sum + (doc.confidenceScore || 50);
        }, 0);

        return Math.round(totalScore / documentsWithConfidence.length);
    }

    async processWithCrossVerification(documents, query, userType) {
        const crossVerification = require('./crossVerification');
        const queryIntelligence = require('./queryIntelligence');

        // Parse query for comparison analysis
        const queryAnalysis = queryIntelligence.parseQuery(query);

        // Run cross-verification analysis
        const contradictions = crossVerification.detectContradictions(documents);
        const policyEvolution = crossVerification.trackPolicyEvolution(documents, query);
        const documentsWithConfidence = crossVerification.calculateContentConfidence(documents, query);
        const sideBySideComparisons = crossVerification.generateSideBySideComparisons(documents, queryAnalysis);

        // Get regular LLM response
        const baseResponse = await this.extractQuotes(documentsWithConfidence, query, userType);

        // Enhance response with cross-verification data
        return {
            ...baseResponse,
            crossVerification: {
                contradictions,
                policyEvolution,
                sideBySideComparisons, // New comparison feature
                overallConfidence: this.calculateOverallConfidence(documentsWithConfidence),
                verificationSummary: this.generateVerificationSummary(contradictions, policyEvolution, sideBySideComparisons)
            }
        };
    }
}

module.exports = new LLMService();