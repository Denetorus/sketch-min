<?php

namespace sign;

use sketch\sign\processor\SignProcessorSuccess;
use sketch\sign\SignBase;

class SignConsole extends SignBase
{
    public function options():array
    {
        return [
            'class' => SignProcessorSuccess::class,
        ];

    }

}