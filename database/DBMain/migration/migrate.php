<?php

namespace database\DBMain\migration;

use database\DBMain\DB;
use sketch\database\MigrateBase;

class migrate extends MigrateBase
{
    public function __construct()
    {
        $this->db = DB::getInstance();
    }
}
