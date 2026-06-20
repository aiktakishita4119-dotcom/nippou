import Anthropic from '@anthropic-ai/sdk';
import type { CalendarEvent } from './calendar.js';

export async function generateReport(events: CalendarEvent[]): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const eventsJson = JSON.stringify(events, null, 2);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'あなたは日報作成アシスタントです。',
    messages: [
      {
        role: 'user',
        content: `今日のカレンダーイベントを元に、日本語で日報を作成してください。\n\n${eventsJson}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  return content.text;
}
