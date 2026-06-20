import Anthropic from '@anthropic-ai/sdk';
import type { CalendarEvent } from './calendar.js';

export async function generateReport(events: CalendarEvent[], type: 'full' | 'work' = 'full'): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const eventsJson = JSON.stringify(events, null, 2);

  let userPrompt: string;
  if (type === 'work') {
    userPrompt = `今日のカレンダーイベント（9:00～16:00の仕事活動中心）を元に、日本語で日報を作成してください。\n\n${eventsJson}`;
  } else {
    userPrompt = `今日のカレンダーイベントを元に、日本語で日報を作成してください。\n\n${eventsJson}`;
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'あなたは日報作成アシスタントです。',
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  return content.text;
}
