import { fetchTodayEvents } from './calendar.js';
import { generateReport } from './report.js';
import { postToSlack } from './slack.js';

async function main() {
  try {
    console.log('Fetching today\'s calendar events...');
    const events = await fetchTodayEvents();
    console.log(`Found ${events.length} events.`);

    console.log('Generating daily report...');
    const report = await generateReport(events);
    console.log('Report generated.');

    console.log('Posting report to Slack...');
    await postToSlack(report);
    console.log('Report posted to Slack successfully.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
