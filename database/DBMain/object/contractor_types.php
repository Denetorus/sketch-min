<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class contractor_types extends DBObject
{

    public $table_name = "contractor_types";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "description","type" => "string",],
         ];
    }
}