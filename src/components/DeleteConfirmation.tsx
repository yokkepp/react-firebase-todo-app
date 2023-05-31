export default function DeleteConfirmation(props: any) {
	const { isDeleteModalOpen, doDelete } = props;

	if (isDeleteModalOpen) {
		return (
			<div className='fixed z-50 flex h-screen w-full animate-fade-in items-center justify-center bg-black bg-opacity-60 transition-all'>
				<div className='flex w-1/2 flex-col items-center justify-center rounded-2xl bg-slate-200 p-12 shadow-lg'>
					<div className='flex w-full flex-col items-center gap-5'>
						<h1 className='  items-center  justify-center text-xl font-bold text-gray-600'>
							本当に削除しますか？
						</h1>
						<div className='flex w-full  justify-center gap-5'>
							<button className='w-1/3 rounded bg-slate-500 py-3 text-white'>
								キャンセル
							</button>
							<button
								onClick={doDelete}
								className='w-1/3 rounded bg-red-500 py-3 text-white'>
								削除する
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
