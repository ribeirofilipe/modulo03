import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import authMiddleware from './app/middlewares/auth';
import isAdmin from './app/middlewares/admin';

const routes = new Router();

routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.get('/plan/:id', PlanController.show);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.use(isAdmin);

routes.get('/users', UserController.index);

routes.post('/students', StudentController.store);
routes.put('/student/:id', StudentController.update);
routes.get('/students', StudentController.index);

routes.post('/registrations', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.put('/help-orders/:id/answer', HelpOrderController.update);
routes.get('/help-orders', HelpOrderController.show);

export default routes;
