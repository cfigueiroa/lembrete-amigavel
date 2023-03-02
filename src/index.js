import whatsapp from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import ical from 'ical.js';
import axios from 'axios';
import schedule from 'node-schedule';
import dotenv from 'dotenv';

dotenv.config();

const reminderTimeInMinutes = parseInt(
  process.env.REMINDER_TIME_IN_MINUTES,
  10
);
const groupId = process.env.GROUP_ID;
const icsFileUrl = process.env.ICS_FILE_URL;

const { Client, LocalAuth } = whatsapp;

const client = new Client({
  puppeteer: { headless: true },
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp bot is ready!');
  printAllWids();
});

client.initialize();

async function getEventsFromICSFile(url) {
  const response = await axios.get(url);
  const icsData = response.data;
  const jcalData = ical.parse(icsData);
  const vcalendar = new ical.Component(jcalData);
  const events = vcalendar.getAllSubcomponents('vevent');
  return events
    .map((event) => {
      const summary = event.getFirstPropertyValue('summary');
      const start = event.getFirstPropertyValue('dtstart');
      if (!start || !(start instanceof ical.Time)) {
        return null;
      }
      const startJS = start.toJSDate();
      const description = event.getFirstPropertyValue('description');
      const location = event.getFirstPropertyValue('location');
      return { summary, start: startJS, description, location };
    })
    .filter((event) => event !== null);
}

async function sendMessageToGroup(message) {
  const group = await client.getChatById(groupId);
  group.sendMessage(message);
}

async function sendEventReminderToGroup(event) {
  const message = `Lembrete amigável: ${
    event.summary
  } começa em ${reminderTimeInMinutes} minutos!
Iradoso né? URI: ${event.location} | Meeting ID: ${
    event.location.split('/').slice(-1)[0]
  }`;
  await sendMessageToGroup(message);
}

async function scheduleEventReminder(event) {
  const jobName = `reminder_${event.summary}_${event.start.getTime()}`;
  const jobTime = new Date(
    event.start.getTime() - reminderTimeInMinutes * 60 * 1000
  );
  const job = schedule.scheduleJob(jobName, jobTime, () => {
    sendEventReminderToGroup(event);
  });
  if (job) {
    console.log(
      `Event reminder for '${event.summary}' successfully scheduled. event.start: ${event.start} event.location: ${event.location}`
    );
  }
}

async function scheduleEventReminders() {
  const events = await getEventsFromICSFile(icsFileUrl);
  for (const event of events) {
    await scheduleEventReminder(event);
  }
}

scheduleEventReminders();

async function printAllWids() {
  const chats = await client.getChats();
  chats.forEach((chat) => {
    console.log(chat.name, chat.id._serialized);
  });
}
