import { IoMdTimer, IoIosCreate } from "react-icons/io";
import { GiProgression } from "react-icons/gi";

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

export default function TodoModal(props: Props) {
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
				<input
					type='text'
					name='title'
					onChange={handleChange}
					value={formData.title}
					ref={inputEl}
					className='p-5 text-3xl font-semibold'
					placeholder='件名を入力してください'></input>

				<div className='flex flex-row justify-between'>
					<div className='flex'>
						<div className='flex h-10 w-10 items-center justify-center'>
							<IoMdTimer size='70%' color='#64748b' />
						</div>
						<input
							name='timeLimit'
							value={formData.timeLimit}
							type='datetime-local'
							onChange={handleChange}
							className='p-2'
						/>
					</div>
					<div className='flex'>
						<div className='flex h-10 w-10 items-center justify-center'>
							<IoIosCreate size='70%' color='#64748b' />
						</div>
						<input
							type='datetime-local'
							className='bg-slate-200 p-2'
							value={formData.createdAt}
							disabled
						/>
					</div>
				</div>
				<textarea
					className='h-1/2 resize-none p-3'
					name='description'
					value={formData.description}
					placeholder='詳細を入力してください'
					onChange={handleChange}></textarea>

				{isEditing ? (
					<button className='w-auto rounded bg-slate-500 px-12 py-4 text-white shadow-lg hover:bg-slate-400'>
						更新
					</button>
				) : (
					<button className='w-auto rounded bg-green-500 px-12 py-4 text-white shadow-lg hover:bg-green-400'>
						登録
					</button>
				)}
			</form>
		</div>
	);
}
