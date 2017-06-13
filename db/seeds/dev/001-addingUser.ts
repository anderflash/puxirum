import * as Knex from "knex";

import * as Promise from 'bluebird';
global.Promise = require('bluebird');

exports.seed = function (knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("user").del()
        .then(function () {
            // Inserts seed entries
            return knex("user").insert([
                { id: 1, username: "anderson", email: "anderson@email.com", password: "11111111" },
                { id: 2, username: "carlos", email: "carlos@email.com", password: "11111111" },
                { id: 3, username: "moreira", email: "moreira@email.com", password: "11111111"},
                { id: 4, username: "tavares", email: "tavares@email.com", password: "11111111"} 
            ]);
        });
};
