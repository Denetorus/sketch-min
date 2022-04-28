<?php

namespace database\DBMain\migration\migrate_files;

use database\DBMain\migration\migrate;

class m200601_000000_create_user_table extends migrate
{
    public function up()
    {
        $this->db->createTable('users', [
                'id' => 'serial NOT NULL',
                'login' => 'character varying(255) NOT NULL',
                'auth_key' => 'character varying(36) NOT NULL',
                'password_hash' => 'character varying(255) NOT NULL',
                'password_reset_token' => ' character varying(255)',
                'email' => 'character varying(255)',
                'phone' => 'character varying(100)',
                'city' => 'character varying(100)',
                'zip' => 'character varying(10)',
                'address' => 'character varying(255)',
                'first_name' => 'character varying(255)',
                'last_name' => 'character varying(255)',
                'status' =>'smallint NOT NULL DEFAULT 10',
                'created_at' => 'integer NOT NULL',
                'updated_at' => 'integer NOT NULL',
            ],
            [
                'CONSTRAINT user_pkey PRIMARY KEY (id)',
                'CONSTRAINT user_username_key UNIQUE (login)'
            ]
        );


    }

    public function down()
    {
        $this->db->dropTable('users');
    }
}
