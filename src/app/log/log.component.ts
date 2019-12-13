import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor(private api: ApiService) { }

  displayedColumns = ['level','loggerName', 'message'];
  dataSource = new LogDataSource(this.api);

  logs: any;

  ngOnInit() {
    this.api.getLogs()
      .subscribe(res => {
        console.log(res);
        this.logs = res;
      }, err => {
        console.log(err);
      });
  }

}

export class LogDataSource extends DataSource<any> {
  constructor(private api: ApiService) {
    super()
  }

  connect() {
    return this.api.getLogs();
  }

  disconnect() {

  }
}
