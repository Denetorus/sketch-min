<?php

namespace controller\console;

use sketch\SK;

class TestController
{
    public function actionIndex()
    {
        return "\e[1;33mConsole test is execute\e[0m\n";
    }

    public function actionProps(){
        var_dump(SK::getProps());
        return "";
    }
}