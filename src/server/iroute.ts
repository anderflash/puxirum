import * as Router from 'koa-router';

/**
 * Defining route interface
 */
export interface IRoute {
  method: 'get'|'post'|'put'|'delete';
  path: string;
  action: Router.IMiddleware;
}
