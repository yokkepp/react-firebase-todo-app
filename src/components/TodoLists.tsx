type Props = {
	todos: any;
	handleSelectTodo: any;
	isSelectedTodo: any;
};

function TodoLists(props: Props) {
	return (
		<aside className='w-3/12 bg-slate-700 text-white'>
			<div className='flex flex-col pt-5'>
				<h1 className='text-center text-3xl font-bold'>Todo List</h1>
				<p className='border-b border-solid border-white pb-5 text-center text-sm'>
					検索結果：0 件
				</p>
				<ul className='flex flex-col gap-2 pl-3 pt-3'>
					{props.todos.map((todo) => {
						return (
							<li
								onClick={() => props.handleSelectTodo(todo)}
								key={todo.id}
								className={
									props.isSelectedTodo.id === todo.id
										? "flex items-center rounded-l-md bg-slate-300 p-5 font-semibold text-slate-700"
										: "mr-2 flex items-center rounded-md bg-slate-800 p-5 font-semibold text-slate-400"
								}>
								<input type='checkbox' name='done' />
								<h2 className='ml-2 text-lg'>{todo.title}</h2>
							</li>
						);
					})}
				</ul>
			</div>
		</aside>
	);
}

export default TodoLists;
