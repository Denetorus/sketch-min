<?php

namespace controller\console;

use sketch\SK;

class TestController
{
    public function actionIndex(): string
    {
        return "\e[1;33mConsole test is execute\e[0m\n";
    }

    public function actionProps(): string
    {
        var_dump(SK::getProps());
        return "";
    }
}