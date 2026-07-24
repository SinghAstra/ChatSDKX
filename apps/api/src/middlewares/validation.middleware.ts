import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../errors/api-errors.js";

export const validateBody = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const primaryMessage =
          error.issues[0]?.message ||
          "Please make sure all fields are filled out correctly.";
        return next(new ValidationError(primaryMessage));
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.query);
      for (const key in req.query) {
        delete req.query[key];
      }
      Object.assign(req.query, parsed);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const primaryMessage =
          error.issues[0]?.message ||
          "We couldn't process this request. Please refresh and try again.";
        return next(new ValidationError(primaryMessage));
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.params);
      for (const key in req.params) {
        delete req.params[key];
      }
      Object.assign(req.params, parsed);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const primaryMessage =
          error.issues[0]?.message ||
          "The link you followed seems to be invalid or broken.";
        return next(new ValidationError(primaryMessage));
      }
      next(error);
    }
  };
};
