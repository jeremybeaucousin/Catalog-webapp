import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { filter } from 'rxjs/operators';


interface IBreadcrumb {
  label: string;
  params: Params;
  queryParams: Params;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.sass']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: IBreadcrumb[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    //subscribe to the NavigationEnd event
    this.router.events.pipe(
      filter(event => {
        return event instanceof NavigationEnd;
      })
    )
      .subscribe(
        event => {
          //set breadcrumbs
          let root: ActivatedRoute = this.activatedRoute.root;
          this.breadcrumbs = this.getBreadcrumbs(root);
        });
  }

  /**
 * Returns array of IBreadcrumb objects that represent the breadcrumb
 *
 * @class DetailComponent
 * @method getBreadcrumbs
 * @param {ActivateRoute} route
 * @param {string} url
 * @param {IBreadcrumb[]} breadcrumbs
 */
  private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_TRANSLATION_KEY: string = "breadcrumbTranslationKey";
    //get the child routes
    let children: ActivatedRoute[] = route.children;
    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_TRANSLATION_KEY)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

      //append route URL to URL
      url += `/${routeURL}`;

      const label = this.translate.instant(child.snapshot.data[ROUTE_DATA_TRANSLATION_KEY]);

      //add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: label,
        params: child.snapshot.params,
        queryParams: child.snapshot.queryParams,
        url: url
      };

      breadcrumbs.push(breadcrumb);
      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }

}
