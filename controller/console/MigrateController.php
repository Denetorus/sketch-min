<?php

namespace controller\console;

use database\DBMain\migration\migrate;

class MigrateController
{
    public function actionIndex()
    {
        $migrate = new migrate();
        return $migrate->run();
    }


}