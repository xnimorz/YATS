(function(scope) {
    'use strict';
    /**
     * Успешный результат теста
     * @constructor
     */
    function SuccessResult() {
    }

    SuccessResult.prototype.toString = function () {
        return "Success";
    };
    /**
     * Тест провален
     * @constructor
     */
    function FailResult() {
    }

    FailResult.prototype.toString = function () {
        return "Fail";
    };
    /**
     * Во время теста было вызвано исключение
     * @constructor
     */
    function ExceptionResult() {
    }

    ExceptionResult.prototype.toString = function () {
        return "Exception";
    };
    /**
     * Класс представления результатов теста
     * @constructor
     * @attribute comments - комментарий к тесту
     * @attribute pass - успешность теста
     */
    function TestItem() {
        this.comments = "";
        this.pass = null;
    }

    TestItem.prototype.comment = function (text) {
        this.comments = text;
    };

    /**
     * Интерфейс для стандартных тестовых функций
     * @constructor
     */
    function TestTemplate() {
        /**
         * Функция проведения теста. Заполняет данные testItem
         */
        this.doTest = function () {};
    }

    /**
     * Тест проверки истинности выражения\функции
     * @constructor
     */
    function TestCheck() {
        /**
         * Тест на истинность выражения
         * @param {TestItem} testItem - объект, описывающий результат выражения
         * @param {object,function} expression - выражение\функция
         */
        this.doTest = function (testItem, expression) {
            if (expression instanceof Function) {
                try {
                    expression = expression();
                }
                catch (e) {
                    expression = null;
                    testItem.pass = new ExceptionResult();
                    return;
                }
            }
            if (expression) {
                testItem.pass = new SuccessResult();
            }
            else {
                testItem.pass = new FailResult();
            }
        };
    }

    TestCheck.prototype = new TestTemplate();
    TestCheck.prototype.constructor = TestCheck;

    /**
     * Тест проверки на эквивалентность значений\ссылок
     * @constructor
     */
    function TestEqual() {
        /**
         * Проверка данных на эквивалентность.
         * Индексация с 1-го элемента (0-й элемент заполняется как рез-тат теста   )
         * @param {TestItem} testItem - объект, описывающий результат выражения
         */
        this.doTest = function (testItem) {
            for (var i = 1; i < arguments.length - 1; i++) {
                if (arguments[i] != arguments[i + 1]) {
                    testItem.pass = new FailResult();
                    return;
                }
            }
            testItem.pass = new SuccessResult();
        };
    }

    TestEqual.prototype = new TestTemplate();
    TestEqual.prototype.constructor = TestEqual;

    /**
     * Проверка данных на существование
     * @constructor
     */
    function TestExist() {
        /**
         * Проверка данных на существование.
         * Индексация с 1-го элемента (0-й элемент заполняется как рез-тат теста)
         * @param {TestItem} testItem - объект, описывающий результат выражения
         */
        this.doTest = function (testItem) {
            if (arguments.length == 1) {
                testItem.pass = new FailResult();
                return;
            }
            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i]) {
                    testItem.pass = new FailResult();
                    return;
                }
            }
            testItem.pass = new SuccessResult();
        };
    }

    TestExist.prototype = new TestTemplate();
    TestExist.prototype.constructor = TestExist;

    /**
     * Проверка элементов на несуществование
     * @constructor
     */
    function TestNotExist() {
        /**
         * Проверка данных на НЕ существование.
         * Индексация с 1-го элемента (0-й элемент заполняется как рез-тат теста)
         * @param {TestItem} testItem - объект, описывающий результат выражения
         */
        this.doTest = function (testItem) {
            if (arguments.length == 1) {
                testItem.pass = new FailResult();
                return;
            }
            for (var i = 1; i < arguments.length; i++) {
                if (arguments[i]) {
                    testItem.pass = new FailResult();
                    return;
                }
            }
            testItem.pass = new SuccessResult();
        };
    }

    TestNotExist.prototype = new TestTemplate();
    TestNotExist.prototype.constructor = TestNotExist;

    /**
     * Класс тестирования переменных { yats.test(variable).методТестирования }
     * @param value - переменная для тестирования
     * @param yats - ссылка на глобальный объект yats
     * @constructor
     */
    function ValueTestGroup(value, yats) {
        this.testValue = value;
        this.yats = yats;
        this.comments = "";
    }

    /**
     * Комментирование теста
     * @param {string} text
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.comment = function (text) {
        this.comments = text;
        return this;
    };

    /**
     * Подготовка testItem
     * @returns {TestItem} объект, подготовленный для записи результата теста
     */
    ValueTestGroup.prototype.prepareTestItem = function () {
        var test = new TestItem();
        test.testValue = this.testValue;
        test.comment(this.comments);
        this.comments = "";
        return test;
    };

    /**
     * Тест на соответствие строке или регулярному выражению
     * @param {String, RegExp} item
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.isMatch = function (item) {
        var test = this.prepareTestItem();
        try {
            if (this.testValue.match(item)) {
                test.pass = new SuccessResult();
            } else {
                test.pass = new FailResult();
            }
        } catch (e) {
            test.pass = new ExceptionResult();
        }
        this.yats.addNewItem(test);
        return this;
    };

    /**
     * Тест на несоответствие строке || RegExp
     * @param {String, RegExp} item
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.isNotMatch = function (item) {
        var test = this.prepareTestItem();
        if (this.testValue.match(item)) {
            test.pass = new FailResult();
        } else {
            test.pass = new SuccessResult();
        }
        this.yats.addNewItem(test);
        return this;
    };

    /**
     * Тест на определенность переменной (true)
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.isDefined = function () {
        var test = this.prepareTestItem();
        if (this.testValue) {
            test.pass = new SuccessResult();
        } else {
            test.pass = new FailResult();
        }
        this.yats.addNewItem(test);
        return this;
    };

    /**
     * Тест на неопределенность (false)
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.isUndefined = function () {
        var test = this.prepareTestItem();
        if (this.testValue) {
            test.pass = new FailResult();
        } else {
            test.pass = new SuccessResult();
        }
        this.yats.addNewItem(test);
        return this;
    };

    /**
     * Тест на равенство переменной заданому item
     * @param {object} item
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.is = function (item) {
        var test = this.prepareTestItem();
        if (this.testValue == item) {
            test.pass = new SuccessResult();
        } else {
            test.pass = new FailResult();
        }
        this.yats.addNewItem(test);
        return this;
    };

    /**
     * Проверяет входит ли item в заданный объект\строку\массив
     * @param item
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.isContain = function (item) {
        var test = this.prepareTestItem();
        //item есть RegExp:
        if (item instanceof RegExp && this.testValue.match) {
            if (this.testValue.match(item)) {
                test.pass = new SuccessResult();
                this.yats.addNewItem(test);
                return this;
            }
        }
        //Определена функция поиска:
        if (this.testValue && this.testValue.indexOf) {
            if (this.testValue.indexOf(item) >= 0) {
                test.pass = new SuccessResult();
                this.yats.addNewItem(test);
                return this;
            }
        }
        //Проходим по значениям в testValue
        for (var i in this.testValue) {
            if (this.testValue[i] == item) {
                test.pass = new SuccessResult();
                this.yats.addNewItem(test);
                return this;
            }
        }
        //Полное соответствие:
        if (item == this.testValue) {
            test.pass = new SuccessResult();
            this.yats.addNewItem(test);
            return this;
        }
        //Ничего не оказалось верным
        test.pass = new FailResult();
        this.yats.addNewItem(test);
        return this;
    };

    /**
     * Возвращает к глобальному объекту.
     * Завершение тестирование переменной (для цепочных вызовов)
     * Не обязательно вызывать.
     * @returns yats
     */
    ValueTestGroup.prototype.end = function () {
        return this.yats;
    };

    /**
     * сравнение двух объектов (first и second). Если определен в true третий параметр - нерекурсивное сравнение
     * @param first - сравниваемый объект
     * @param second - сравниваемый объект
     * @param notRecursive - false/undefined - рекурсивное сравнение, true - нерекурсивное сравнение (по ссылке)
     * @returns {boolean} равны ли объекты
     * @private
     */
    ValueTestGroup.prototype._isRecursiveEqual = function (first, second, notRecursive) {
        try {
            if (first == second) {
                return true;
            }
            for (var itemName in first) {
                if (!(itemName in second)) {
                    return false;
                }
                if (second[itemName] instanceof Number || second[itemName] instanceof String || second[itemName] instanceof Function || notRecursive) {
                    if (second[itemName] != first[itemName]) {
                        return false;
                    }
                } else {
                    if (!this._isRecursiveEqual(first[itemName], second[itemName])) {
                        return false;
                    }
                }
            }

            for (itemName in second) {
                if (!(itemName in first)) {
                    return false;
                }
            }
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * Рекурсивное сравнение двух объектов
     * @param other -  объект с которым проходит сравнение
     * @returns цепочые вызовы - this
     */
    ValueTestGroup.prototype.isRecursiveEqual = function (other) {
        var test = this.prepareTestItem();
        if (this._isRecursiveEqual(this.testValue, other)) {
            test.pass = new SuccessResult();
        } else {
            test.pass = new FailResult();
        }
        this.yats.addNewItem(test);
        return this;
    };
    /**
     * Проверка на соответствие объектов друг-другу (без рекурсивного спуска)
     * @param {object} other
     * @returns ссылка на себя (цепочные вызовы)
     */
    ValueTestGroup.prototype.isEqual = function (other) {
        var test = this.prepareTestItem();
        if (this._isRecursiveEqual(this.testValue, other, true)) {
            test.pass = new SuccessResult();
        } else {
            test.pass = new FailResult();
        }
        this.yats.addNewItem(test);
        return this;
    };

    /**
     * Группа тестов (элемент, объединяющий тесты)
     * @param {String} name - название группы
     * @param {String} description - описание группы
     */
    function TestGroup(name, description) {
        this.name = name || "";
        this.description = description || "";
        //Стек вызовов
        this.testStack = [];
        //Метка закрытости группы (для не корневой группы)
        this.isClose = false;
        //Результаты тестов
        this.results = {
            success: 0,
            fail: 0,
            error: 0,
            total: 0
        };
    }

    /**
     * Функция возвращает результат последнего выполненного теста
     * @returns {String} - описание результата последнего теста
     */
    TestGroup.prototype.getLastResult = function () {
        if (this.testStack.length > 0) {
            if (this.testStack[this.testStack.length - 1] instanceof  TestItem) {
                return this.testStack[this.testStack.length - 1].pass.toString();
            }
            return this.testStack[this.testStack.length - 1].getLastResult();
        }
        return null;
    };

    /**
     * Функция добавляет новый результат теста в стек
     * @param testItem
     */
    TestGroup.prototype.addNewItem = function (testItem) {
        //Группы тестов не обрабатываем
        if (testItem instanceof TestItem) {
            this.results.total++;
            if (testItem.pass instanceof SuccessResult) {
                this.results.success++;
            } else {
                if (testItem.pass instanceof FailResult) {
                    this.results.fail++;
                } else {
                    this.results.error++;
                }
            }
        }
        if (this.testStack.length > 0 &&
            this.testStack[this.testStack.length - 1] instanceof  TestGroup && !this.testStack[this.testStack.length - 1].isClose) {
            this.testStack[this.testStack.length - 1].addNewItem(testItem);
            return;
        }
        this.testStack.push(testItem);
    };

    /**
     * Закрывает группу тестов
     */
    TestGroup.prototype.close = function () {
        if (this.testStack.length > 0 &&
            this.testStack[this.testStack.length - 1] instanceof  TestGroup && !this.testStack[this.testStack.length - 1].isClose) {
            this.testStack[this.testStack.length - 1].close();
        } else {
            this.isClose = true;
        }
    };

    /**
     *
     * @returns {String} название группы
     */
    TestGroup.prototype.getName = function () {
        return this.name;
    };

    /**
     * Вывод результатов тестирования группы
     */
    TestGroup.prototype.consoleFormat = function () {
        console.group("%s: %s", this.name, this.description);
        console.log("total: %s %c success: %s %c fail: %s %c error: %s",
            this.results.total,
            "color:blue",
            this.results.success,
            "color:red",
            this.results.fail,
            "color: Firebrick",
            this.results.error);
        console.groupCollapsed("Tests");
        for (var i = 0; i < this.testStack.length; i++) {
            if (this.testStack[i] instanceof TestGroup) {
                this.testStack[i].consoleFormat();
            } else {
                if (!(this.testStack[i].pass instanceof SuccessResult)) {
                    console.log("%c %s - %s", "color:red",
                        this.testStack[i].comments,
                        this.testStack[i].pass.toString(),
                        this.testStack[i].testValue ? this.testStack[i].testValue : "");

                } else {
                    console.log("%c %s - %s", "color: blue",
                        this.testStack[i].comments,
                        this.testStack[i].pass.toString(),
                        this.testStack[i].testValue ? this.testStack[i].testValue : "");
                }
            }
        }
        console.groupEnd();
        console.groupEnd();
    };

    /**
     *
     * @returns {String} описание группы
     */
    TestGroup.prototype.getDescription = function () {
        return this.description;
    };

    /**
     * Представляет результаты тестов группы в виде html кода
     */
    TestGroup.prototype.htmlFormat = function () {
        //console.group("%s: %s",this.name,this.description);
        //console.log("total: %s %c success: %s %c fail: %s %c error: %s",this.results.total,"color:blue",this.results.success,"color:red", this.results.fail,"color: Firebrick",this.results.error);
        //console.groupCollapsed("Tests")
        var htmlResult = "<p class='yats-title'>" + this.name + ": " + this.description + "</p>";
        htmlResult += "<p class='yats-tests'>total: " + this.results.total +
            " <span class='yats-tests__success'>success: " + this.results.success + " </span>" +
            "<span class='yats-tests__fail'>fail: " + this.results.fail + " </span>" +
            "<span class='yats-tests__error'>error: " + this.results.error + "</span></p>";

        for (var i = 0; i < this.testStack.length; i++) {
            if (this.testStack[i] instanceof TestGroup) {
                htmlResult += this.testStack[i].htmlFormat();
            }
            else if (!(this.testStack[i].pass instanceof SuccessResult)) {
                htmlResult += "<p class='yats-tests__fail'>" +
                    this.testStack[i].comments +
                    " - " +
                    this.testStack[i].pass.toString() +
                    "</p>";
            }
            else {
                htmlResult += "<p class='yats-tests__success'>" +
                    this.testStack[i].comments +
                    " - " +
                    this.testStack[i].pass.toString() +
                    "</p>";
            }
        }
        return htmlResult;
    };


    /**
     * Корневая группа, собственно объект с методами для тестирования
     * @constructor
     */
    function YetAnotherTestSystem() {
        //Комментарий к тесту
        var testComment = "";
        /**
         * Подготавливает данные, объединяет в единый массив
         * @param {TestItem} test - результат тестов (незаполненный)
         * @param {Object, Number, String, Array} expression - аргументы для тестирования
         * @returns {Array} подготовленный массив для проведения теста
         */
        var prepareArray = function (test, expression) {
            var result = [test], isArray = false;

            try {
                if (expression && expression.length) {
                    for (var i = 0; i < expression.length; i++) {
                        isArray = true;
                        result.push(expression[i]);
                    }
                }
            }
            finally {
                if (!isArray) {
                    result.push(expression);
                }
            }
            return result;
        };

        var testItemCreator = function () {
            var test = new TestItem();
            if (testComment != "") {
                test.comment(testComment);
                testComment = "";
            }
            return test;
        };
        /**
         * Метод для проверки выражения на истинность
         * @param expression - выражение\функция
         * @returns {yats}
         */
        this.check = function (expression) {
            var test = testItemCreator();
            var f = new TestCheck();
            f.doTest.apply(null, prepareArray(test, expression));
            this.addNewItem(test);
            return this;
        };

        /**
         * Метод для проверки данных на равенство
         * @param arguments - набор данных (2 и более аргументов)
         * @returns {yats}
         */
        this.equal = function () {
            var test = testItemCreator();
            (new TestEqual()).doTest.apply(null, prepareArray(test, arguments));
            this.addNewItem(test);
            return this;
        };

        /**
         * Метод для проверки данных на истинность (существование)
         * @param arguments - набор данных (от 1)
         * @returns {yats}
         */
        this.exist = function () {
            var test = testItemCreator();
            (new TestExist()).doTest.apply(null, prepareArray(test, arguments));
            this.addNewItem(test);
            return this;
        };

        /**
         * Метод для проверки данных на НЕ существование
         * @param arguments - набор данных (от 1)
         * @returns {yats}
         */
        this.notExist = function () {
            var test = testItemCreator();
            (new TestNotExist()).doTest.apply(null, prepareArray(test, arguments));
            this.addNewItem(test);
            return this;
        };

        /**
         * Получает информацию о последнем проведенном тесте
         * @returns {String} - информация о последнем тесте
         */
        this.result = function () {
            return this.getLastResult();
        };

        /**
         * Задает комментарий к следующему тесту
         * @param text - текст комментария
         * @returns {yats}
         */
        this.comment = function (text) {
            testComment = text;
            return this;
        };

        /**
         * Создание группы тестов
         * @param {String} name - название группы
         * @param {String} description - описание группы
         * @param {function} exec - функция, в которой описаны тесты данной группы. Необязательный параметр. Возможна замена с помощью yats.group(...); ... yats.groupClose();
         */
        this.group = function (name, description, exec) {
            var group = new TestGroup(name, description);
            this.addNewItem(group);
            if (exec instanceof Function) {
                exec();
                group.close();
            }
            return this;
        };

        /**
         * Закрывает последний открытый тест
         */
        this.groupClose = function () {
            this.close();
            return this;
        };

        /**
         * Выводит результаты тестирования в консоль
         */
        this.toConsole = function () {
            this.consoleFormat();
            return this;
        };

        /**
         * Выдает html структуру результатов
         * @returns {String} Html - код результатов
         */
        this.getHtmlResult = function () {
            return this.htmlFormat();
        };

        /**
         * Тестирование переменной
         * @param value - переменная для теста
         * @returns {ValueTestGroup} - объект с методами для теста переменной (также поддержка комментариев, цепочных вызовов)
         */
        this.test = function (value) {
            return new ValueTestGroup(value, this);
        };

        /**
         * Очистка стека тестов
         */
        this.clearStack = function () {
            this.testStack = [];
            this.results = {
                total: 0,
                success: 0,
                fail: 0,
                error: 0
            };
            return this;
        };
    }
    YetAnotherTestSystem.prototype = new TestGroup("YATS", "");
    YetAnotherTestSystem.prototype.constructor = YetAnotherTestSystem;

    scope.yats = new YetAnotherTestSystem();


})(this);