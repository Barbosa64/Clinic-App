export default function Home() {
	return (
		<main className='mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0'>
			<h1>Home</h1>

			<div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
				<div className='flex flex-col items-center justify-center rounded-lg bg-gray-200 p-5'>
					<span className='text-3xl font-semibold text-gray-700'>Total Pacientes</span>
					<span className='text-3xl font-semibold text-gray-700'>20</span>
				</div>
			</div>
		</main>
	);
}
