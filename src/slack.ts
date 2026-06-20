import axios from 'axios';

export async function postToSlack(message: string): Promise<void> {
  await axios.post(process.env.SLACK_WEBHOOK_URL!, {
    text: message,
  });
}
