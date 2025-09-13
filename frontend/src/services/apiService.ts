import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface SearchRequest {
  query: string;
  userType: 'lawyer' | 'layperson';
  includeCrossVerification?: boolean;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  userType: string;
  results: {
    summary: string;
    quotes: Array<{
      text: string;
      speaker: string;
      source: string;
      date: string;
      url: string;
      reliability: string;
      type: string;
    }>;
    crossVerification?: {
      contradictions: any[];
      policyEvolution: any;
      sideBySideComparisons: any[];
      overallConfidence: number;
      verificationSummary: string;
    };
  };
  documentCount: number;
  searchTime: string;
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async search(params: SearchRequest): Promise<SearchResponse> {
    const response = await this.api.post('/search', params);
    return response.data;
  }

  async healthCheck(): Promise<{ message: string; timestamp: string }> {
    const response = await this.api.get('/test');
    return response.data;
  }
}

export const apiService = new ApiService();