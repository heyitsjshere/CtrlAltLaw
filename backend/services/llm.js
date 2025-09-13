const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class LLMService {
  async extractQuotes(documents, query, userType) {
    console.log('Extracting quotes using LLM...');
    
    const prompt = this.buildPrompt(documents, query, userType);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal research assistant that extracts relevant quotes from government documents."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
      });
      
      return this.parseResponse(response.choices[0].message.content, userType);
      
    } catch (error) {
      console.error('LLM Error:', error);
      throw new Error('Failed to process with AI');
    }
  }
  
  buildPrompt(documents, query, userType) {
    const docText = documents.map(doc => 
      `Source: ${doc.source}\nContent: ${doc.content}\nURL: ${doc.url}\n---`
    ).join('\n');
    
    if (userType === 'lawyer') {
      return `
        Find exact quotes that answer: "${query}"
        
        Documents:
        ${docText}
        
        Return response in this format:
        Quote: "[exact quote]"
        Speaker: [who said it]
        Source: [document source]
        Date: [date]
        URL: [link]
        Reliability: [HIGH/MEDIUM/LOW]
        
        Focus on precision and exact citations.
      `;
    } else {
      return `
        Answer this question in simple terms: "${query}"
        
        Documents:
        ${docText}
        
        Provide a clear, concise summary with key points.
        Include source information but make it accessible.
      `;
    }
  }
  
  parseResponse(aiResponse, userType) {
    return {
      summary: aiResponse,
      quotes: [],
      reliability: 'HIGH'
    };
  }
}

module.exports = new LLMService();