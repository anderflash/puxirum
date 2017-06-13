import { IUser }            from './iuser';
import { IProject }         from './iproject';
import { ILoginInputData }  from './ilogin-input-data';
import knex = require('./knex');

export class PXRDatabase {
  constructor() {

  }

  /**
   * Registering a user in a database
   * @param  {IUser}           user details of the user
   * @return {Promise<number>}      the ID of the new user
   */
  async register(user: IUser): Promise<number> {
    let result:number[] = await knex("user").insert(user, 'id');
    return result[0];
  }

  /**
   * Authenticate the user (database part) by email or username. 
   * Update the timestamps
   * @param  {ILoginInputData} data [description]
   * @return {Promise<any>}         [description]
   */
  async login(data: ILoginInputData): Promise<number> {
    if(!(data && data.password && (data.email || data.username))){
      throw "Erro de login";
    }
    let result = await knex("user")
      .update({logged_at: new Date()})
      .where(data)
      .returning('id');
    if(result.length == 1){
      return result[0];
    } else {
      throw "Usuário inexistente";
    }
  }

  /**
   * List all projects
   * @param  {number}         userId [description]
   * @return {Promise<any[]>}        [description]
   */
  async getProjects(userId: number): Promise<any[]> {
    return await knex("project").select().where({owner: userId});
  }

  /**
   * Add a project
   * @param  {IProject}        project [description]
   * @return {Promise<number>}         [description]
   */
  async addProject(project: IProject): Promise<number> {
    return await knex("project").insert(project, "id").then(list => list[0]);
  }
}