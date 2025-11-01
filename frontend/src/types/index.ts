export interface Receita {
	id: string;
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes: string;
	criadoEm: string; // A API vai devolver a data como uma string ISO
	doctor: {
		name: string;
	};
}
export interface Appointment {
	id: string;
	date: string;
	specialty: string;
	doctor: {
		name: string;
	};
	patient: {
		name: string;
	};
}
