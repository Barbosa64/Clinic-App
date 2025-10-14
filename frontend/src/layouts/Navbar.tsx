import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
	const { user, role, loading, imageUrl } = useAuth();
	const auth = getAuth();
	const navigate = useNavigate();
	const location = useLocation();

	if (loading) {
		console.log('A carregar autenticação...');
		return null;
	}

	const rawNavigation = [
		{ name: 'Dashboard', href: '/dashboard', roles: ['admin', 'doctor', 'patient'] },
		{ name: 'Médicos', href: '/medicos', roles: ['admin'] },
		{ name: 'Pacientes', href: '/pacientes', roles: ['admin', 'doctor'] },
		{ name: 'Consulta Admin', href: '/consulta/admin', roles: ['admin'] },
		{ name: 'Agenda', href: '/agenda', roles: ['admin', 'doctor'] },
		{
			name: 'Marcar Consulta',
			href: user ? `/marcar-consulta/${user.uid}` : '/marcar-consulta',
			roles: ['patient'],
		},
	];

	const navigation = rawNavigation
		.filter(item => role && item.roles.includes(role))
		.map(item => ({
			...item,
			current: location.pathname === item.href || location.pathname.startsWith(item.href),
		}));

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			navigate('/login');
		} catch (error) {
			console.error('Erro ao sair:', error);
		}
	};

	return (
		<Disclosure as='nav' className='bg-teal-600'>
			<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
				<div className='relative flex h-16 items-center justify-between'>
					<div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
						<DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset'>
							<Bars3Icon aria-hidden='true' className='block size-6 group-data-open:hidden' />
							<XMarkIcon aria-hidden='true' className='hidden size-6 group-data-open:block' />
						</DisclosureButton>
					</div>

					<div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
						<div className='flex shrink-0 items-center'>
							<img className='h-8 w-auto' src={logo} alt='Logo' />
						</div>
						<div className='hidden sm:ml-6 sm:block'>
							<div className='flex space-x-4'>
								{navigation.map(item => (
									<Link
										key={item.name}
										to={item.href}
										className={classNames(item.current ? 'bg-teal-900 text-white' : 'text-gray-100 hover:bg-teal-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}
									>
										{item.name}
									</Link>
								))}
							</div>
						</div>
					</div>

					<div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
						<Menu as='div' className='relative ml-3'>
							<MenuButton className='relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden'>
								<img className='size-8 rounded-full' src={imageUrl || 'https://placehold.co/100x100?text=Avatar'} alt='Avatar do usuário' />
							</MenuButton>
							<MenuItems className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden'>
								<MenuItem>
									{({ active }) => (
										<Link to='/configuracoes' className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
											Configurações
										</Link>
									)}
								</MenuItem>
								<MenuItem>
									{({ active }) => (
										<button onClick={handleSignOut} className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700')}>
											Terminar Sessão
										</button>
									)}
								</MenuItem>
							</MenuItems>
						</Menu>
					</div>
				</div>
			</div>

			<DisclosurePanel className='sm:hidden'>
				<div className='space-y-1 px-2 pt-2 pb-3'>
					{navigation.map(item => (
						<Link
							key={item.name}
							to={item.href}
							className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')}
						>
							{item.name}
						</Link>
					))}
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
};

export default Navbar;
