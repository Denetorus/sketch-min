<?php

namespace sign;

use sketch\sign\SignBase;

class SignWeb extends SignBase
{

    public function options():array
    {

        return [
            'class' => 'sketch\sign\model\SignWithoutModel',
        ];


    }


}
