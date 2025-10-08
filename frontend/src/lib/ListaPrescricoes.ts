import { Timestamp } from "firebase/firestore";

export interface ListaPrescricao {
	id: string;
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes?: string;
	criadoEm?: Timestamp;
}
