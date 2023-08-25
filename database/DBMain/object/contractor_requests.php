<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class contractor_requests extends DBObject
{

    public $table_name = "contractor_requests";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "contractor","type" => "ref","refTable" => "contractors","refColumn" => "uid",],
          [ "name" => "description","type" => "string",],
          [ "name" => "request_date","type" => "datetime",],
          [ "name" => "content","type" => "text",],
         ];
    }
}