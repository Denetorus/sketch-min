<?php

namespace sign;

use sketch\sign\model\SignWithoutModel;
use sketch\sign\SignBase;

class SignConsole extends SignBase
{
    public function options()
    {
        return [
            'class' => new SignWithoutModel(),
        ];

    }

}