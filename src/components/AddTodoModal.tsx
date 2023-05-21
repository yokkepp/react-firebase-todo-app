export default function AddTodoModal(props) {
	return (
		<div
			className={
				props.isModalOpen
					? "fixed z-50 flex h-screen w-full animate-fade-in items-center justify-center bg-black bg-opacity-60 transition-all"
					: "hidden"
			}>
			<form
				className=' container relative flex h-3/4 w-3/4 flex-col gap-5 rounded-2xl bg-slate-200 p-12 shadow-lg'
				onSubmit={props.handleRegisterSubmit}>
				<input
					type='text'
					name='title'
					onChange={props.handleChange}
					value={props.formData.title}
					ref={props.inputEl}
					className='p-5 text-3xl font-semibold'
					placeholder='件名を入力してください'></input>

				<div className='flex flex-row justify-end gap-5'>
					<p>作成日：2023年10月1日</p>
					<input
						name='timeLimit'
						value={props.formData.timeLimit}
						type='date'
						onChange={props.handleChange}
					/>
				</div>
				<textarea
					className='resize-none p-3'
					name='description'
					value={props.formData.description}
					rows='10'
					placeholder='詳細を入力してください'
					onChange={props.handleChange}></textarea>
				<label htmlFor='achievement'>
					達成率：
					<input
						type='number'
						name='achievement'
						value={props.formData.progress}
						onChange={props.handleChange}
					/>{" "}
					%
				</label>
				<button className='absolute bottom-10 right-10 w-auto rounded bg-green-500 px-12 py-4 text-white shadow-lg hover:bg-green-400'>
					登録
				</button>
			</form>
		</div>
	);
}
