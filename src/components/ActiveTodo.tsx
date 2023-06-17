import { FaPen } from "react-icons/fa";
import { IoMdTimer, IoIosCreate } from "react-icons/io";
import { Todo } from "../App";

type Props = {
	isSelectedTodo: Todo;
	handleModalToggle: React.FC;
	handleUpdateButton: React.FC;
};

export default function ActiveTodo(props: Props) {
	const { isSelectedTodo, handleModalToggle, handleUpdateButton } = props;

	return (
		<main className='relative flex w-6/12 min-w-[550px] flex-col gap-10 bg-slate-300 p-10'>
			{isSelectedTodo.id ? (
				<div className='items-center justify-between'>
					<div>
						<div className='flex flex-row'>
							<h1 className='pr-10 text-4xl font-bold text-slate-700'>
								{isSelectedTodo.title}
							</h1>
							<div
								className='absolute right-10 top-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-200 hover:bg-slate-500'
								onClick={() => handleUpdateButton(isSelectedTodo)}>
								<FaPen />
							</div>
						</div>
						<div className='flex flex-row justify-between'>
							<div className='flex'>
								<div className='flex h-10 w-10 items-center justify-center'>
									<IoMdTimer size='70%' color='#64748b' />
								</div>
								<input
									name='timeLimit'
									value={isSelectedTodo.timeLimit}
									type='datetime-local'
									className='bg-slate-300 p-2'
									disabled
								/>
							</div>
							<div className='flex'>
								<div className='flex h-10 w-10 items-center justify-center'>
									<IoIosCreate size='70%' color='#64748b' />
								</div>
								<input
									type='datetime-local'
									className='bg-slate-300 p-2'
									value={isSelectedTodo.createdAt}
									disabled
								/>
							</div>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}

			<p className='block h-full overflow-scroll whitespace-pre-wrap rounded-lg bg-slate-200 p-3'>
				{isSelectedTodo.description}
			</p>
			<button
				className=' absolute bottom-10 right-10 h-16 w-16 rounded-full bg-green-600 text-4xl text-white shadow-md hover:bg-green-500'
				onClick={handleModalToggle}>
				＋
			</button>
		</main>
	);
}
