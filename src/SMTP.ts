import Mail from 'nodemailer/lib/mailer';
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { IServerInfo } from './serverInfo';

export class Worker {
  private serverInfo: IServerInfo;

  constructor(serverInfo: IServerInfo) {
    this.serverInfo = serverInfo;
  }

  async sendMessage(options: SendMailOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const transport: Mail = nodemailer.createTransport(this.serverInfo.smtp);
      transport.sendMail(options, (err, info: SentMessageInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}
