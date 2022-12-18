import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient: HttpClient) { }

  public getRepositoriesList() {
    const endpoint = `https://api.github.com/users/${environment.GITHUB_USERNAME}/repos`;
    return this.httpClient.get(endpoint);
  }
}
