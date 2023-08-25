<?php

namespace database\DBMain\migration;
use sketch\database\schema\ObjectMigration;

class migrate_20230814184417 extends ObjectMigration
{
    public function up()
    {
        $this->migrateBySchema(json_decode('
            {
    "name": "public",
    "tables": {
        "toAdd": {
            "city_types": {
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
                    }
                }
            },
            "region_types": {
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
                    }
                }
            },
            "street_types": {
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
                    }
                }
            },
            "countries": {
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
                    "cca2": {
                        "name": "cca2",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "cca3": {
                        "name": "cca3",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "ccn3": {
                        "name": "ccn3",
                        "db_type": "character varying",
                        "length": 255
                    },
                    "international_name": {
                        "name": "international_name",
                        "db_type": "character varying",
                        "length": 255
                    }
                }
            },
            "regions": {
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
                    "region_type": {
                        "name": "region_type",
                        "db_type": "uuid"
                    },
                    "country": {
                        "name": "country",
                        "db_type": "uuid"
                    }
                }
            },
            "legal_forms": {
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
                    }
                }
            },
            "contractor_types": {
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
                        "length": 100
                    }
                }
            },
            "contractor": {
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
            },
            "contractor_economic_activities": {
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
                    "code": {
                        "name": "code",
                        "db_type": "character varying",
                        "length": 20
                    },
                    "is_main": {
                        "name": "is_main",
                        "db_type": "boolean"
                    }
                }
            },
            "contractor_requests": {
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
                    "request_date": {
                        "name": "request_date",
                        "db_type": "timestamp"
                    },
                    "content": {
                        "name": "content",
                        "db_type": "text"
                    }
                }
            }
        }
    }
}
        ',true));
    }
}