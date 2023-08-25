<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\regions;

class RegionsController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new regions($ref);
    }
}