<?php

namespace sign;

use sketch\sign\SignBase;
use sketch\sign\processor\SignProcessorError;

class SignError extends SignBase
{
    public function options():array
    {
        return [
            'class' => SignProcessorError::class,
        ];

    }

}