import * as fs              from 'fs';
import * as jwt             from 'jsonwebtoken';

import { IUser }            from './iuser';
import { IProject }         from './iproject';
import { ILoginInputData }  from './ilogin-input-data';
import { PXRDatabase }      from './pxr-database';

/**
 * Uses the database to do the logic, which we can use in REST, Websocket, etc...
 */
export class PXRController {
  /**
   * We just pass the keys (for security reasons)
   * @param {string} private pubKey  [description]
   * @param {string} private privKey [description]
   */
  constructor(private pubKey: Buffer, 
              private privKey: Buffer,
              private db: PXRDatabase) { }

  /**
   * Register a user
   * @param  {IUser}           user [description]
   * @return {Promise<string>}      [description]
   */
  async register(user: IUser): Promise<number> {
    return await this.db.register(user);
  }

  /**
   * Authenticates a user
   * @param  {ILoginInputData} data email or username + password
   * @return {Promise<string>}      [description]
   */
  async login(data: ILoginInputData): Promise<string> {
    // Log in the database
    let id: number = await this.db.login(data);
    
    // Generate JWT
    let payload = {sub: id};
    return jwt.sign(payload, this.privKey, {algorithm:'RS256', expiresIn:"7d"});
  }

  /**
   * [getProjects description]
   * @param  {string}         token the token which contains the ID of the logged user
   * @return {Promise<any[]>}       The list of projects
   */
  async getProjects(token: string): Promise<any[]> {
    return await this.db.getProjects(this.getId(this.getPayload(token)));
  }

  async addProject(token: string, project: IProject) {
    project.owner = this.getId(this.getPayload(token));
    return await this.db.addProject(project);
  }

  /**
   * Get ID from token
   * @param  {string} token [description]
   * @return {any}          [description]
   */
  getId(payload: any): any{
    return payload.sub;
  }

  /**
   * Get token
   * @param  {string} token [description]
   * @return {any}          [description]
   */
  getPayload(token: string): any{
    return jwt.verify(token, this.pubKey);
  }
}