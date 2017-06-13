import * as fs              from 'fs';
import * as Koa             from 'koa';
import * as bodyParser      from 'koa-bodyparser';
import * as serve           from 'koa-static';
import * as Router          from 'koa-router';
import * as koaJwt          from 'koa-jwt';

import { PXRDatabase }      from './pxr-database';
import { PXRKoaController } from './pxr-koa-controller';
import { PXRController }    from './pxr-controller';

// Read keys
// ----------------------------------------------------------------------------
let pubKey           = fs.readFileSync('pubkey.pem');
let privKey          = fs.readFileSync('privkey.pem');

// Create a Koa Database and Controller for Puxirum
// ----------------------------------------------------------------------------
let pxrDatabase      = new PXRDatabase();
let pxrController    = new PXRController(pubKey, privKey, pxrDatabase);
let pxrKoaController = new PXRKoaController(pxrController);

// Create an Koa server and defining routes
// ----------------------------------------------------------------------------
const app: Koa       = new Koa();

// Our RESTful API for ...
// ----------------------------------------------------------------------------
const apiUnprotectedRouter: Router = new Router({prefix: '/api'});
const apiProtectedRouter:   Router = new Router({prefix: '/api'});

// ... unprotected routes and ...
apiUnprotectedRouter.post('/users'   , async ctx => pxrKoaController.register(ctx));
apiUnprotectedRouter.post('/login'   , async ctx => pxrKoaController.login(ctx));

// ... protected routes.
apiProtectedRouter.get   ('/projects', async ctx => pxrKoaController.getProjects(ctx));
apiProtectedRouter.post  ('/projects', async ctx => pxrKoaController.addProject(ctx));

// Attaching our middlewares
// ----------------------------------------------------------------------------
app.use(bodyParser());
app.use(apiUnprotectedRouter.routes());
app.use(serve('dist/client'));
app.use(koaJwt({ secret: pubKey }));
app.use(apiProtectedRouter.routes());

// Run our server
// ----------------------------------------------------------------------------
app.listen(3000);
console.log("Koa application is up and running on port 3000");