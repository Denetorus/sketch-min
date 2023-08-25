<?php

namespace database\DBMain\migration;
use sketch\database\schema\ObjectMigration;

class migrate_20230825153439 extends ObjectMigration
{
    public function up()
    {
        $this->migrateBySchema(json_decode('
            {
    "name": "public",
    "tables": {
        "toAdd": {
            "contractor_workers": {
                "columns": {
                    "uid": {
                        "name": "uid",
                        "db_type": "uuid",
                        "not_null": true,
                        "default": "uuid_generate_v4()",
                        "primary_key": true
                    },
                    "contractor_uid": {
                        "name": "contractor_uid",
                        "db_type": "uuid"
                    },
                    "description": {
                        "name": "description",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "name": {
                        "name": "name",
                        "db_type": "character varying",
                        "length": 15
                    },
                    "first_name": {
                        "name": "first_name",
                        "db_type": "character varying",
                        "length": 25
                    },
                    "last_name": {
                        "name": "last_name",
                        "db_type": "character varying",
                        "length": 15
                    },
                    "email": {
                        "name": "email",
                        "db_type": "character varying",
                        "length": 50
                    },
                    "phones": {
                        "name": "phones",
                        "db_type": "character varying",
                        "length": 50
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
            "contractors": {
                "columns": {
                    "toChange": {
                        "code": {
                            "new": {
                                "name": "code",
                                "db_type": "character varying",
                                "length": 15,
                                "not_null": false,
                                "default": "",
                                "primary_key": false
                            },
                            "old": {
                                "name": "code",
                                "db_type": "character varying",
                                "length": 255
                            }
                        }
                    }
                }
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