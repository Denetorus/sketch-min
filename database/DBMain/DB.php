<?php

namespace database\DBMain;

use sketch\database\DBBase;
use sketch\database\DBSQL\DBPostSQL;
use sketch\exceptions\ExceptionDatabaseConnectParamMissing;

class DB extends DBBase
{

    /**
     * @throws ExceptionDatabaseConnectParamMissing
     */
    public static function connect(): void
    {
        static::$DB = new DBPostSQL(static::getAttributes());
    }

}