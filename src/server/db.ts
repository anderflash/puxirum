import * as jwt             from 'koa-jwt';

import { IUser }            from './iuser';
import { ILoginInputData }  from './ilogin-input-data';
import knex = require('./knex');

// Tables
function User(){
  return knex('user');
}

/**
 * Get specific user by username
 * @param  {string}       username [description]
 * @return {Promise<any>}          [description]
 */
async function getUserByUsername(username: string): Promise<any>{
  return User().select("id", "email").where({username: username}).then(list => list[0]);
}

/**
 * Get all users
 * @return {Promise<any>} [description]
 */
async function getUsers(): Promise<any>{
  return User().select();
}

/**
 * Register a user
 * @param  {IUser}        user [description]
 * @return {Promise<any>}      [description]
 */
async function register(user: IUser): Promise<any>{
  console.log(user);
  return User().insert(user, 'id').then(list => list[0]);
}

/**
 * Authenticating a user
 * @param  {ILoginData}   data [description]
 * @return {Promise<any>}      [description]
 */
async function login(data: ILoginInputData): Promise<any> {
  if(!data || !data.email || !data.username){
    throw "Erro de login";
  }
  return User()
    .update({logged_at: new Date()})
    .where(data)
    .returning('id').then(list => list[0]);
}

export = {
  getUserByUsername: getUserByUsername,
  getUsers: getUsers,
  register: register,
  login: login
}