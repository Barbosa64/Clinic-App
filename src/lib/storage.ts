// src/lib/storage.ts
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const storage = getStorage();

export async function uploadLabResult(userId: string, file: File): Promise<string> {
	
	const storageRef = ref(storage, `lab_results/${userId}/${file.name}`);

	
	await uploadBytes(storageRef, file);

	
	const url = await getDownloadURL(storageRef);

	return url;
}

export async function deleteLabResult(userId: string, fileName: string): Promise<void> {
	const storageRef = ref(storage, `lab_results/${userId}/${fileName}`);
	await deleteObject(storageRef);
}
