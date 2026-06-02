<?php

namespace sign;

use sketch\sign\model\SignErrorModel;
use sketch\sign\processor\SignProcessorError;
use sketch\sign\SignBase;

class SignError extends SignBase
{
    public function options():array
    {
        return [
            'class' => SignProcessorError::class,
        ];

    }

}