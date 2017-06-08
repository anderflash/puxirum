import knex = require('./knex');

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

export = {
  getUserByUsername: getUserByUsername,
  getUsers: getUsers
}