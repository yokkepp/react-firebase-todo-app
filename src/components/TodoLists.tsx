import { FaTrashAlt } from "react-icons/fa";
import { Todo } from "../App";

type Props = {
	todos: Todo[];
	handleSelectTodo: (todo: Todo) => void;
	isSelectedTodo: Todo;
	handleDeleteModal: () => void;
	currentTodos: Todo[];
};

function TodoLists(props: Props) {
	const {
		todos,
		handleSelectTodo,
		isSelectedTodo,
		handleDeleteModal,
		currentTodos,
	} = props;

	return (
		<aside className='w-3/12  min-w-[270px] bg-slate-700'>
			<div className='flex flex-col text-white'>
				<div className='fixed z-10 w-3/12 min-w-[270px] bg-slate-700 pt-5'>
					<h1 className='text-center text-3xl font-bold'>My Note</h1>
					<p className='border-b border-solid border-white pb-5 text-center text-sm'>
						{currentTodos.length === 0
							? `該当なし / 全 ${todos.length} 件`
							: `${currentTodos.length} 件 / 全 ${todos.length} 件`}
					</p>
				</div>
				<div className='h-6/12 h-screen snap-end overflow-scroll'>
					<ul className='flex flex-col gap-2 pl-3 pt-28'>
						{currentTodos.map((todo: Todo) => {
							const createdAtDate = new Date(
								todo.createdAt
							).toLocaleDateString();
							return (
								<li
									onClick={() => handleSelectTodo(todo)}
									key={todo.id}
									className={
										isSelectedTodo.id === todo.id
											? "flex items-center justify-between rounded-l-md bg-slate-300 p-5 font-semibold text-slate-700"
											: "mr-2 flex items-center justify-between rounded-md bg-slate-800 p-5 font-semibold text-slate-400"
									}>
									<div>
										<h2 className='mx-2 text-lg'>{todo.title}</h2>
										<sub className='mx-2 text-xs'>作成日：{createdAtDate}</sub>
									</div>
									<div
										onClick={handleDeleteModal}
										className={
											isSelectedTodo.id === todo.id
												? "cursor-pointer pr-2"
												: "cursor-pointer"
										}>
										<FaTrashAlt />
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</aside>
	);
}

export default TodoLists;
