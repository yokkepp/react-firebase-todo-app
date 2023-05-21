export default function SearchCondition() {
	return (
		<aside className='w-3/12 bg-slate-700 p-3 text-slate-600'>
			<form action=''>
				<h3 className='p-5 text-center text-white'>検索条件</h3>
				<div>
					<div className='my-3 rounded bg-slate-200 p-3'>
						<h4 className='text-sm  font-bold'>キーワード</h4>
						<div className='flex flex-col'>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								type='text'
							/>
							<p className='ml-auto text-xs'>を含む</p>
						</div>
					</div>
					<div className='my-3 rounded bg-slate-200 p-3'>
						<h4 className='text-sm  font-bold'>作成日</h4>
						<div className='flex flex-col'>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								type='date'
							/>
							<p className='ml-auto text-xs'>から</p>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								type='date'
							/>
							<p className='ml-auto text-xs'>まで</p>
						</div>
					</div>
					<div className='my-3 rounded bg-slate-200 p-3'>
						<h4 className='text-sm  font-bold'>期限</h4>
						<div className='flex flex-col'>
							<input
								className='mx-auto my-3 w-full rounded-md p-1 pl-3'
								type='date'
							/>
							<p className='ml-auto text-xs'>から</p>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								type='date'
							/>
							<p className='ml-auto text-xs'>まで</p>
						</div>
					</div>
					<button className='w-full rounded bg-green-600 py-5 text-white shadow-md hover:bg-green-500'>
						検索
					</button>
				</div>
			</form>
		</aside>
	);
}
