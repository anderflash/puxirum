// Update with your config settings.

export = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.PUXIRUM_PG_DATABASE_DEV,
      user: process.env.PUXIRUM_PG_USER_DEV,
      password: process.env.PUXIRUM_PG_PASSWORD_DEV
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/dev'
    }
  },
  test: {
    client: "postgresql",
    connection: {
      database: process.env.PUXIRUM_PG_DATABASE_TEST,
      user: process.env.PUXIRUM_PG_USER_TEST,
      password: process.env.PUXIRUM_PG_PASSWORD_TEST
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  },
  production: {
    client: "postgresql",
    connection: {
      database: process.env.PUXIRUM_PG_DATABASE_PROD,
      user: process.env.PUXIRUM_PG_USER_PROD,
      password: process.env.PUXIRUM_PG_PASSWORD_PROD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/production'
    }
  }

};
