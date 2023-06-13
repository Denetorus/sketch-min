<?php

namespace database\DBMain;

use sketch\database\DBRecord\DBRecordFull;

class DBObject extends DBRecordFull
{

    public $key_name = 'uid';

    public function setDB(): void
    {
        $this->db = DB::getInstance();
    }


}