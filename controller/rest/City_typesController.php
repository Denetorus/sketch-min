<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\city_types;

class City_typesController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new city_types($ref);
    }
}