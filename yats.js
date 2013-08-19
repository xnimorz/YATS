(function(scope)
{
	/**
	 * Успешный результат теста
	 * @constructor
	 */
	function SuccessResult()
	{}
	SuccessResult.prototype.toString = function()
	{
		return "Success";
	}

	/**
	 * Тест провален
	 * @constructor
	 */
	function FailResult()
	{}
	FailResult.prototype.toString = function()
	{
		return "Fail";
	}

	/**
	 * Во время теста было вызвано исключение
	 * @constructor
	 */
	function ExceptionResult()
	{}
	ExceptionResult.prototype.toString = function()
	{
		return "Exception";
	}

	/**
	 * Класс представления результатов теста
	 * @constructor
	 * @attribute comment - комментарий к тесту
	 * @attribute pass - успешность теста
	 */
	function TestItem()
	{
		this.comment = "";
		this.pass = null;
	}

	/**
	 * Интерфейс для стандартных тестовых функций
	 * @constructor
	 */
	function StandardTestTemplate()
	{
		/**
		 * Функция проведения теста. Заполняет данные testItem
		 * @param {TestItem} testItem - объект, описывающий результат выражения
		 * @param {object,function} expression - тестовые данные
		 */
		this.doTest = function(testItem, expression){};
	}

	/**
	 * Тест проверки истинности выражения\функции
	 * @constructor
	 */
	function TestCheck()
	{
		/**
		 * Тест на истинность выражения
		 * @param {TestItem} testItem - объект, описывающий результат выражения
		 * @param {object,function} expression - выражение\функция
		 */
		this.doTest = function(testItem, expression)
		{
			if (expression instanceof Function)
			{
				try
				{
					expression = expression();
				}
				catch(e){
					expression = null;
					testItem.pass = new ExceptionResult();
					return;
				}
			}
			if (expression)
			{
				testItem.pass = new SuccessResult();

			}
			else
				testItem.pass = new FailResult();

		}
	}
	TestCheck.prototype = new StandardTestTemplate();
	TestCheck.prototype.constructor = TestCheck;

	/**
	 * Тест проверки на эквивалентность значений\ссылок
	 * @constructor
	 */
	function TestEqual()
	{
		/**
		 * Проверка данных на эквивалентность.
		 * Индексация с 1-го элемента (0-й элемент заполняется как рез-тат теста   )
		 * @param {TestItem} testItem - объект, описывающий результат выражения
		 */
		this.doTest = function(testItem)
		{
			for (var i = 1; i < arguments.length-1; i++)
			{
				if (arguments[i] != arguments[i+1])
				{
					testItem.pass = new FailResult();
					return;
				}
			}
			testItem.pass = new SuccessResult();
		}
	}
	TestEqual.prototype = new StandardTestTemplate();
	TestEqual.prototype.constructor = TestEqual;

	/**
	 * Проверка данных на существование
	 * @constructor
	 */
	function TestExist()
	{
		/**
		 * Проверка данных на существование.
		 * Индексация с 1-го элемента (0-й элемент заполняется как рез-тат теста)
		 * @param {TestItem} testItem - объект, описывающий результат выражения
		 */
	 this.doTest = function(testItem)
	 {
		 if (arguments.length == 1)
		 {
			 testItem.pass = new FailResult();
			 return;
		 }
		 for (var i = 1; i < arguments.length; i++)
		 {
			 if (!arguments[i])
			 {
				 testItem.pass = new FailResult();
				 return;
			 }
		 }
		 testItem.pass = new SuccessResult();
	 }
	}
	TestExist.prototype = new StandardTestTemplate();
	TestExist.prototype.constructor = TestExist;

	/**
	 * Проверка элементов на несуществование
	 * @constructor
	 */
	function TestNotExist()
	{
		/**
		 * Проверка данных на НЕ существование.
		 * Индексация с 1-го элемента (0-й элемент заполняется как рез-тат теста)
		 * @param {TestItem} testItem - объект, описывающий результат выражения
		 */
		this.doTest = function(testItem)
		{
			if (arguments.length == 1)
			{
				testItem.pass = new FailResult();
				return;
			}
			for (var i = 1; i < arguments.length; i++)
			{
				if (arguments[i])
				{
					testItem.pass = new FailResult();
					return;
				}
			}
			testItem.pass = new SuccessResult();
		}
	}
	TestNotExist.prototype = new StandardTestTemplate();
	TestNotExist.prototype.constructor = TestNotExist;

	/**
	 * Группа тестов (элемент, объединяющий тесты)
	 * @param {String} name - название группы
	 * @param {String} description - описание группы
	 */
	function TestGroup(name,description)
	{
		this.name =  name;
		this.description = description;
		//Стек вызовов
		this.testStack = [];
		//Метка закрытости группы (для не корневой группы)
		this.isClose = false;
		//Результаты тестов
		this.results =
		{
			success:0,
			fail:0,
			error:0,
			total:0
		};
	}

	/**
	 * Функция возвращает результат последнего выполненного теста
	 * @returns {String} - описание результата последнего теста
	 */
	TestGroup.prototype.getLastResult = function()
	{
		if (this.testStack.length > 0)
		{
			if (this.testStack[this.testStack.length-1] instanceof  TestItem)
			{
				return this.testStack[this.testStack.length-1].pass.toString();
			}
			return this.testStack[this.testStack.length-1].getLastResult();
		}
		return null;
	}

	/**
	 * Функция добавляет новый результат теста в стек
	 * @param testItem
	 */
	TestGroup.prototype.addNewItem = function(testItem)
	{
		//Группы тестов не обрабатываем
		if (testItem instanceof TestItem)
		{
			this.results.total++;
			if (testItem.pass instanceof SuccessResult)
				this.results.success++;
				else if (testItem.pass instanceof FailResult)
					this.results.fail++;
					else this.results.error++;
		}
		if (this.testStack.length > 0 && this.testStack[this.testStack.length-1] instanceof  TestGroup && !this.testStack[this.testStack.length-1].isClose)
		{
			this.testStack[this.testStack.length-1].addNewItem(testItem);
			return;
		}
		this.testStack.push(testItem);
	}

	/**
	 * Закрывает группу тестов
	 */
	TestGroup.prototype.close = function()
	{
		if (this.testStack.length > 0  && this.testStack[this.testStack.length-1] instanceof  TestGroup && !this.testStack[this.testStack.length-1].isClose)
		{
			this.testStack[this.testStack.length-1].close();
		}
		else
		this.isClose = true;
	}

	/**
	 *
	 * @returns {String} название группы
	 */
	TestGroup.prototype.getName = function()
	{
		return this.name;
	}

	/**
	 * Вывод результатов тестирования группы
	 */
	TestGroup.prototype.consoleFormat = function()
	{
		console.group("%s: %s",this.name,this.description);
		console.log("total: %s %c success: %s %c fail: %s %c error: %s",this.results.total,"color:blue",this.results.success,"color:red", this.results.fail,"color: Firebrick",this.results.error);
		console.groupCollapsed("Tests")
		 for(var i = 0; i < this.testStack.length; i++)
		 {
			if (this.testStack[i] instanceof TestGroup)
			{
				this.testStack[i].consoleFormat();
			}
			 else
			if (!(this.testStack[i].pass instanceof SuccessResult))
		        console.log("%c %s - %s","color:red",this.testStack[i].comment,this.testStack[i].pass);
				else console.log("%c %s - %s","color: blue",this.testStack[i].comment,this.testStack[i].pass);
		 }
		console.groupEnd();
		console.groupEnd();
	}

	/**
	 *
	 * @returns {String} описание группы
	 */
	TestGroup.prototype.getDescription = function()
	{
		return this.description;
	}

	/**
	 * Корневая группа, собственно объект с методами для тестирования
	 * @constructor
	 */
	function YetAnotherTestSystem()
	{

		//Комментарий к тесту
		var testComment = "";

		/**
		 * Подготавливает данные, объединяет в единый массив
		 * @param {TestItem} test - результат тестов (незаполненный)
		 * @param {Object, Number, String, Array} expression - аргументы для тестирования
		 * @returns {Array} подготовленный массив для проведения теста
		 */
		var prepareArray = function(test,expression)
		{
			var result = [test], isArray = false;
			try
			{
				for (var i = 0; i < expression.length; i++)
				{
					isArray = true;
					result.push(expression[i]);
				}
			}
			finally
			{
				if (!isArray)
				{
					result.push(expression)
				}
			}
			return result;
		}

		var testItemCreator = function()
		{
		   var test = new TestItem();
			if (testComment != "")
			{
			   test.comment = testComment;
			   testComment = "";
			}
			return test;
		}
		/**
		 * Метод для проверки выражения на истинность
		 * @param expression - выражение\функция
		 * @returns {yats}
		 */
		this.check = function(expression)
		{
			var test = testItemCreator()
		    var f = (new TestCheck())
			    f.doTest.apply(null,prepareArray(test,expression));
			this.addNewItem(test);
			return this;
		}

		/**
		 * Метод для проверки данных на равенство
		 * @param args - набор данных (2 и более аргументов)
		 * @returns {yats}
		 */
		this.equal = function(args)
		{
			var test = testItemCreator();
			(new TestEqual()).doTest.apply(null,prepareArray(test,arguments));
			this.addNewItem(test);
			return this;
		}

		/**
		 * Метод для проверки данных на истинность (существование)
		 * @param args - набор данных (от 1)
		 * @returns {yats}
		 */
		this.exist = function (args)
		{
			var test = testItemCreator();
			(new TestExist()).doTest().apply(null,prepareArray(test,arguments));
			this.addNewItem(test);
			return this;
		}

		/**
		 * Метод для проверки данных на НЕ существование
		 * @param args - набор данных (от 1)
		 * @returns {yats}
		 */
		this.notExist = function(args)
		{
			var test = testItemCreator();
			(new TestNotExist()).doTest.apply(null,prepareArray(test,arguments));
			this.addNewItem(test);
			return this;
		}

		/**
		 * Получает информацию о последнем проведенном тесте
		 * @returns {String} - информация о последнем тесте
		 */
		this.result = function()
		{
			return this.getLastResult();
		}

		/**
		 * Задает комментарий к следующему тесту
		 * @param text - текст комментария
		 * @returns {yats}
		 */
		this.comment = function(text)
		{
			testComment = text;
			return this;
		}

		/**
		 * Создание группы тестов
		 * @param {String} name - название группы
		 * @param {String} description - описание группы
		 * @param {function} exec - функция, в которой описаны тесты данной группы. Необязательный параметр. Возможна замена с помощью yats.group(...); ... yats.groupClose();
		 */
		this.group = function(name, description, exec )
		{
			var group = new TestGroup(name,description);
			this.addNewItem(group);
			if (exec instanceof Function)
			{
				exec();
				group.close();
			}
			return this;
		}

		/**
		 * Закрывает последний открытый тест
		 */
		this.groupClose = function()
		{
			 this.close();
			return this;
		}

		/**
		 * Выводит результаты тестирования в консоль
		 */
		this.toConsole = function()
		{
			this.consoleFormat();
			return this;
		}

	}
	YetAnotherTestSystem.prototype = new TestGroup("YATS","");
	YetAnotherTestSystem.prototype.constructor = YetAnotherTestSystem;

	scope.yats = new YetAnotherTestSystem();


})(this);