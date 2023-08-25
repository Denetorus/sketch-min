<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\street_types;

class Street_typesController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new street_types($ref);
    }
}