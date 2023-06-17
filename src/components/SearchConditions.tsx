import { Conditions } from "../App";

type Props = {
	handleChangeSearchConditions: React.FC;
	handleSearchConditionsSubmit: React.FC;
	handleResetConditions: React.FC;
	searchConditions: Conditions;
};

export default function SearchCondition(props: Props) {
	const {
		handleChangeSearchConditions,
		handleSearchConditionsSubmit,
		handleResetConditions,
		searchConditions,
	} = props;
	return (
		<aside className='w-3/12 min-w-[270px] bg-slate-700 p-3 text-slate-600'>
			<form onSubmit={handleSearchConditionsSubmit}>
				<h3 className='p-5 text-center text-white'>検索条件</h3>
				<div>
					<div className='my-3 rounded bg-slate-200 p-3'>
						<h4 className='text-sm  font-bold'>キーワードで検索（複数可）</h4>
						<div className='flex flex-col'>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								name='keyWord'
								type='text'
								onChange={handleChangeSearchConditions}
								value={searchConditions.keyWord}
							/>
							<p className='ml-auto text-xs'>を含む</p>
						</div>
					</div>
					<div className='my-3 rounded bg-slate-200 p-3'>
						<h4 className='text-sm  font-bold'>作成日</h4>
						<div className='flex flex-col'>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								name='createdAtStart'
								type='date'
								onChange={handleChangeSearchConditions}
								value={searchConditions.createdAtStart}
							/>
							<p className='ml-auto text-xs'>から</p>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								name='createdAtEnd'
								type='date'
								onChange={handleChangeSearchConditions}
								value={searchConditions.createdAtEnd}
							/>
							<p className='ml-auto text-xs'>まで</p>
						</div>
					</div>
					<div className='my-3 rounded bg-slate-200 p-3'>
						<h4 className='text-sm  font-bold'>期限</h4>
						<div className='flex flex-col'>
							<input
								className='mx-auto my-3 w-full rounded-md p-1 pl-3'
								name='timeLimitStart'
								type='date'
								onChange={handleChangeSearchConditions}
								value={searchConditions.timeLimitStart}
							/>
							<p className='ml-auto text-xs'>から</p>
							<input
								className='m-3 mx-auto w-full rounded-md p-1 pl-3'
								name='timeLimitEnd'
								type='date'
								onChange={handleChangeSearchConditions}
								value={searchConditions.timeLimitEnd}
							/>
							<p className='ml-auto text-xs'>まで</p>
						</div>
					</div>
					<button className='w-full rounded bg-green-600 py-5 text-white shadow-md hover:bg-green-500'>
						検索
					</button>
					<button
						className='mt-3 w-full rounded bg-slate-600 py-5 text-white shadow-md hover:bg-slate-500'
						onClick={handleResetConditions}>
						検索条件リセット
					</button>
				</div>
			</form>
		</aside>
	);
}
