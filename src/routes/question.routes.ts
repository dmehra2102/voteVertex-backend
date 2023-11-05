import QuestionController from "@/controllers/question.controller";
import { Routes } from "@/interfaces/routes.interface";
import { ensureAdminAuthorised } from "@/middlewares/authorization.middleware";
import ensureAuthenticated from "@/middlewares/ensureAuthenticated.middleware";
import { Router } from "express";

class QuestionRoute implements Routes {
  public path = "/question";
  public router = Router();
  public questionController = new QuestionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, ensureAuthenticated, ensureAdminAuthorised, this.questionController.getAllQuestions);
    this.router.get(`${this.path}/:questionId`, ensureAuthenticated, ensureAdminAuthorised, this.questionController.getQuestionById);
    this.router.post(`${this.path}/create`, ensureAuthenticated, ensureAdminAuthorised, this.questionController.createQuestion);
    this.router.patch(
      `${this.path}/update/:questionId`,
      ensureAuthenticated,
      ensureAdminAuthorised,
      this.questionController.updateQuestionById
    );
    this.router.delete(
      `${this.path}/delete/:questionId`,
      ensureAuthenticated,
      ensureAdminAuthorised,
      this.questionController.deleteQuestionById
    );
  }
}

export default QuestionRoute;
