<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class legal_forms extends DBObject
{

    public $table_name = "legal_forms";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "description","type" => "string",],
          [ "name" => "code","type" => "string",],
         ];
    }
}