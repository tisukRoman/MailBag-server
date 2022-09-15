import path from 'path';
import fs from 'fs';

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

const rawInfo = fs.readFileSync(path.join(__dirname, './serverInfo.json'), {
  encoding: 'utf-8',
});

export let serverInfo: IServerInfo = JSON.parse(rawInfo);
