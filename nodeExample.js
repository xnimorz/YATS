//to execute run node nodeExample.js

var yats = require('./yats.js');

var a ={s:2,f:3, str:"str"};

yats
    .group("ok/not")
    .comment("Проверка выполнения функции, которая возвращает true (ok)").ok(function(){return true;})
    .comment("Тест функции, которая возвращает false (not)").not(function(){return false;})
    .comment("Тест выражения (not)").not(1==2)
    .comment("Тест undefined (not)").not(undefined)
    .comment("Существование объектов (ok)").ok(a)
    .comment("Тестирование boolean (not)").not(0)
    .groupClose().toConsole();
