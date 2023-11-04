import AdminController from "@/controllers/admin.controller";
import { Routes } from "@/interfaces/routes.interface";
import { ensureAdminAuthorised } from "@/middlewares/authorization.middleware";
import ensureAuthenticated from "@/middlewares/ensureAuthenticated.middleware";
import { Router } from "express";

class AdminRoute implements Routes {
  public path = "/admin";
  public router = Router();
  public adminConroller = new AdminController();

  constructor(){
this.initializeRoutes();
  }

  private initializeRoutes(){
    this.router.get(`${this.path}/getAllUsers`, ensureAuthenticated,ensureAdminAuthorised, this.adminConroller.getAllUsers);
  }
}

export default AdminRoute;
