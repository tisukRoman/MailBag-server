import path from 'path';
import DataStore from 'nedb';

interface IContact {
  _id?: number;
  name: string;
  email: string;
}

export class Worker {
  private db: DataStore;

  constructor() {
    this.db = new DataStore({
      filename: path.join(__dirname, 'contacts.db'),
      autoload: true,
    });
  }

  async listContacts(): Promise<IContact[]> {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err: Error, docs: IContact[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  async addContact(contact: IContact): Promise<IContact> {
    return new Promise((resolve, reject) => {
      this.db.insert(contact, (err: Error | null, document: IContact) => {
        if (err) {
          reject(err);
        } else {
          resolve(document);
        }
      });
    });
  }

  async deleteContact(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, (err: Error | null, n: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(n);
        }
      });
    });
  }
}
