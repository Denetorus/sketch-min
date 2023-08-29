<?php

namespace router;

class RouterConsole extends \sketch\router\RouterConsole
{

    public function routes():array
    {
        return [

            'test' => [
                'internal' => true,
            ],

            'props' => [
                'path' => 'test/props',
            ],

            'migrate' => [
                'internal' => true,
            ],

            'users' => [
                'internal' => true,
            ],

        ];
    }

}
