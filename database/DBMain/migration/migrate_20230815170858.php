<?php

namespace database\DBMain\migration;
use sketch\database\schema\ObjectMigration;

class migrate_20230815170858 extends ObjectMigration
{
    public function up()
    {
        $this->migrateBySchema(json_decode('
            {
    "name": "public",
    "tables": {
        "toDelete": {
            "contractor": []
        },
        "toAdd": {
            "contractors": {
                "columns": {
                    "uid": {
                        "name": "uid",
                        "db_type": "uuid",
                        "not_null": true,
                        "default": "uuid_generate_v4()",
                        "primary_key": true
                    },
                    "description": {
                        "name": "description",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "code": {
                        "name": "code",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "full_name": {
                        "name": "full_name",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "short_name": {
                        "name": "short_name",
                        "db_type": "character varying",
                        "length": 100
                    },
                    "legal_person_name": {
                        "name": "legal_person_name",
                        "db_type": "character varying",
                        "length": 100
                    },
                    "legal_form": {
                        "name": "legal_form",
                        "db_type": "uuid"
                    },
                    "contractor_type": {
                        "name": "contractor_type",
                        "db_type": "uuid"
                    }
                }
            }
        },
        "toChange": {
            "city_types": {
                "columns": []
            },
            "region_types": {
                "columns": []
            },
            "street_types": {
                "columns": []
            },
            "countries": {
                "columns": []
            },
            "regions": {
                "columns": []
            },
            "legal_forms": {
                "columns": []
            },
            "contractor_types": {
                "columns": []
            },
            "contractor_economic_activities": {
                "columns": []
            },
            "contractor_requests": {
                "columns": []
            }
        }
    }
}
        ',true));
    }
}