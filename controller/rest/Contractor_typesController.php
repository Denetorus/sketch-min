<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\contractor_types;

class Contractor_typesController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new contractor_types($ref);
    }
}