<?php

namespace database\DBMain\migration;
use sketch\database\schema\ObjectMigration;

class migrate_20220527091217 extends ObjectMigration
{
    public function up()
    {
        $this->migrateBySchema(json_decode('
            {
    "name": "public",
    "tables": {
        "toAdd": {
            "users": {
                "columns": {
                    "id": {
                        "name": "id",
                        "db_type": "serial",
                        "not_null": true,
                        "primary_key": true
                    },
                    "login": {
                        "name": "login",
                        "db_type": "character varying",
                        "length": 255,
                        "not_null": true
                    },
                    "password_hash": {
                        "name": "password_hash",
                        "db_type": "character varying",
                        "length": 255,
                        "not_null": true
                    },
                    "token": {
                        "name": "token",
                        "db_type": "character varying",
                        "length": 255,
                        "not_null": true
                    },
                    "status": {
                        "name": "status",
                        "db_type": "smallint",
                        "not_null": true,
                        "default": 1
                    },
                    "rights": {
                        "name": "rights",
                        "db_type": "jsonb"
                    },
                    "auth_key": {
                        "name": "auth_key",
                        "db_type": "character varying",
                        "length": 36,
                        "not_null": true
                    },
                    "password_reset_token": {
                        "name": "password_reset_token",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "email": {
                        "name": "email",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "phone": {
                        "name": "phone",
                        "db_type": "character varying",
                        "length": 100
                    },
                    "first_name": {
                        "name": "first_name",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "last_name": {
                        "name": "last_name",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "created_at": {
                        "name": "created_at",
                        "db_type": "integer",
                        "not_null": true
                    },
                    "updated_at": {
                        "name": "updated_at",
                        "db_type": "integer",
                        "not_null": true
                    }
                }
            }
        }
    }
}
        ',true));
    }
}