import { useState, useRef, useEffect } from "react";
import TodoLists from "./components/TodoLists";
import ActiveTodo from "./components/ActiveTodo";
import TodoModal from "./components/TodoModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import SearchConditions from "./components/SearchConditions";
import {
	doc,
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import db from "./firebase";

export type Todo = {
	title: string;
	description: string;
	timeLimit: string;
	createdAt: string;
	id: string;
};

export type Conditions = {
	keyWord: string;
	createdAtStart: string;
	createdAtEnd: string;
	timeLimitStart: string;
	timeLimitEnd: string;
};

function App() {
	const inputEl = useRef<HTMLInputElement>(null);
	const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
	const [isSelectedTodo, setIsSelectedTodo] = useState<Todo>({
		title: "",
		description: "",
		timeLimit: "",
		createdAt: "",
		id: "",
	});
	const [formData, setFormData] = useState<Todo>({
		title: "",
		description: "",
		timeLimit: "",
		createdAt: "",
		id: "",
	});
	const [todos, setTodos] = useState<Todo[]>([]);
	const [currentTodos, setCurrentTodos] = useState<Todo[]>(todos);
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [searchConditions, setSearchConditions] = useState<Conditions>({
		keyWord: "",
		createdAtStart: "",
		createdAtEnd: "",
		timeLimitStart: "",
		timeLimitEnd: "",
	});

	/**フォーム内の値の変更を監視する関数です。
	 *@function
	 * @param e イベントです。
	 */
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/**検索条件内の値の変更を監視する関数です。
	 *@function
	 * @param e イベントです。
	 */
	const handleChangeSearchConditions = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setSearchConditions((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * 検索条件を初期化する関数です。
	 * @function
	 */
	const handleResetConditions = () => {
		setSearchConditions({
			keyWord: "",
			createdAtStart: "",
			createdAtEnd: "",
			timeLimitStart: "",
			timeLimitEnd: "",
		});

		setCurrentTodos(todos);
	};
	/**登録画面のモーダルウィンドウの表示状態を管理する関数です。
	 *@function
	 */
	const handleModalToggle = () => {
		if (isModalOpen) {
			setIsOpenModal(false);
		} else {
			setIsOpenModal(true);
		}
	};

	/**登録ボタンをクリックした時に発火する関数です。
	 * @function
	 * @param e フォームのイベントです
	 */
	const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formData.title.trim()) return alert("タイトルが空欄です。");

		//作成日を生成する
		const now = new Date();
		const year = now.getFullYear();
		const month = ("0" + (now.getMonth() + 1)).slice(-2);
		const date = ("0" + now.getDate()).slice(-2);
		const hour = ("0" + now.getHours()).slice(-2);
		const min = ("0" + now.getMinutes()).slice(-2);

		const createdAt = `${year}-${month}-${date}T${hour}:${min}`;

		//firebaseにドキュメントを追加する
		const docRef = await addDoc(collection(db, "todos"), {
			...formData,
			createdAt: createdAt,
		});

		//todosを変更する
		setTodos([...todos, { ...formData, id: docRef.id, createdAt: createdAt }]);

		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			createdAt: "",
			id: "",
		});
		handleModalToggle();
	};

	/**
	 * 検索条件に入力した条件を、currentTodosにセットする関数です。
	 * @param e
	 * @function
	 */
	const handleSearchConditionsSubmit = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		// フォームの処理を制御
		e.preventDefault();

		/***************************************
		  ここからフィルター処理をする前の準備
		 ****************************************/

		// フィルターをかけるかどうかのフラグを定義
		let keywordFilterFlg = true;
		let createdAtFlg = true;
		let timeLimitFlg = true;

		// キーワードが空欄だったらフラグをfalseにし、フィルターをかけない
		if (!searchConditions.keyWord.trim()) {
			keywordFilterFlg = false;
		}

		console.log(searchConditions);

		// 作成日が空欄だったらフラグをfalseにし、フィルターをかけない
		if (
			!searchConditions.createdAtStart.trim() &&
			!searchConditions.createdAtEnd.trim()
		) {
			createdAtFlg = false;
		}

		// 期限が空欄だったらフラグをfalseにし、フィルターをかけない
		if (
			!searchConditions.timeLimitStart.trim() &&
			!searchConditions.timeLimitEnd.trim()
		) {
			timeLimitFlg = false;
		}

		// 1. キーワードフィルターの処理
		const keywordFilter = (filteredTodo: Todo[]) => {
			// 入力したキーワードの半角・全角空白を削除し、配列にする
			const shapedKeyWord = searchConditions.keyWord.trim().split(/\s+/);

			// フィルターをかける回数(キーワードの配列分)
			const filterCount = shapedKeyWord.length;

			// キーワードの配列分、フィルターをかける
			for (let i = 0; i < filterCount; i++) {
				// フィルターをかけたものを上書きで格納
				filteredTodo = filterBeforeTodo.filter((todo: Todo) =>
					todo.title.includes(shapedKeyWord[i])
				);
			}

			// フィルター後のTodoを返す
			return filteredTodo;
		};

		// 2. 作成日フィルターの処理
		const createdAtFilter = (filterBeforeTodo: Todo[]) => {
			//作成日フィルターの下準備開始
			let createdAtStartNumber = 0;
			if (searchConditions.createdAtStart.trim() !== "") {
				createdAtStartNumber = new Date(
					searchConditions.createdAtStart
				).getTime();
			}

			let createdAtEndNumber = 0;
			if (searchConditions.createdAtEnd.trim() !== "") {
				createdAtEndNumber = new Date(searchConditions.createdAtEnd).getTime();
			}

			//作成日フィルターの
			filteredTodo = filterBeforeTodo.filter((todo) => {
				const createAtTodo: string = todo.createdAt.slice(0, 10);
				const createdAtTodoNumber = new Date(createAtTodo).getTime();
				console.log({ createAtTodo });
				console.log({ createdAtStartNumber });
				console.log({ createdAtTodoNumber });
				console.log({ createdAtEndNumber });
				//作成日開始も作成日終了も入力値がある場合
				if (
					searchConditions.createdAtStart !== "" &&
					searchConditions.createdAtEnd !== ""
				) {
					if (
						createdAtTodoNumber >= createdAtStartNumber &&
						createdAtTodoNumber <= createdAtEndNumber
					) {
						return true;
					} else {
						return false;
					}
				}

				//作成日開始のみ入力値がある場合
				if (
					searchConditions.createdAtStart !== "" &&
					searchConditions.createdAtEnd === ""
				) {
					if (createdAtStartNumber <= createdAtTodoNumber) {
						return true;
					} else {
						return false;
					}
				}

				//作成日終了のみ入力値がある場合
				if (
					searchConditions.createdAtStart === "" &&
					searchConditions.createdAtEnd !== ""
				) {
					if (createdAtEndNumber >= createdAtTodoNumber) {
						return true;
					} else {
						return false;
					}
				}
			});
			return filteredTodo;
		};

		// 3. 期限フィルターの処理
		function timeLimitFilter(filterBeforeTodo: Todo[]) {
			//作成日フィルターの下準備開始
			let timeLimitStartNumber = 0;
			if (searchConditions.timeLimitStart.trim() !== "") {
				timeLimitStartNumber = new Date(
					searchConditions.timeLimitStart
				).getTime();
			}

			let timeLimitEndNumber = 0;
			if (searchConditions.timeLimitEnd.trim() !== "") {
				timeLimitEndNumber = new Date(searchConditions.timeLimitEnd).getTime();
			}

			//作成日フィルターの
			filteredTodo = filterBeforeTodo.filter((todo) => {
				const timeLimitTodo: string = todo.timeLimit.slice(0, 10);
				const timeLimitTodoNumber = new Date(timeLimitTodo).getTime();

				//作成日開始も作成日終了も入力値がある場合
				if (
					searchConditions.timeLimitStart !== "" &&
					searchConditions.timeLimitEnd !== ""
				) {
					if (
						timeLimitTodoNumber >= timeLimitStartNumber &&
						timeLimitTodoNumber <= timeLimitEndNumber
					) {
						return true;
					} else {
						return false;
					}
				}

				//作成日開始のみ入力値がある場合
				if (
					searchConditions.timeLimitStart !== "" &&
					searchConditions.timeLimitEnd === ""
				) {
					if (timeLimitStartNumber <= timeLimitTodoNumber) {
						return true;
					} else {
						return false;
					}
				}

				//作成日終了のみ入力値がある場合
				if (
					searchConditions.timeLimitStart === "" &&
					searchConditions.timeLimitEnd !== ""
				) {
					if (timeLimitEndNumber >= timeLimitTodoNumber) {
						return true;
					} else {
						return false;
					}
				}
			});
			return filteredTodo;
		}

		/**********************************
		  ここからフィルター処理スタート
		 **********************************/

		// 現在のTodoList(全件)
		const filterBeforeTodo = [...todos];

		// キーワードフィルター対象のTodo
		let filteredTodo = filterBeforeTodo;

		// keywordFilterFlgが立っている場合のみキーワードフィルターをかける
		if (keywordFilterFlg) {
			filteredTodo = keywordFilter(filteredTodo);
		}

		// createdAtFlgが立っている場合のみ作成日フィルターをかける
		if (createdAtFlg) {
			filteredTodo = createdAtFilter(filteredTodo);
		}

		// timeLimitFlgが立っている場合のみ期限フィルターをかける
		if (timeLimitFlg) {
			filteredTodo = timeLimitFilter(filteredTodo);
		}

		// フィルター後のTodoを更新
		setCurrentTodos(filteredTodo);
	};

	/**選択されたTodoのIDを管理します。
	 * @function
	 * @param todo 選択されたTodoです。
	 */
	const handleSelectTodo = (todo: Todo) => {
		setIsSelectedTodo(todo);
	};

	/**todoを削除する関数です。
	 * @function
	 * @param id 削除するtodoのidです。
	 */
	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const doDelete = () => {
		const newTodos = todos.filter((todo) => isSelectedTodo.id !== todo.id);
		const currentNewTodos = currentTodos.filter(
			(todo) => isSelectedTodo.id !== todo.id
		);

		setTodos(newTodos);
		setCurrentTodos(currentNewTodos);
		setIsDeleteModalOpen(false);

		//firebaseのtodo削除
		deleteDoc(doc(db, "todos", isSelectedTodo.id));

		//isSelectedTodoの初期化
		setIsSelectedTodo({
			title: "",
			description: "",
			timeLimit: "",
			createdAt: "",
			id: "",
		});
	};

	/**todoを編集する編集ボタンをクリックすると発火する関数です。
	 * 新規登録と同様にモーダルを開いて編集可能な状態にします。
	 * @function
	 * @param id 編集するtodoのidです。
	 */
	const handleUpdateButton = (todo: Todo) => {
		handleModalToggle();
		setIsEditing(true);
		setFormData({ ...todo });
	};

	/**
	 * 更新ボタンをクリックするとtargetTodoを更新します。
	 * @function
	 * @param targetTodo 更新対象となるtodoです。
	 */
	const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formData.title.trim()) return alert("タイトルが空欄です。");
		const newTodos = todos.map((todo) => {
			if (isSelectedTodo.id === todo.id) {
				updateDoc(doc(db, "todos", todo.id), formData);
				return formData;
			} else {
				return todo;
			}
		});
		setTodos(newTodos);
		setCurrentTodos(newTodos);

		//firebaseの更新

		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			createdAt: "",
			id: "",
		});
		setIsSelectedTodo({ ...formData });
		setIsEditing(false);
		handleModalToggle();
	};
	// 登録フォームを開いた時に、タイトルにフォーカスする。
	useEffect(() => {
		if (inputEl.current && isModalOpen) {
			inputEl.current.focus();
		}
	}, [isModalOpen]);

	//firebaseからデータを一括取得する
	useEffect(() => {
		const todoData = collection(db, "todos");
		getDocs(todoData).then((result) => {
			const todosArray: Todo[] = [];
			result.forEach((todoData) =>
				todosArray.push({
					id: todoData.id,
					title: todoData.data().title,
					description: todoData.data().description,
					timeLimit: todoData.data().timeLimit,
					createdAt: todoData.data().createdAt,
				})
			);
			setTodos(todosArray);
			setCurrentTodos(todosArray);
			handleSearchConditionsSubmit;
		});
	}, []);

	return (
		<>
			<TodoModal
				handleModalToggle={handleModalToggle}
				isModalOpen={isModalOpen}
				handleRegisterSubmit={handleRegisterSubmit}
				handleChange={handleChange}
				formData={formData}
				inputEl={inputEl}
				isEditing={isEditing}
				handleUpdateSubmit={handleUpdateSubmit}
				isSelectedTodo={isSelectedTodo}
			/>
			<DeleteConfirmation
				isDeleteModalOpen={isDeleteModalOpen}
				doDelete={doDelete}
				handleDeleteModal={handleDeleteModal}
			/>
			<div className='flex h-screen w-full bg-slate-200'>
				<TodoLists
					todos={todos}
					handleSelectTodo={handleSelectTodo}
					isSelectedTodo={isSelectedTodo}
					handleDeleteModal={handleDeleteModal}
					currentTodos={currentTodos}
				/>
				<ActiveTodo
					isSelectedTodo={isSelectedTodo}
					handleModalToggle={handleModalToggle}
					handleUpdateButton={handleUpdateButton}
				/>
				<SearchConditions
					handleChangeSearchConditions={handleChangeSearchConditions}
					handleSearchConditionsSubmit={handleSearchConditionsSubmit}
					handleResetConditions={handleResetConditions}
					searchConditions={searchConditions}
				/>
			</div>
		</>
	);
}

export default App;
