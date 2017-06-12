import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import { IUser } from './iuser';
import { ILoginInputData } from './ilogin-input-data';
import db = require('./db');

/**
 * Uses the database to do the logic, which we can use in REST, Websocket, etc...
 */
export class PXRController {
  /**
   * We just pass the keys (for security reasons)
   * @param {string} private pubKey  [description]
   * @param {string} private privKey [description]
   */
  constructor(private pubKey: string, 
              private privKey: string) { }

  /**
   * Register a user
   * @param  {IUser}           user [description]
   * @return {Promise<string>}      [description]
   */
  async register(user: IUser): Promise<string> {
    return await db.register(user);
  }

  /**
   * Authenticates a user
   * @param  {ILoginInputData} data email or username + password
   * @return {Promise<string>}      [description]
   */
  async login(data: ILoginInputData): Promise<string> {
    
    // Log in the database
    let id: number = await db.login(data);
    
    // Generate JWT
    return jwt.sign({sub: id}, this.privKey, {algorithm:'RS256', expiresIn:"7d"});
  }
}