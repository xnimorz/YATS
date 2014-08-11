## YATS
Небольшая библиотека для проведения UNIT-тестирования кода.
Глобальный объект - yats

wiki страница - http://xnim.ru/blog?id=38
пример работы - http://xnim.ru/EXAMPLE.html

#Поддерживает 
 - подключение как глобальный объект, работу с require.js
 - работу с node.js
 - цепочные вызовы
 - иерархии тестов: создание вложенных групп (group), закрытие групп - (groupClose)
 - проверка соответствия (ok/not)
 - проверка равенства (equal)
 - проверка существования (exist)
 - проверка несуществования (notExist)
 - форматный вывод в консоль (toConsole)
 - добавление комментария к проводимому тесту (comment)

Проведение тестов с фиксировнаием переменной (test):
 - на проверку соответствия строки\RegExp (isMatch)
 - на проверку НЕ соответствия строки\RegExp (isNotMatch)
 - на истинность (isDefined)
 - на ложность (isUndefined)
 - на соответствие ссылке\значению (в случае элементарных типов данных) (is)
 - на соответствие данным внутри объекта\значению (не рекурсивно) (isEqual)
 - на содержание опрежеделенных данных внутри переменной (isContain)

# Работа с yats. (Удобное описание возможностей YATS - http://xnim.ru/blog?id=38 )

Подлючение с помощью require.js: define(['path/to/yats'], function(yats) {...})

Подключение - <script type="text/javascript" src="pathTo/yats.js"></script>
Библиотека создает глобальный объект yats.

#Методы библиотеки:

Проверка на соответствие выражению:

yats.ok({Логическое выражение\переменная\функция}) -

  данная функция проводит проверку полученных данных на истинность.
  В случае функции проводится также проверка на вызов исключения.
  
yats.not({Логическое выражение\переменная\функция}) -

  данная функция проводит проверку полученных данных на истинность.
  В случае функции проводится также проверка на вызов исключения.

Примеры:

             yats.ok(1=='1') //Success
                 .ok(true)   //Success
                 .ok(function(){return true}) //Success
                 .not(1 == 3) //Success
                 .ok(function(){var x = a;} //Error - так как a не определена


Проверка равенства значений\ссылок:

yats.equal(значения через запятую) -

 проводит проверку на равенство ВСЕХ значений (в случае объектов - "единость" объекта на которого ссылаются переменные)

Примеры:

        yats.equal(1,1) //Success
            .equal(1,1,"1") //Success
            .equal(1,2) //Fail
            .equal(1,1,1,"1",1,1,1,1,"0001"); //Fail


Проверка существования:

yats.exist(переменные)

 Проводит проверку полученных данных на истинность

Примеры:

        var a = 1,b=3,c = 2, d;
        yats.exist(a) //Success
             .exist(a,b,c) //Success
             .exist(a,b,c,d) //Fail



Проверка несуществования:

yats.notExist(переменные)

Проверяет все аргументы на false.

Примеры:

        var a = false, b, c, d = 1;
        yats.notExist(a) //Success
            .notExist(a,b,c) //Success
            .notExist(a,b,c,d) //Fail


Добавление комментария к следующему тесту:

    yats.comment({string} текст) - Задает текст с следующему тесту

Пример:

        yats.comment("Это комментарий к тесту").check(1==1);

При выводе с помощью метода toConsole (описан ниже) - получим строку:
Это комментарий к тесту SuccessResult  - данная строка будет выделена синим цветом


Форматный вывод в консоль:

yats.toConsole() - выделяет успешные тесты синим, неуспешные красным, ошибки - темно-крансым, выводит статистику тестов (проведено, пройдено, ошибок и т.д.)
Также строит иерархию из заданных груп тестов и (если к тесту были заданы комментарии) выводит связку - комментарий теста + результат теста.

Пример:

            var a = false;
            yats.comment("Проверка ложности a").notExist(a).comment("Проверка истинности 1 и 1").equal(1,1).toConsole();


Группировка тестов:

yats.group({string} название группы,{string} описание группы, {function} функция)
создает группу тестов с заданным названием и описанием. (используется для построения иерархии (чтобы не вводить все тесты в один "слой"))
тесты, содержащиеся внутри группы определяются одним из двух способов:

1) определена функция внутри yats.group (третий аргумент) - в данном случае в группу тестов будут включены все тесты, которые определены в заданной функции.
2) функция в yats.group не определена. В этом случае все последующие тесты будут добавляться в заданную группу до исполнения функции:

yats.groupClose() - данная функция закрывает группу.

Пример:

         var a ={s:2,f:3};
         var b = a;
         yats
                 .group("equal","Тестирование соответствия Equal") //Открыта группа с именем equal
                    .comment("2 Числа").equal(1,1) //Success
                    .comment("Несколько чисел").equal(1,1,1,1,"1") //Success
                    .comment("Тест фейла").equal(1,"1","012") //Fail
                    .comment("еще один тест").equal(1,"1","01") //Fail
                    .comment("Тестирование объектов").equal(a,b) //Success
                 .groupClose()    //Закрыта группа с именем equal
                 .group("group_2","Группа, в которой содержщиеся тесты определены в функции, которая следует третьем аргументом",
                    function()
                    {
                        yats
                            .comment("Существование объектов").check(a)  //Success
                            .comment("Тестирования fail check").check(0) //Fail
                            .comment("Тестирование несуществования").notExist(null,undefined) //Success
                            .comment("Тестирование несуществования с 1").notExist(null,undefined,1); //Fail
                    })
                    .toConsole();

Цепочные вызовы - во всех примерах применяются цепочные вызовы. Существует только 1 функция, которая не позволяет продолжать цепочные вызовы: result:

yats.result() - получает результат прохождения последнего теста:

    yats.check(1 == 1).result() //Success


#Тестирование с "фиксированием" переменной

Для "фиксирования переменной используется метод test(переменная)
В этом случае создается дополнительный объект, который содержит методы для работы с выбранной переменной. Методы данного объекта начинаются с символов is:

isMatch({RegExp,String}) - проверяет переменную на соответствие строки или регулярному выражению,
isNotMatch({RegExp,String}) - проверяет переменную на НЕсоответствие строки или регулярному выражению

Пример:

            var str = "Hi! I'm YATS!";
            yats.test(str)
                 .isMatch(/[a-z]/g)//Success
                 .isMatch("name")  //Success
                 .isNotMatch(100)    //Success


isDefined() - Проверяет выбранную переменную на истинность,
isUndefined() - Проверяет выбранную переменную на ложность

Пример:

                  var str = "Hi! I'm YATS!";
                  yats.test(str)
                      .isDefined()//Success

is({object}) -Сравнивает две переменные. Если переменная элементарного типа - проверяет по значению, если ссылочного - проверяет равенство ссылок

Пример:

            var str = "Hi! I'm YATS!";
            yats.test(str).is("Hi! I'm YATS!");//Success
            var a = {a:2,b:3};
            var b = a;
            yats.test(a).is(b)//Success
                        .is({a:2,b:3});//Fail

isEqual({object}) - Сравнивает две переменные. Если переменная элементарного типа - проверяет по значению, если ссылочного - Производит проверку равенства объектов по свойствам. (причем свойства сверяются по ссылкам ( по значениям только элементарные)

Пример:

                   var str = "Hi! I'm YATS!";
                   yats.test(str).is("Hi! I'm YATS!");//Success
                   var a = {a:2,b:3};
                   var b = a;
                   yats.test(a).is(b)//Success
                               .is({a:2,b:3});//Success

isContain({object})  - проверяет содержит ли объект заданное свойство. Причем, если вместо объекта задана строка - проверяет, существует ли заданная подстрока. А если задан массив - существует ли заданный элемент.

Пример:
                                var str = "Hi! I'm YATS!";
                                yats.test(str).isContain("Hi! I'm YATS!");//Success
                                var a = {a:2,b:3};
                                var b = a;
                                yats.test(a).isContain(2);//Success

end()  - Возвращается к глобальному объекту yats (для цепочных вызовов) Пример использования - в файле примеров - example.html


#Более подробно
Более подробные примеры использования библиотеки находятся в файле example.html

#Планируется:

Расширенная информация о тесте
