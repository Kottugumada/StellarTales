import { SearchResult } from './types';
import OpenAI from 'openai';

class SearchService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async searchConstellation(query: string): Promise<SearchResult> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ 
        role: "user", 
        content: this.buildAstronomyPrompt(query) 
      }]
    });
    
    return {
      text: completion.choices[0].message.content || '',
      confidence: 1.0
    };
  }

  private buildAstronomyPrompt(query: string): string {
    return `Query about constellation: ${query}
            Context: Provide scientific facts and mythology`;
  }
}

export default SearchService; 