import express from "express";
import userController from "../controller/user-controller.js";
import contactController12 from "../controller/contact-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User api
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// Contact Api
userRouter.post("/api/contacts", contactController12.create);
userRouter.get("/api/contacts/:contactId", contactController12.get);
userRouter.put("/api/contacts/:contactId", contactController12.update);
userRouter.delete("/api/contacts/:contactId", contactController12.remove);
userRouter.get("/api/contacts/", contactController12.search);
export { userRouter };