<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\countries;

class CountriesController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new countries($ref);
    }
}