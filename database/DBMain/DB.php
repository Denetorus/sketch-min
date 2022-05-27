<?php

namespace database\DBMain;

use sketch\database\DBBase;
use sketch\database\DBSQL\DBPostSQL;

class DB extends DBBase
{

    public static function connect(): void
    {
        static::$DB = new DBPostSQL(static::getAttributes());
    }

}