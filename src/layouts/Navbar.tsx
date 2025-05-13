import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
	const auth = getAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const navigation = [
		{ name: 'Dashboard', href: '/', current: location.pathname === '/' },
		{ name: 'Pacientes', href: '/pacientes', current: location.pathname === '/pacientes' },
		{ name: 'Marcar consulta', href: '/marcar-consulta', current: location.pathname === '/marcar-consulta' },
		{ name: 'Calendário', href: '/calendario', current: location.pathname === '/calendario' },
	];

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			navigate('/login');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	return (
		<Disclosure as='nav' className='bg-gray-800'>
			<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
				<div className='relative flex h-16 items-center justify-between'>
					<div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
						<DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset'>
							<Bars3Icon aria-hidden='true' className='block size-6 group-data-open:hidden' />
							<XMarkIcon aria-hidden='true' className='hidden size-6 group-data-open:block' />
						</DisclosureButton>
					</div>

					<div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
						<div className='flex shrink-0 items-center'>
							<img className='h-8 w-auto' src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500' alt='Logo' />
						</div>
						<div className='hidden sm:ml-6 sm:block'>
							<div className='flex space-x-4'>
								{navigation.map(item => (
									<Link
										key={item.name}
										to={item.href}
										className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}
									>
										{item.name}
									</Link>
								))}
							</div>
						</div>
					</div>

					<div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
						<button
							type='button'
							className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden'
						>
							<BellIcon className='size-6' aria-hidden='true' />
						</button>

						<Menu as='div' className='relative ml-3'>
							<MenuButton className='relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden'>
								<img
									className='size-8 rounded-full'
									src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
									alt=''
								/>
							</MenuButton>
							<MenuItems className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden'>
								<MenuItem>
									{({ active }) => (
										<a href='#' className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
											Perfil
										</a>
									)}
								</MenuItem>
								<MenuItem>
									{({ active }) => (
										<a href='#' className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
											Configurações
										</a>
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
