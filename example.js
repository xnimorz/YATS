$(function(){
        var str = "hi! My name is Nikita";
        var numb = 100;
        var a ={s:2,f:3, str:str};
        var b = a;
        var c;

        yats
                .group("ok/not")
                    .comment("Проверка выполнения функции, которая возвращает true (ok)").ok(function(){return true;})
                    .comment("Тест функции, которая возвращает false (not)").not(function(){return false;})
                    .comment("Тест выражения (not)").not(1==2)
                    .comment("Тест undefined (not)").not(undefined)
                    .comment("Существование объектов (ok)").ok(a)
                    .comment("Тестирование boolean (not)").not(0)
                .groupClose()

                .group("equal","Тестирование соответствия Equal")
                        .comment("2 Числа").equal(1,1)
                        .comment("Несколько чисел").equal(1,1,1,1,"1")
                        .comment("Разные данные (fail)").equal(1,"1","012")
                        .comment("Использование лишних даных в строке (fail)").equal(1,"1","01")
                        .comment("Тестирование объектов (по ссылке)").equal(a,b)
                .groupClose()
                .group("exist/notexist")
                    .comment("Тест функции (exist)").exist(function(){return true;})
                    .comment("Тест функции, которая возвращает false (exist)").exist(function(){return false;})
                    .comment("Существование объектов (exist)").exist(a)
                    .comment("Тест выражения (notExist)").notExist(1==2)
                    .comment("Тест undefined (notExist)").notExist(undefined)
                    .comment("Тестирования 0 (notExist)").notExist(0)
                    .comment("Тестирование несуществования (notExist)").notExist(null, undefined)
                    .comment("Тестирование несуществования с 1 (notExist)").notExist(null, undefined, 0)
                .groupClose()
                .toConsole()//Выведем результаты
                .clearStack()//Очистим стек
            //Тестирование с выделением переменной. Вложенные группы тестов:

                .group("Тестирование переменных")
                    .group("isMatch","Тестирование строковой переменной")
                        .test(str)
                            .comment("RegExp").isMatch(/[a-z]/g)
                            .comment("другой строкой").isMatch("name")
                            .comment("числом").isMatch(100)
                            //Данная функция позволяет вернуться к yats из методов для тестирования "зафиксированной" переменной
                            .end()
                 .groupClose()
                .group("isMatch","Тестирование числовой переменной")
                    .test(numb)
                        .comment("RegExp").isMatch(/[a-z]/g)
                        .comment("другой строкой").isMatch("name")
                        .comment("числом").isMatch(100)
                        .end()
                .groupClose()
                .group("isNotMatch")
                    .test(str)
                        .comment("RegExp").isNotMatch(/[a-z]/g)
                        .comment("другой строкой").isNotMatch("name")
                        .comment("числом").isNotMatch(100)
                        .end()
                .groupClose()
                .group("isDefined")
                    .test(str).comment("Определена ли строка").isDefined().end()
                    .test(a).comment("Определен ли объект").isDefined().end()
                    .test(numb).comment("Определено ли число").isDefined().end()
                    .test(c).comment("Определена ли объявленная переменная без присваивания").isDefined().end()
                .groupClose()
                .group("isUndefined")
                    .test(str).comment("Стрoка").isUndefined().end()
                    .test(a).comment("объект").isUndefined().end()
                    .test(numb).comment("число").isUndefined().end()
                    .test(c).comment("переменная без присваивания").isUndefined().end()
                .groupClose()
                .group("isEqual")
                    .test(str).comment("Стрoка").isEqual("hi! My name is Nikita").end()
                    .test(a).comment("объект (разные ссылки)").isEqual({s:2,f:3, str:str}).end()
                    .test(a).comment("объект (одна ссылка)").isEqual(b).end()
                    .test(a).comment("объект и число").isEqual(2).end()
                    .test(numb).comment("число").isEqual("100").end()
                    .test(c).comment("переменная без присваивания").isEqual(null).end()
                    .test({a:a,b:{a:a}}).comment("Object a").isEqual({a:{s:2,f:3, str:str},b:{a:{s:2,f:3, str:str}}}).end()
                .groupClose()
                .group("isContain tests")
                    .test(str).comment("Стрoка").isContain("hi! My name is Nikita").end()
                    .test(a).comment("Содержит ли объект свойство с числом").isContain(2).end()
                    .test(a).comment("Содержит ли объект свойство со строкой").isContain(str).end()
                    .test(numb).comment("число").isContain("100").end()
                    .test(c).comment("переменная без присваивания").isContain(null).end()
                .groupClose()


                // Тесты на сравнение объектов
                .group("isRecursiveEqual tests")
                    .test(str).comment("String").isRecursiveEqual(str).end()
                    .test(a).comment("Object a with equal object").isRecursiveEqual({s:2,f:3, str:str}).end()
                    .test(a).comment("Object a with another object").isRecursiveEqual({s:2,f:3}).end()
                    .test({a:2,f:3,c:{a:5,b:str}}).comment(" Some Object that contain a").isRecursiveEqual({a:2,f:3,c:{a:5,b:str}}).end()
                    .test({a:a,b:34}).comment("Two equal objects").isRecursiveEqual({a:a,b:34}).end()
                    .test({a:a,b:34}).comment("Two extended equal objects").isRecursiveEqual({a:{s:2,f:3, str:str},b:34}).end()
                    .test({a:a,b:{a:a}}).comment("Object a equal").isRecursiveEqual({a:{s:2,f:3, str:str},b:{a:a}}).end()
                    .test({a:a,b:{a:a}}).comment("Object a equal").isRecursiveEqual({a:{s:2,f:3, str:str},b:{a:{s:2,f:3, str:str}}}).end()
                    .test({a:a,b:{a:a}}).comment("Object  - fail test").isRecursiveEqual({a:{s:2,f:3, str:str},b:{a:{s:2, str:str}}}).end()
                .groupClose()
                .group("Is strict equal tests")
                    .test('123').comment('is "123" === "123"').isStrictEqual('123').end()
                    .test('123').comment('is "123" === 123').isStrictEqual(123).end()
                    .test(123).comment('is 123 === "123"').isStrictEqual('123').end()
                    .test(a).comment('a object === a').isStrictEqual(a).end()
                .groupClose()
                .group("Is recursive strict equal tests")
                    .test('123').comment('is "123" === "123"').isRecursiveStrictEqual('123').end()
                    .test('123').comment('is "123" === 123').isRecursiveStrictEqual(123).end()
                    .test(123).comment('is 123 === "123"').isRecursiveStrictEqual('123').end()
                    .test(a).comment('a object === a').isRecursiveStrictEqual(a).end()
                    .test(a).comment("Object a with equal object").isRecursiveStrictEqual({s:2,f:3, str:str}).end()
                    .test(a).comment("Object a with equal object, but another type against Number").isRecursiveStrictEqual({s:2,f:'3', str:str}).end()
                    .test(a).comment("Object a with another object").isRecursiveStrictEqual({s:2,f:3}).end()
                    .test({a:2,f:3,c:{a:5,b:str}}).comment(" Some Object that contain a").isRecursiveStrictEqual({a:2,f:3,c:{a:5,b:str}}).end()
                    .test({a:a,b:34}).comment("Two equal objects").isRecursiveStrictEqual({a:a,b:34}).end()
                    .test({a:a,b:34}).comment("Two extended equal objects").isRecursiveStrictEqual({a:{s:2,f:3, str:str},b:34}).end()
                    .test({a:a,b:{a:a}}).comment("Object a equal").isRecursiveStrictEqual({a:{s:2,f:3, str:str},b:{a:a}}).end()
                    .test({a:a,b:{a:a}}).comment("Object a equal").isRecursiveStrictEqual({a:{s:2,f:3, str:str},b:{a:{s:2,f:3, str:str}}}).end()
                    .test({a:a,b:{a:a}}).comment("Object  - fail test").isRecursiveStrictEqual({a:{s:2,f:3, str:str},b:{a:{s:2, str:str}}}).end()
                .groupClose()
                //////////////////////////////////////////////////////
                .groupClose().toConsole();


        $('body').append('<div class="test-node">тест</div>');

        $('body').append(yats.getHtmlResult());
        yats.clearStack();

        yats.setWorkingNode('.test-node').group('Пример работы с нодой', function() {

            var node = document.querySelectorAll('.test-node')[0];

            yats.comment('Первая попытка получить innerHTML').ok(node.innerHTML === 'тест');

            yats.comment('Внутри группы тестов рабочая нода не очищается').ok(node.innerHTML === 'тест');
        }).toConsole();


        yats.setWorkingNode('.test-node').group('Пример работы с нодой', function() {

            var node = document.querySelectorAll('.test-node')[0];

            yats.comment('Получить не удается, так как данные в ноде уже удалены').not(node.innerHTML);
        }).toConsole();

});