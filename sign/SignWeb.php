<?php

namespace sign;

use sketch\sign\SignBase;
use sketch\sign\model\SignDBModel;
use database\DBMain\DB;
use database\DBMain\object\users;

class SignWeb extends SignBase
{

    public function options()
    {

        return [
            'class' => new SignDBModel,
            'db' => new DB,
            'user' => new users()
        ];


    }


}
