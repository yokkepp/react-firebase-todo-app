import { FaTrashAlt } from "react-icons/fa";
import { Todo } from "../App";

type Props = {
	todos: Todo[];
	handleSelectTodo: React.FC;
	isSelectedTodo: Todo;
	handleDeleteModal: React.FC;
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
				<div className='fixed w-3/12 min-w-[270px] bg-slate-700 pt-5'>
					<h1 className='text-center text-3xl font-bold'>Todo List</h1>
					<p className='border-b border-solid border-white pb-5 text-center text-sm'>
						{currentTodos.length === 0
							? `全 ${todos.length} 件:検索結果`
							: `${currentTodos.length} 件 / 全 ${todos.length} 件`}
					</p>
				</div>
				<div className='h-6/12 h-screen snap-end overflow-scroll'>
					<ul className='flex flex-col gap-2 pl-3 pt-28'>
						{currentTodos.length !== 0
							? currentTodos.map((todo: Todo) => {
									return (
										<li
											onClick={() => handleSelectTodo(todo)}
											key={todo.id}
											className={
												isSelectedTodo.id === todo.id
													? "flex items-center justify-between rounded-l-md bg-slate-300 p-5 font-semibold text-slate-700"
													: "mr-2 flex items-center justify-between rounded-md bg-slate-800 p-5 font-semibold text-slate-400"
											}>
											<div className='flex'>
												<input type='checkbox' name='done' />
												<h2 className='mx-2 text-lg'>{todo.title}</h2>
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
							  })
							: todos.map((todo: Todo) => {
									return (
										<li
											onClick={() => handleSelectTodo(todo)}
											key={todo.id}
											className={
												isSelectedTodo.id === todo.id
													? "flex items-center justify-between rounded-l-md bg-slate-300 p-5 font-semibold text-slate-700"
													: "mr-2 flex items-center justify-between rounded-md bg-slate-800 p-5 font-semibold text-slate-400"
											}>
											<div className='flex'>
												<h2 className='mx-2 text-lg'>
													{todo.title}
													{/* TODO:チェックボックスではなく、svg画像でチェックボックスを表現したい */}
												</h2>
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
