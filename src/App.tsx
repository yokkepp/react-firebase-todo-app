import { useState, useRef, useEffect } from "react";

type Todo = {
	title: string;
	description: string;
	timeLimit: string;
	progress: number;
	id: string;
	done: boolean;
};
function App() {
	const inputEl = useRef(null);
	const [isModalOpen, setIsOpenModal] = useState(false);
	const [isSelectedTodo, setIsSelectedTodo] = useState("");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		timeLimit: "",
		progress: 0,
		id: "",
		done: false,
	});

	const [todos, setTodos] = useState<Todo[]>([]);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/**登録ボタンをクリックした時に発火する関数です。
	 * @function
	 * @param e フォームのイベントです
	 */
	const handleRegisterSubmit = (e: any) => {
		e.preventDefault();
		const targetId = crypto.randomUUID();
		setTodos([...todos, { ...formData, id: targetId }]);

		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			progress: 0,
			done: false,
			id: "",
		});

		handleModalToggle();
	};

	/**登録画面のモーダルウィンドウの表示状態を管理する関数です。
	 *
	 */
	const handleModalToggle = () => {
		if (isModalOpen) {
			setIsOpenModal(false);
		} else {
			setIsOpenModal(true);
		}
	};

	//登録フォームを開いた時に、タイトルにフォーカスする。
	useEffect(() => {
		if (inputEl.current) {
			inputEl.current.focus();
		}
	}, [isModalOpen]);

	//テスト用
	//todosの監視結果
	useEffect(() => {
		console.log(todos);
	}, [todos]);

	return (
		<>
			<div
				className={
					isModalOpen
						? "fixed z-50 flex h-screen w-full animate-fade-in items-center justify-center bg-black bg-opacity-60 transition-all"
						: "hidden"
				}>
				<form
					className=' container relative flex h-3/4 w-3/4 flex-col gap-5 rounded-2xl bg-slate-200 p-12 shadow-lg'
					onSubmit={handleRegisterSubmit}>
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
						className='resize-none p-3'
						name='description'
						value={formData.description}
						rows='10'
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
					<button className='absolute bottom-10 right-10 w-auto rounded bg-green-500 px-12 py-4 text-white shadow-lg hover:bg-green-400'>
						登録
					</button>
				</form>
			</div>
			<div className='flex h-screen w-full bg-slate-200'>
				<aside className='w-3/12 bg-slate-700 text-white'>
					<div className='flex flex-col pt-5'>
						<h1 className='text-center text-3xl font-bold'>Todo List</h1>
						<p className='border-b border-solid border-white pb-5 text-center text-sm'>
							検索結果：0 件
						</p>
						<ul className='flex flex-col gap-2 pl-3 pt-3'>
							{todos.map((todo) => {
								return (
									<li
										key={todo.id}
										className=' flex items-center rounded-l-md bg-slate-300 p-5 font-semibold text-slate-700'>
										<input type='checkbox' name='done' />
										<h2 className='ml-2 text-lg'>{todo.title}</h2>
									</li>
								);
							})}
						</ul>
					</div>
				</aside>
				<main className='relative flex w-6/12 flex-col gap-10 bg-slate-300 p-10'>
					<h1 className='text-4xl font-bold text-slate-700'>
						タイトル1が長かった時ってどんな感じに表示されるのか？
					</h1>
					<div className='flex justify-end gap-10'>
						<p>作成日：2023年10月1日</p>
						<p>期限：2023年10月1日</p>
					</div>
					<p>
						テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
					</p>
					<button
						className=' absolute bottom-10 right-10 h-16 w-16 rounded-full bg-green-600 text-4xl text-white shadow-md hover:bg-green-500'
						onClick={handleModalToggle}>
						＋
					</button>
				</main>
				<aside className='w-3/12 bg-slate-700 p-3 text-slate-600'>
					<form action=''>
						<h3 className='p-5 text-center text-white'>検索条件</h3>
						<div>
							<div className='my-3 rounded bg-slate-200 p-3'>
								<h4 className='text-sm  font-bold'>キーワード</h4>
								<div className='flex flex-col'>
									<input
										className='m-3 mx-auto w-full rounded-md p-1 pl-3'
										type='text'
									/>
									<p className='ml-auto text-xs'>を含む</p>
								</div>
							</div>
							<div className='my-3 rounded bg-slate-200 p-3'>
								<h4 className='text-sm  font-bold'>作成日</h4>
								<div className='flex flex-col'>
									<input
										className='m-3 mx-auto w-full rounded-md p-1 pl-3'
										type='date'
									/>
									<p className='ml-auto text-xs'>から</p>
									<input
										className='m-3 mx-auto w-full rounded-md p-1 pl-3'
										type='date'
									/>
									<p className='ml-auto text-xs'>まで</p>
								</div>
							</div>
							<div className='my-3 rounded bg-slate-200 p-3'>
								<h4 className='text-sm  font-bold'>期限</h4>
								<div className='flex flex-col'>
									<input
										className='mx-auto my-3 w-full rounded-md p-1 pl-3'
										type='date'
									/>
									<p className='ml-auto text-xs'>から</p>
									<input
										className='m-3 mx-auto w-full rounded-md p-1 pl-3'
										type='date'
									/>
									<p className='ml-auto text-xs'>まで</p>
								</div>
							</div>
							<button className='w-full rounded bg-green-600 py-5 text-white shadow-md hover:bg-green-500'>
								検索
							</button>
						</div>
					</form>
				</aside>
			</div>
		</>
	);
}

export default App;
