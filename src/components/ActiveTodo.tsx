import { FaPen } from "react-icons/fa";

type Props = {
	isSelectedTodo: any;
	handleModalToggle: any;
	handleUpdateButton: any;
};

export default function ActiveTodo(props: Props) {
	const { isSelectedTodo, handleModalToggle, handleUpdateButton } = props;

	return (
		<main className='relative flex w-6/12 flex-col gap-10 bg-slate-300 p-10'>
			<div className=' flex items-center justify-between'>
				<h1 className='text-4xl font-bold text-slate-700'>
					{isSelectedTodo.title}
				</h1>
				{isSelectedTodo.id ? (
					<div
						className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-200 hover:bg-slate-500'
						onClick={() => handleUpdateButton(isSelectedTodo)}>
						<FaPen />
					</div>
				) : (
					<></>
				)}
			</div>
			<div className='flex justify-end gap-10'></div>
			<p className={"whitespace-pre-wrap"}>{isSelectedTodo.description}</p>
			<button
				className=' absolute bottom-10 right-10 h-16 w-16 rounded-full bg-green-600 text-4xl text-white shadow-md hover:bg-green-500'
				onClick={handleModalToggle}>
				＋
			</button>
		</main>
	);
}
