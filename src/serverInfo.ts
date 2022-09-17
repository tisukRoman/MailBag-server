require('dotenv').config();

export interface IServerInfo {
  smtp: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
  imap: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export const serverInfo: IServerInfo = {
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 465,
    auth: {
      user: process.env.AUTH_USER || '',
      pass: process.env.AUTH_PASS || '',
    },
  },
  imap: {
    host: process.env.IMAP_HOST || '',
    port: Number(process.env.IMAP_PORT) || 993,
    auth: {
      user: process.env.AUTH_USER || '',
      pass: process.env.AUTH_PASS || '',
    },
  },
};
