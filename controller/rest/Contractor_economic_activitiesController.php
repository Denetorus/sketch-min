<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\contractor_economic_activities;

class Contractor_economic_activitiesController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new contractor_economic_activities($ref);
    }
}