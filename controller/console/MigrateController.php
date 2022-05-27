<?php

namespace controller\console;

use database\DBMain\DB;
use sketch\database\DBMigrate;
use sketch\database\schema\DBSchema;
use sketch\database\schema\DBSchemaMigrateConstructor;
use sketch\SK;

class MigrateController
{
    public function actionIndex()
    {
        echo "\e[1;33mStart migration\e[0m\n";

        var_dump(SK::getProps());

        $migrate = new DBMigrate(
            DB::getInstance(),
            ROOT."/database/DBMain/migration",
            "\database\DBMain\migration"
        );
        $migrate->run();

        echo "\e[1;33mFinish migration\e[0m\n";
    }

    public function actionGenerate()
    {

        echo "\e[1;32mStart migrate generation\e[0m\n";

        $old_schema_file = ROOT."/database/DBMain/db_public_schema.json";
        $new_schema_file = ROOT."/database/DBMain/db_public_schema_new.json";

        $prev_schema = new DBSchema('public');
        $prev_schema->loadByFile($old_schema_file);

        $next_schema = new DBSchema('public');
        $next_schema->loadByFile($new_schema_file);

        $constructor = new DBSchemaMigrateConstructor($prev_schema, $next_schema);
        $constructor->findDifference();
        $constructor->generateMigrateFile(
            ROOT."\database\DBMain\migration",
            "namespace database\DBMain\migration;
use sketch\database\schema\ObjectMigration;"
        );

        unlink($old_schema_file);
        copy($new_schema_file, $old_schema_file);

        echo "\e[1;32mFinish migrate generation\e[0m\n";

    }


}