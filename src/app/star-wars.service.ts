import { LogService } from './log.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StarWarsService {
  private characters = [
    { name: 'Luke Skywalker', side: ''},
    { name: 'Han Solo', side: ''},
    { name: 'Darth Vader', side: ''},
    { name: 'Princess Leia', side: ''},
    { name: 'Master Yoda', side: ''}
  ];
  private logService: LogService;
  charactersChanged = new Subject<void>();
  httpClient: HttpClient;

  constructor(logService: LogService, httpClient: HttpClient) {
    this.logService = logService;
    this.httpClient = httpClient;
  }

  fetchCharacters() {
    this.httpClient.get('https://swapi.co/api/people/')
      .map((response: Response) => {
        const data = response;
        const extractedChars = data.results;
        const chars = extractedChars.map((char) => {
            return {name: char.name, side: ''};
        });
        return chars;
      })
      .subscribe(
      (data) => {
        console.log(data);
        this.characters = data;
        this.charactersChanged.next();
        }
      );
  }

  getCharacters(chosenList) {
    if (chosenList === 'all') {
      return this.characters.slice();
    }
    return this.characters.filter((char) => {
      return char.side === chosenList;
    });
  }

  onSideChosen(charInfo) {
    const pos = this.characters.findIndex((char) => {
      return char.name === charInfo.name;
    })
    this.characters[pos].side = charInfo.side;
    this.charactersChanged.next();
    this.logService.writeLog('Changed side of ' + charInfo.name + ', new side: ' + charInfo.side);
  }

  addCharacter(name, side) {
    const pos = this.characters.findIndex((char) => {
      return char.name === name;
    })
    if(pos !== -1) {
      return;
    }
    const newChar = {name: name, side: side};
    this.characters.push(newChar);
  }
}

