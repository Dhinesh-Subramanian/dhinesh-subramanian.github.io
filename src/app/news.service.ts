import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  apiKey = 'a5cf886a8dd84801a01c8b5bd0da1b0d'

  constructor(private _http: HttpClient) { }

  fetchNews(newsURL: string) {
    return this._http.get<News>(`${newsURL}&apiKey=${this.apiKey}`)
  }

  getSearch(searchKey: string) {
    return this._http.get<News>(`https://newsapi.org/v2/everything?q=${searchKey}&apiKey=${this.apiKey}`)
  }

}
export interface News {
  "status": string,
  "totalResults": number,
  "articles": Array<Article>
}
export interface Article {
  "source": {
    "id": string,
    "name": string
  },
  "author": string,
  "title": string,
  "description": string,
  "url": string,
  "urlToImage": string,
  "publishedAt": string,
  "content": string
}