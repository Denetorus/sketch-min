<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class city_types extends DBObject
{

    public $table_name = "city_types";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "description","type" => "string",],
          [ "name" => "code","type" => "string",],
         ];
    }
}