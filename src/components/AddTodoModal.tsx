type Props = {
	isModalOpen: boolean;
	handleRegisterSubmit: any;
	handleChange: any;
	formData: any;
	inputEl: any;
	isEditing: boolean;
	handleUpdateSubmit: any;
	isSelectedTodo: any;
};

export default function AddTodoModal(props: Props) {
	const {
		isModalOpen,
		handleRegisterSubmit,
		handleChange,
		formData,
		inputEl,
		isEditing,
		handleUpdateSubmit,
		isSelectedTodo,
	} = props;
	return (
		<div
			className={
				isModalOpen
					? "fixed z-50 flex h-screen w-full animate-fade-in items-center justify-center bg-black bg-opacity-60 transition-all"
					: "hidden"
			}>
			<form
				className=' container relative flex h-3/4 w-3/4 flex-col gap-5 rounded-2xl bg-slate-200 p-12 shadow-lg'
				onSubmit={isEditing ? handleUpdateSubmit : handleRegisterSubmit}>
				<p>isSelectedTodo.id:{isSelectedTodo.id}</p>
				<p>isSelectedTodo.title:{isSelectedTodo.title}</p>
				<p>isEditing:{isEditing ? "true" : "false"}</p>
				<input
					type='text'
					name='title'
					onChange={handleChange}
					value={formData.title}
					ref={inputEl}
					className='p-5 text-3xl font-semibold'
					placeholder='件名を入力してください'></input>

				<div className='flex flex-row justify-end gap-5'>
					<p>作成日：2023年10月1日</p>
					<input
						name='timeLimit'
						value={formData.timeLimit}
						type='date'
						onChange={handleChange}
					/>
				</div>
				<textarea
					className='h-1/2 resize-none p-3'
					name='description'
					value={formData.description}
					placeholder='詳細を入力してください'
					onChange={handleChange}></textarea>
				<label htmlFor='achievement'>
					達成率：
					<input
						type='number'
						name='achievement'
						value={formData.progress}
						onChange={handleChange}
					/>{" "}
					%
				</label>
				{isEditing ? (
					<button className='absolute bottom-10 right-10 w-auto rounded bg-slate-500 px-12 py-4 text-white shadow-lg hover:bg-slate-400'>
						更新
					</button>
				) : (
					<button className='absolute bottom-10 right-10 w-auto rounded bg-green-500 px-12 py-4 text-white shadow-lg hover:bg-green-400'>
						登録
					</button>
				)}
			</form>
		</div>
	);
}
