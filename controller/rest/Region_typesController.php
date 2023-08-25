<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\region_types;

class Region_typesController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new region_types($ref);
    }
}