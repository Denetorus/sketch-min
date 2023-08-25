<?php


namespace router;

class RouterRest extends \sketch\router\RouterRest
{

    public function routes():array
    {
        return [

            'test' => [
                'status' => -1
            ],
            'legal_types' => [
                'status' => -1
            ],
            'contractors' => [
                'status' => -1
            ],
            'region_types' => [
                'status' => -1
            ],
            'city_types' => [
                'status' => -1
            ],
            'street_types' => [
                'status' => -1
            ],
            'countries' => [
                'status' => -1
            ],
            'address' => [
                'status' => -1
            ],
            'regions' => [
                'status' => -1
            ],
            'cities' => [
                'status' => -1
            ],
            'streets' => [
                'status' => -1
            ],


        ];
    }
}