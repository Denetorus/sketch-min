<?php

namespace controller\console;

use database\DBMain\DB;
use sketch\database\DBMigrate;
use sketch\database\schema\DBSchema;
use sketch\database\schema\DBSchemaMigrateConstructor;
use sketch\SK;

class MigrateController
{

    public $old_schema_file = ROOT."/database/DBMain/db_public_schema.json";
    public $new_schema_file = ROOT."/database/DBMain/db_public_schema_new.json";

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

        $prev_schema = new DBSchema('public');
        $prev_schema->loadByFile($this->old_schema_file);

        $next_schema = new DBSchema('public');
        $next_schema->loadByFile($this->new_schema_file);

        $constructor = new DBSchemaMigrateConstructor($prev_schema, $next_schema);
        $constructor->findDifference();
        $constructor->generateMigrateFile(
            ROOT."\database\DBMain\migration",
            "namespace database\DBMain\migration;
use sketch\database\schema\ObjectMigration;"
        );

        unlink($this->old_schema_file);
        copy($this->new_schema_file, $this->old_schema_file);

        echo "\e[1;32mFinish migrate generation\e[0m\n";

    }

    public function actionObjects(){

        echo "\e[1;32mStart create objects\e[0m\n";

        if (!is_file($this->old_schema_file))
            exit("Schema file is unavailable: $this->old_schema_file");

        $schema = json_decode(file_get_contents($this->old_schema_file), true);
        if (!is_array($schema) || !isset($schema['name']))
            exit("Schema file don't contains the correct schema: $this->old_schema_file");

        $directory = ROOT.'/database/DBMain/object';
        foreach ($schema['tables'] as $table_name=>$table) {
            if ($table_name==='users') continue;
            $class_name = $table_name;
            $objectTable = '['.PHP_EOL;
            foreach ($table['columns'] as $column_name=>$column){
                if (!isset($column['uid'])){
                    exit('Undefined "uid" in table "'.$table_name.'"');
                }
                $objectTable .='          [ ';
                if (isset($column['uid'])) {
                    $objectTable .='"name" => "'.$column['uid'].'",';
                }
                if (isset($column['type'])) {
                    $objectTable .='"type" => "'.$column['type'].'",';
                }
                if (isset($column['refTable'])) {
                    $objectTable .='"refTable" => "'.$column['refTable'].'",';
                }
                $objectTable .='],'.PHP_EOL;
            }
            $objectTable .='         ]';
            $content = <<<EOT
<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class $class_name extends DBObject
{

    public \$table_name = "$table_name";

    public function getFields(): array
    {
        return $objectTable;
    }
}
EOT;

            file_put_contents($directory."/".$class_name.".php", $content);

        }



        echo "\e[1;32mFinish create objects\e[0m\n";

    }

    public function actionRest(){

        echo "\e[1;32mStart create rest controllers\e[0m\n";

        if (!is_file($this->old_schema_file))
            exit("Schema file is unavailable: $this->old_schema_file");

        $schema = json_decode(file_get_contents($this->old_schema_file), true);
        if (!is_array($schema) || !isset($schema['name']))
            exit("Schema file don't contains the correct schema: $this->old_schema_file");

        $directory = ROOT.'/controller/rest';
        foreach ($schema['tables'] as $table_name=>$table) {
            if ($table_name==='users') continue;
            $class_name = ucfirst($table_name.'Controller');
            $content = <<<EOT
<?php

namespace controller\\rest;

use database\DBMain\DBObject;
use database\DBMain\object\\$table_name;

class $class_name extends ControllerRestSK
{

    public function getNewObject(\$ref=null, \$notCreated=false): DBObject
    {
        return new $table_name(\$ref);
    }
}
EOT;

            file_put_contents($directory."/".$class_name.".php", $content);

        }

        echo "\e[1;32mFinish rest controllers\e[0m\n";

    }

}