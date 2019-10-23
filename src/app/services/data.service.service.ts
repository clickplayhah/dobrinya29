import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public bears: Bear[] = [];

  constructor(private httpClient: HttpClient) {}

  private saveDataToLocalStorage() {
    localStorage.setItem('bears', JSON.stringify({ bears: this.bears, time: Date.now() }));
  }

  private getDataFromLocalStorage() {
    const data = localStorage.getItem('bears');
    if (data) {
      const parsed = JSON.parse(data);
      if (Date.now() - parsed.time > 1000 * 60 * 60 * 24 * 1) {
        localStorage.removeItem('bears');
        return null;
      } else {
        return parsed.bears;
      }
    }
    return null;
  }

  public getData() {
    const localData = this.getDataFromLocalStorage();
    if (localData) {
      this.bears = localData;
      return;
    }

    const bears = new Map<string, Bear>();
    this.httpClient
      .get(
        'https://spreadsheets.google.com/feeds/cells/1p5WKcp-MLDr-33Li1lTk1i2y8MErnv1Wjk41HrkQQXE/1/public/full?alt=json',
      )
      .subscribe((resp: Response) => {
        resp.feed.entry.forEach(ent => {
          if (ent.gs$cell.row !== '1' && ent.gs$cell.col !== '1') {
            let bear: Bear;
            if (bears.has(ent.gs$cell.row)) {
              bear = bears.get(ent.gs$cell.row) as Bear;
            } else {
              bear = {
                size: '',
                name: '',
                colors: [],
                price: '',
              };
              bears.set(ent.gs$cell.row, bear);
            }
            if (ent.gs$cell.col === '2') {
              bear.size = ent.content.$t;
            } else if (ent.gs$cell.col === '3') {
              bear.name = ent.content.$t;
            } else if (ent.gs$cell.col === '4') {
              bear.colors = ent.content.$t.split(', ');
            } else if (ent.gs$cell.col === '5') {
              bear.price = ent.content.$t;
            }
          }
        });
        this.bears.length = 0;
        this.bears.push(...bears.values());
        this.saveDataToLocalStorage();
      });
  }

  public sendForm(name: string, phone: string, comment: string) {
    const message = `${name} (${phone})\n ${comment}`;
    const url = 'https://dobrinya29bot.herokuapp.com/?message=' + encodeURI(message);
    return this.httpClient.get<TGResponse>(url);
  }
}

export interface Bear {
  size: string;
  name: string;
  colors: string[];
  price: string;
}

interface Response {
  encoding: string;
  version: string;
  feed: {
    entry: {
      gs$cell: { row: string; col: string };
      content: { type: string; $t: string };
    }[];
  };
}

interface TGResponse {
  status: 'OK' | 'Failed';
  message: string;
}
