import React from 'react';
import { doctors } from '../data/doctors';

export default function TeamList() {
	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Equipa Médica</h1>
			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				{doctors.map((doctor, index) => (
					<li key={index} className='bg-white p-4 rounded shadow flex items-center space-x-4'>
						<img src={doctor.imageUrl} alt={doctor.name} className='h-16 w-16 rounded-full' />
						<div>
							<p className='font-semibold'>{doctor.name}</p>
							<p className='text-sm text-gray-500'>{doctor.specialty}</p>
							{doctor.lastSeen && <p className='text-xs text-gray-400'>Última vez visto: {doctor.lastSeen}</p>}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

/* import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'clinic_doctors';

type Doctor = {
  name: string;
  email: string;
  specialty: string;
  imageUrl: string;
  lastSeen: string | null;
};

export default function TeamList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Doctor>({
    name: '',
    email: '',
    specialty: '',
    imageUrl: '',
    lastSeen: null,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setDoctors(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(doctors));
  }, [doctors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.specialty || !formData.imageUrl) {
      alert('Preencha todos os campos');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...doctors];
      updated[editingIndex] = formData;
      setDoctors(updated);
      setEditingIndex(null);
    } else {
      setDoctors([...doctors, formData]);
    }

    setFormData({ name: '', email: '', specialty: '', imageUrl: '', lastSeen: null });
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    setFormData(doctors[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    if (confirm('Deseja remover este médico?')) {
      const updated = [...doctors];
      updated.splice(index, 1);
      setDoctors(updated);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Equipe Médica</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar..."
            className="border p-2 rounded w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              setFormData({ name: '', email: '', specialty: '', imageUrl: '', lastSeen: null });
              setEditingIndex(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancelar' : 'Adicionar Médico'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
          <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="border p-2 rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="specialty" placeholder="Especialidade" value={formData.specialty} onChange={handleChange} className="border p-2 rounded" />
          <input type="url" name="imageUrl" placeholder="URL da Imagem" value={formData.imageUrl} onChange={handleChange} className="border p-2 rounded" />
          <div className="col-span-1 sm:col-span-2 text-right">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              {editingIndex !== null ? 'Atualizar Médico' : 'Salvar Médico'}
            </button>
          </div>
        </form>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor, index) => (
          <li key={index} className="bg-white p-4 rounded shadow flex items-start space-x-4">
            <img src={doctor.imageUrl} alt={doctor.name} className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold text-lg">{doctor.name}</p>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
              {doctor.lastSeen && <p className="text-xs text-gray-400">Última vez visto: {doctor.lastSeen}</p>}
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleEdit(index)} className="text-blue-600 text-sm hover:underline">Editar</button>
                <button onClick={() => handleDelete(index)} className="text-red-600 text-sm hover:underline">Remover</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
*/
