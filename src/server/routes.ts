import * as Router from 'koa-router';
import { IRoute } from './iroute';
import db = require('./db');

/**
 * Register a user
 * @param  {Router.IRouterContext} ctx a koa context
 * @return {Promise<void>}             [description]
 */
async function apiRegisterUser(ctx: Router.IRouterContext): Promise<void> {
  if(ctx.request.body.username && ctx.request.body.password && ctx.request.body.email){
    let id = await db.registerUser(ctx.request.body);
    ctx.body = { id:id };
  }
  else
    ctx.throw("Usuário inválido ou inexistente. Passe um usuário válido (email, usuario e senha)", 400);
    
  //return new Promise<void>((resolve, reject) => resolve());
}

async function apiGetAllUsers(ctx: Router.IRouterContext): Promise<void> {
  return new Promise<void>((resolve, reject) => resolve());
}

async function apiGetUsers(ctx: Router.IRouterContext): Promise<void> {
  if(ctx.query.username)
    ctx.body = await db.getUserByUsername(ctx.query.username);
  else
    ctx.body = {result: await db.getUsers()};
}

/**
 * Our routes
 * @type {IRoute[]}
 */
export const apiRoutes: IRoute[] = [
  {
    method: 'post',
    path: '/user',
    action: apiRegisterUser
  },
  {
    method: 'get',
    path: '/user',
    action: apiGetUsers
  },
];