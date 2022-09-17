import path from 'path';
import express from 'express';
import * as IMAP from './workers/imap';
import * as SMTP from './workers/smtp';
import * as Contacts from './workers/contacts';
import { serverInfo } from './serverInfo';

const app = express();

// CORS security rules
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept'
  );
  next();
});

// Parsing json
app.use(express.json());

// Serving static files from client
//app.use('/', () => {
//  express.static(path.join(__dirname, '../../client/dist'));
//});

// Test route
app.get('/hello', (_, res) => {
  res.send('Hello from Express!').status(200);
});

// Routes
app.get('/mailboxes', async (_, res) => {
  try {
    const imapWorker = new IMAP.Worker(serverInfo);
    const mailboxes = await imapWorker.listMailboxes();
    res.json(mailboxes).status(200);
  } catch (e) {
    console.log(e);
    res.send(e).status(500);
  }
});

app.get('/mailboxes/:mailbox', async (req, res) => {
  try {
    const imapWorker = new IMAP.Worker(serverInfo);
    const messages = await imapWorker.listMessages({
      mailbox: req.params.mailbox,
    });
    res.json(messages).status(200);
  } catch (e) {
    console.log(e);
    res.send('error').status(500);
  }
});

app.get('/messages/:mailbox/:id', async (req, res) => {
  try {
    const imapWorker = new IMAP.Worker(serverInfo);
    const messageBody = await imapWorker.getMessageBody({
      mailbox: req.params.mailbox,
      id: parseInt(req.params.id, 10),
    });
    res.send(messageBody).status(200);
  } catch (e) {
    res.send('error').status(500);
  }
});

app.delete('/messages/:mailbox/:id', async (req, res) => {
  try {
    const imapWorker = new IMAP.Worker(serverInfo);
    await imapWorker.deleteMessage({
      mailbox: req.params.mailbox,
      id: parseInt(req.params.id, 10),
    });
    res.send('ok').status(200);
  } catch (e) {
    res.send('error').status(500);
  }
});

app.post('/messages', async (req, res) => {
  try {
    const smtpWorker = new SMTP.Worker(serverInfo);
    await smtpWorker.sendMessage(req.body);
    res.send('ok').status(200);
  } catch (e) {
    res.send('error').status(500);
  }
});

app.get('/contacts', async (_, res) => {
  try {
    const contactsWorker = new Contacts.Worker();
    const contacts = await contactsWorker.listContacts();
    res.json(contacts).status(200);
  } catch (e) {
    res.send('error').status(500);
  }
});

app.post('/contacts', async (req, res) => {
  try {
    const contactsWorker = new Contacts.Worker();
    const contact = await contactsWorker.addContact(req.body);
    res.json(contact).status(200);
  } catch (e) {
    res.send('error').status(500);
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const contactsWorker = new Contacts.Worker();
    await contactsWorker.deleteContact(req.params.id);
    res.send('ok').status(200);
  } catch (e) {
    res.send('error').status(500);
  }
});

// Server listening
const PORT = 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
