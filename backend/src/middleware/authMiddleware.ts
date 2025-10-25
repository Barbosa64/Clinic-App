import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
	userId: string;
	role: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Não autorizado, token não fornecido ou mal formatado.' });
	}
	try {
		const token = authHeader.split(' ')[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
		req.user = {
			userId: decoded.userId,
			role: decoded.role,
		};
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Não autorizado, o token falhou a verificação.' });
	}
};

// Middleware para verificar papéis específicos

export const authorize =
	(...roles: string[]) =>
	(req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Não autorizado, papel insuficiente.' });
		}
		next();
	};
