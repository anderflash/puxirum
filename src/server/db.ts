import knex = require('./knex');
import { IUser } from './iuser';

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
async function registerUser(user: IUser): Promise<any>{
  console.log(user);
  return User().insert(user, 'id').then(list => list[0]);
}

export = {
  getUserByUsername: getUserByUsername,
  getUsers: getUsers,
  registerUser: registerUser
}