type Props = {
	isSelectedTodo: any;
	handleModalToggle: any;
};

export default function ActiveTodo(props: Props) {
	const { isSelectedTodo, handleModalToggle } = props;

	return (
		<main className='relative flex w-6/12 flex-col gap-10 bg-slate-300 p-10'>
			<h1 className='text-4xl font-bold text-slate-700'>
				{isSelectedTodo.title}
			</h1>
			<div className='flex justify-end gap-10'>
				<p>作成日：2023年10月1日</p>
				<p>期限：{isSelectedTodo.timeLimit}</p>
			</div>
			<p>{isSelectedTodo.description}</p>
			<button
				className=' absolute bottom-10 right-10 h-16 w-16 rounded-full bg-green-600 text-4xl text-white shadow-md hover:bg-green-500'
				onClick={handleModalToggle}>
				＋
			</button>
		</main>
	);
}
