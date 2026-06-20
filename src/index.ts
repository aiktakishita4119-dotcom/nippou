import { fetchTodayEvents } from './calendar.js';
import { generateReport } from './report.js';
import { postToSlack } from './slack.js';
import { sendEmail } from './mail.js';

async function main() {
  try {
    const command = process.argv[2] || 'slack';

    if (command === 'mail') {
      // Mail workflow
      console.log('Fetching work-hour calendar events...');
      const events = await fetchTodayEvents(9, 17);
      console.log(`Fetched ${events.length} work-hour events`);

      console.log('Generating daily report (work focus)...');
      const report = await generateReport(events, 'work');
      console.log('Report generated.');

      const recipient = process.env.MAIL_RECIPIENT || '';
      if (!recipient) throw new Error('MAIL_RECIPIENT not set');

      console.log('Sending report via email...');
      await sendEmail({
        to: recipient,
        subject: `【日報】${new Date().toLocaleDateString('ja-JP')}`,
        body: report,
      });
      console.log('Report sent via email successfully.');
    } else if (command === 'slack') {
      // Slack workflow (existing)
      console.log('Fetching today\'s calendar events...');
      const events = await fetchTodayEvents();
      console.log(`Found ${events.length} events.`);

      console.log('Generating daily report...');
      const report = await generateReport(events, 'full');
      console.log('Report generated.');

      console.log('Posting report to Slack...');
      await postToSlack(report);
      console.log('Report posted to Slack successfully.');
    } else {
      throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
