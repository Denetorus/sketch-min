<?php

namespace sign;

use sketch\sign\SignBase;
use sketch\sign\processor\SignProcessorDB;
use database\DBMain\object\users;

class SignWeb extends SignBase
{

    public function options():array
    {

        return [
            'class' => SignProcessorDB::class,
            'user' => new users()
        ];

    }




}
