import { Link } from 'react-router';

export default function Header({ user }) {
	return (
		<header className='bg-white shadow-md px-6 py-4 flex justify-between items-center'>
			<Link to='/' className='text-2xl font-bold text-blue-600'>
				My Clinic
			</Link>

			<nav className='flex items-center space-x-4'>
				{user ? (
					<>
						<span className='text-gray-700'>Olá, {user.nome}</span>
						<Link to='/dashboard' className='text-blue-600 hover:underline'>
							Dashboard
						</Link>
						<button
							className='bg-red-500 text-white px-3 py-1 rounded'
							onClick={() => {
								/* logout */
							}}
						>
							Sair
						</button>
					</>
				) : (
					<>
						<Link to='/login' className='text-blue-600 hover:underline'>
							Login
						</Link>
						<Link to='/cadastro' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
							Registar
						</Link>
					</>
				)}
			</nav>
		</header>
	);
}
