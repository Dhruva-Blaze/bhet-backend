import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) {
        for (const key in req.query) delete (req.query as any)[key];
        Object.assign(req.query, parsed.query);
      }
      if (parsed.params) {
        for (const key in req.params) delete (req.params as any)[key];
        Object.assign(req.params, parsed.params);
      }

      next();
    } catch (error: any) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors || [],
        error: error.message || error
      });
    }
  };
