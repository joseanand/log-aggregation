import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/collections';
import { timer, Observable, of, Subject } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-log-aggr',
  templateUrl: './log-aggr.component.html',
  styleUrls: ['./log-aggr.component.css']
})
export class LogAggrComponent implements OnInit {

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  displayedColumns = ['_id', 'count'];
  dataSource = new LogAggrDataSource(this.api);

  aggr: any;

  ngOnInit() {
    this.invokeService();
  }

  invokeService() {
    this.api.getAggrLogs().subscribe(res => {
      console.log(res);
      this.aggr = res;
    }, err => {
      console.log(err);
    });
    return this.aggr;
  }

  // Kill subject to stop all requests for component
  private killTrigger: Subject<void> = new Subject();

  private fetchData$: Observable<string> = this.invokeService();

  private refreshInterval$: Observable<string> = timer(0, 4000)
    .pipe(
      // This kills the request if the user closes the component 
      takeUntil(this.killTrigger),
      // switchMap cancels the last request, if no response have been received since last tick
      switchMap(() => this.fetchData$),
      // catchError handles http throws 
      catchError(error => of('Error'))
    );

}

export class LogAggrDataSource extends DataSource<any> {
  constructor(private api: ApiService) {
    super()
  }

  connect() {
    return this.api.getAggrLogs();
  }

  disconnect() {

  }
}
