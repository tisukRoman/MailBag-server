import { IServerInfo } from '../serverInfo';
import { simpleParser, ParsedMail } from 'mailparser';
const ImapClient = require('emailjs-imap-client');

export interface ICallOptions {
  mailbox: string;
  id?: number;
}

export interface IMessage {
  id: string;
  date: string;
  from: string;
  subject: string;
  body?: string;
}

interface IMailbox {
  name: string;
  path: string;
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export class Worker {
  private serverInfo: IServerInfo;

  constructor(serverInfo: IServerInfo) {
    this.serverInfo = serverInfo;
  }

  private async connectToServer(): Promise<any> {
    try {
      const { host, port, auth } = this.serverInfo.imap;
      const client = new ImapClient.default(host, port, { auth });
      client.logLevel = client.LOG_LEVEL_NONE;
      client.onError = (error: Error) => {
        console.log(error);
      };
      await client.connect();
      return client;
    } catch (err) {
      throw err;
    }
  }

  async listMailboxes(): Promise<IMailbox[]> {
    try {
      const client = await this.connectToServer();
      const mailboxes = await client.listMailboxes();
      await client.close();
      return mailboxes.children.map((m: any) => ({
        name: m.name,
        path: m.path,
      }));
    } catch (err) {
      throw err;
    }
  }

  async listMessages(options: ICallOptions): Promise<IMessage[]> {
    try {
      const client = await this.connectToServer();
      const mailbox = await client.selectMailbox(options.mailbox);
      if (mailbox.exists === 0) {
        await client.close();
        return [];
      }
      const messages = await client.listMessages(client.mailbox, '1:*', [
        'uid',
        'envelope',
      ]);
      await client.close();
      return messages.map((message: any) => ({
        id: message.uid,
        date: message.envelope.date,
        from: message.envelope.from[0].address,
        subject: message.envelope.subject,
      })) as IMessage[];
    } catch (err) {
      throw err;
    }
  }

  async getMessageBody(options: ICallOptions): Promise<string> {
    try {
      const client = await this.connectToServer();
      const messages: any[] = await client.listMessages(
        options.mailbox,
        options.id,
        ['body[]'],
        { byUid: true }
      );
      const parsed: ParsedMail = await simpleParser(messages[0]['body[]']);
      await client.close();
      return parsed.html as string;
    } catch (err) {
      throw err;
    }
  }

  async deleteMessage(options: ICallOptions): Promise<void> {
    try {
      const client = await this.connectToServer();
      await client.deleteMessages(options.mailbox, options.id, { byUid: true });
      await client.close();
    } catch (err) {
      throw err;
    }
  }
}
