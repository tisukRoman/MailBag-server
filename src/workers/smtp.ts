import Mail from 'nodemailer/lib/mailer';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { IServerInfo } from '../serverInfo';

export class Worker {
  private serverInfo: IServerInfo;

  constructor(serverInfo: IServerInfo) {
    this.serverInfo = serverInfo;
  }

  async sendMessage(options: SendMailOptions): Promise<string> {
    try {
      const transport: Mail = nodemailer.createTransport(this.serverInfo.smtp);
      return await transport.sendMail(options);
    } catch (err) {
      throw err;
    }
  }
}
