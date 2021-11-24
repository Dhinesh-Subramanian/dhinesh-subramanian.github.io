import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Article, NewsService } from './news.service';
import * as $ from "jquery";
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'news-app';
  categories: Array<Category> = [{ name: 'TechCrunch', url: 'https://newsapi.org/v2/top-headlines?sources=techcrunch' }, { name: 'Business', url: 'https://newsapi.org/v2/top-headlines?country=us&category=business' }, { name: 'Wall Street Journal', url: 'https://newsapi.org/v2/everything?domains=wsj.com' }]
  news: Array<Article> = []
  categoryForm: FormGroup = new FormGroup({ name: new FormControl(''), url: new FormControl('') })
  @ViewChild('liveSearch', { static: true })
  textbox!: ElementRef<HTMLInputElement>;
  constructor(private newsService: NewsService) { }
  ngOnInit(): void {
    this.getNewsByCategory(this.categories[0].url)
    const inputChanges$ = fromEvent(this.textbox.nativeElement, 'input');
    inputChanges$
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((x) => {
          if (x)
            return this.newsService.getSearch(x)
          else
            return this.newsService.fetchNews($('.nav-link.active').data('url'))
        })
      ).subscribe(res => { this.news = res.articles; console.log(this.news) });
  }
  getNewsByCategory(category: string) {
    console.log(category)
    this.newsService.fetchNews(category).subscribe(res => { this.news = res.articles; console.log(this.news) })
  }
  addCategory() {
    this.categories.push(this.categoryForm.value)
    // this.getNewsByCategory(this.categories[this.categories.length - 1].url)
    $(".news-category .nav-link").each(function () {
      $(this).removeClass("active");
    });
    setTimeout(() => {
      $($(".news-category .nav-link.category")[$(".news-category .nav-link.category").length - 1]).click()
    }, 0);
  }
}
export interface Category {
  name: string,
  url: string
}
