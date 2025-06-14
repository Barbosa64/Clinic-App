/*export type Patient = {
	id: string;
	name: string;
	gender: string;
	role: string;
	phone: string;
	insurance?: string;
	insuranceNumber?: string;
	birthDate: string;
	imageUrl?: string;
};*/

export type Patient = {
	id: string;
	UID: string;
	role: string;
	birthDate: string;
	gender: string;
	phone: string;
	name: string;
	email: string;
	insurance: string;
	insuranceNumber: string;
	imageUrl?: string;
} 
