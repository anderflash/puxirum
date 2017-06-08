import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as serve         from 'koa-static';
import db = require('./db');
import { apiRoutes } from './routes';

// Create an Koa server and defining routes
const app: Koa = new Koa();
const apiRouter: Router = new Router({prefix: '/api'});
apiRoutes.forEach(route => apiRouter[route.method](route.path, route.action));

// Attaching our middlewares
app.use(bodyParser());
app.use(apiRouter.routes());
app.use(serve('dist/client'));

// Run our server
app.listen(3000);
//app.address = ()=>3000;
console.log("Koa application is up and running on port 3000");
export = app;