import * as koaJwt          from 'koa-jwt';
import * as Router          from 'koa-router';
import * as jwt             from 'jsonwebtoken';

import { IRoute }           from './iroute';
import { PXRController }    from './pxr-controller';

/**
 * Controller for Koa
 */
export class PXRKoaController {
  /**
   * Initializes a Controller for Koa
   * @param {PXRController} private controller [description]
   */
  constructor(private controller: PXRController) {  }

  /**
   * Register a user in a Koa context
   * @param  {Router.IRouterContext} ctx [description]
   * @return {Promise<void>}             [description]
   */
  async register(ctx: Router.IRouterContext): Promise<void> {
    // Is it complete?
    if(ctx.request.body.username && ctx.request.body.password && ctx.request.body.email) {
    
      // Call the controller
      try{
        let id = await this.controller.register({
          username: ctx.request.body.username,
          email: ctx.request.body.email,
          password: ctx.request.body.password
        });

        // Return the result
        ctx.body = { id: id };
      } catch(e){
        ctx.throw("Invalid data or user already exist. Please send us a valid user (email, username and password)", 400);
      }
    }
    // Something wrong (e.g. invalid input, database out of work...)
    else {
      ctx.throw("Invalid data or user already exist. Please send us a valid user (email, username and password)", 400);
    }
  }

  /**
   * Authenticating a user in a Koa context
   * @param  {Router.IRouterContext} ctx [description]
   * @return {Promise<void>}             [description]
   */
  async login(ctx: Router.IRouterContext): Promise<void> {
    let body = ctx.request.body;

    // Login by username or email (both approaches should have password)
    if((body.username || body.email) && body.password && body.password.length >= 8 && body.password.length <= 32){
      try {
        let token = await this.controller.login(body);
        ctx.body = {token: token};
      } catch(e) {
        ctx.throw("Error authenticating the user. Try to pass valid credentials", 400);
      }
    }
    else
      ctx.throw("Error authenticating the user. Try to pass valid credentials", 400);
  }

  /**
   * Get projects of the authenticated user
   * @param  {Router.IRouterContext} ctx [description]
   * @return {Promise<void>}             [description]
   */
  async getProjects(ctx: Router.IRouterContext): Promise<void> {
    try {
      let projects = await this.controller.getProjects(this.getToken(ctx));
      ctx.body = { projects: projects };
    } catch(e) {
      ctx.throw("There is an error listing the projects of the user. Are you logged?", 400);
    }
  }

  /**
   * Get JWT token from Koa context
   * @param  {Router.IRouterContext} ctx [description]
   * @return {string}                    [description]
   */
  private getToken(ctx: Router.IRouterContext): string {
    let parts: string[] = ctx.header.authorization.split(' ');
    if (parts.length == 2 && /^Bearer$/i.test(parts[0]))
      return parts[1];
    return null;    
  }
}