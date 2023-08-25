<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class countries extends DBObject
{

    public $table_name = "countries";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "description","type" => "string",],
          [ "name" => "code","type" => "string",],
          [ "name" => "cca2","type" => "string",],
          [ "name" => "cca3","type" => "string",],
          [ "name" => "ccn3","type" => "string",],
          [ "name" => "international_name","type" => "string",],
         ];
    }
}