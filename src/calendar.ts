import { google } from 'googleapis';

export type CalendarEvent = {
  summary: string;
  start: string;
  end: string;
  description?: string;
};

export async function fetchTodayEvents(): Promise<CalendarEvent[]> {
  const serviceAccountJson = Buffer.from(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON!,
    'base64'
  ).toString('utf-8');
  const credentials = JSON.parse(serviceAccountJson);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const todayJST = new Date(now.getTime() + jstOffset);
  const dateStr = todayJST.toISOString().split('T')[0];

  const timeMin = new Date(`${dateStr}T00:00:00+09:00`).toISOString();
  const timeMax = new Date(`${dateStr}T23:59:59+09:00`).toISOString();

  const response = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const items = response.data.items || [];

  return items.map((item) => ({
    summary: item.summary || '(無題)',
    start: item.start?.dateTime || item.start?.date || '',
    end: item.end?.dateTime || item.end?.date || '',
    description: item.description || undefined,
  }));
}
