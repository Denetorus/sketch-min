<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class contractor_economic_activities extends DBObject
{

    public $table_name = "contractor_economic_activities";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "contractor","type" => "ref","refTable" => "contractors","refColumn" => "uid",],
          [ "name" => "description","type" => "string",],
          [ "name" => "code","type" => "string",],
          [ "name" => "is_main","type" => "boolean",],
         ];
    }
}