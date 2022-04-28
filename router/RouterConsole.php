<?php

namespace router;

use sketch\router\RouterBase;

class RouterConsole extends RouterBase
{

    public function routesAvailableWithoutSignIn(){
        return [

            'test' => [
                'path' => 'test',
                'status' => -1
            ],

            'props' => [
                'path' => 'test/props',
                'status' => -1
            ],

            'migrate' => [
                'path' => 'migrate',
                'status' => -1
            ],

            'users' => [
                'path' => 'users',
                'status' => -1
            ],

        ];
    }

}
