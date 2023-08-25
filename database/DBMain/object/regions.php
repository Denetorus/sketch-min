<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class regions extends DBObject
{

    public $table_name = "regions";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "description","type" => "string",],
          [ "name" => "code","type" => "string",],
          [ "name" => "region_type","type" => "ref","refTable" => "region_types","refColumn" => "uid",],
          [ "name" => "country","type" => "ref","refTable" => "countries","refColumn" => "uid",],
         ];
    }
}