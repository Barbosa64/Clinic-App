export function calcularIdade(birthTimestamp: any): number {
	if (!birthTimestamp) return 0;

	const birthDate = birthTimestamp.toDate ? birthTimestamp.toDate() : new Date(birthTimestamp);

	const hoje = new Date();
	let idade = hoje.getFullYear() - birthDate.getFullYear();

	const mes = hoje.getMonth() - birthDate.getMonth();
	const dia = hoje.getDate() - birthDate.getDate();

	if (mes < 0 || (mes === 0 && dia < 0)) {
		idade--;
	}

	return idade;
}
