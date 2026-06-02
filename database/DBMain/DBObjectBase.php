<?php

namespace database\DBMain;

use sketch\database\DBRecord\DBRecordFull;

class DBObjectBase extends DBRecordFull
{
    public function setDB(): void
    {
        $this->db = DB::getInstance();
    }


}