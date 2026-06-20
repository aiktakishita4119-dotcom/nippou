import { google } from 'googleapis';

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  }

  const credentials = JSON.parse(Buffer.from(serviceAccountJson, 'base64').toString());

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
  });

  const gmail = google.gmail({ version: 'v1', auth });

  const message = [
    `To: ${options.to}`,
    `Subject: ${options.subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    options.body,
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log(`Email sent to ${options.to}`);
}
