<?php

namespace database\DBMain\object;

use database\DBMain\DBObject;

class contractors extends DBObject
{

    public $table_name = "contractors";

    public function getFields(): array
    {
        return [
          [ "name" => "uid","type" => "uuid",],
          [ "name" => "description","type" => "string",],
          [ "name" => "code","type" => "string",],
          [ "name" => "full_name","type" => "string",],
          [ "name" => "short_name","type" => "string",],
          [ "name" => "legal_person_name","type" => "string",],
          [ "name" => "legal_form","type" => "ref","refTable" => "legal_forms","refColumn" => "uid",],
          [ "name" => "contractor_type","type" => "ref","refTable" => "contractor_types","refColumn" => "uid",],
         ];
    }
}