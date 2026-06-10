import { Request, Response } from "express";
import { loginService, registerService, adminLoginService } from "./auth.serivce";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await loginService(email, password);
        res.status(200).json({ success: true, message: "Login successful", data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const result = await registerService(req.body);
        res.status(201).json({ success: true, message: "Registration successful", data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await adminLoginService(email, password);
        res.status(200).json({ success: true, message: "Admin login successful", data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}