import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	console.log('A iniciar o processo de seeding...');

	const adminEmail = process.env.ADMIN_EMAIL || 'admin@clinic.com';
	
	const adminPassword = process.env.ADMIN_PASSWORD;

	
	if (!adminPassword) {
		throw new Error('A variável de ambiente ADMIN_PASSWORD precisa de ser definida para o seeding.');
	}

	const admin = await prisma.user.upsert({
		where: { email: adminEmail },
		update: {},
		create: {
			name: 'Administrador',
			email: adminEmail,
			password: await bcrypt.hash(adminPassword, 10),
			role: Role.ADMIN,
		},
	});

	console.log(`✅ Utilizador Admin ${admin.email} foi criado com sucesso.`);
}

main()
	.catch(e => {
		console.error('❌ Erro durante o seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
