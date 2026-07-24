import { deleteChatParamsSchema } from "@repo/shared";
import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateParams } from "../middlewares/validation.middleware";

export const chatRouter: Router = Router();

chatRouter.use(authMiddleware);

chatRouter.get("/suggestions", chatController.getPromptSuggestions);

chatRouter.get("/", chatController.getChats);

chatRouter.post(
  "/:id/messages",
  validateParams(deleteChatParamsSchema),
  chatController.streamMessage
);

chatRouter.get(
  "/:id",
  validateParams(deleteChatParamsSchema),
  chatController.getChatThread
);

chatRouter.delete(
  "/:id",
  validateParams(deleteChatParamsSchema),
  chatController.deleteChat
);
