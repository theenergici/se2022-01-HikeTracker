CREATE TABLE IF NOT EXISTS `Users`(
    `Id` TEXT PRIMARY KEY,
    `Hash` TEXT NOT NULL,
    `Salt` TEXT NOT NULL,
    `Role` VARCHAR(255) NOT NULL,
    `code` INTEGER NOT NULL,
    `verified` TINYINT(1) NOT NULL,
    `Name` TEXT NOT NULL,
    `Surname` TEXT NOT NULL,
    `Phone` INTEGER NULL
);
CREATE TABLE IF NOT EXISTS `LocalGuides`(
    `id` TEXT PRIMARY KEY
    `user` TEXT,
    FOREIGN KEY(`user`) REFERENCES `Users`(`Id`)

);
CREATE TABLE IF NOT EXISTS `ReferencePoints`(
    `RefPointID` INTEGER PRIMARY KEY,
    `description` TEXT,
    `Lat` NUMERIC,
    `Lng` NUMERIC,
    `Type` TEXT
);
CREATE TABLE IF NOT EXISTS `HutWorkers`(
    `id` TEXT NOT NULL PRIMARY KEY
    `user` TEXT,
    FOREIGN KEY(`user`) REFERENCES `Users`(`Id`)
);
CREATE TABLE IF NOT EXISTS `Hiker`(
    `id` TEXT PRIMARY KEY NOT NULL
    `user` TEXT,
    FOREIGN KEY(`user`) REFERENCES `Users`(`Id`)
);
CREATE TABLE IF NOT EXISTS `Hikes`(
    `HikeID` INTEGER PRIMARY KEY,
    `Title` TEXT,
    `Description` TEXT,
    `Ascent` INTEGER,
    `Difficulty` TEXT,
    `ExpectedTime` TIME,
    `Country` TEXT,
    `Region` TEXT,
    `Province` TEXT,
    `City` TEXT,
    `GpxFile` TEXT UNIQUE,
    `Start` FLOAT,
    `End` FLOAT,
    `AssociatedGuide` TEXT,
    `Length` FLOAT,
    `Picture` VARCHAR(255),
    FOREIGN KEY(`AssociatedGuide`) REFERENCES `LocalGuides`(`id`)
);
CREATE TABLE IF NOT EXISTS `Huts`(
    `RefPointID` INTEGER NOT NULL PRIMARY KEY,
    `Name` TEXT UNIQUE,
    `HutManagerID` TEXT,
    `Website` TEXT NULL,
    `Phone` INTEGER NULL,
    `AvgPrice` DOUBLE(8, 2) NULL,
    `WhenOpen` TEXT NULL,
    `Elevation` DOUBLE(8, 2) NULL,
    `Beds` INTEGER NULL,
    `Province` TEXT NULL,
    `Country` TEXT NULL,
    `Region` TEXT NULL,
    `City` TEXT NULL,
    `Description` TEXT,
    `Picture` VARCHAR(255),
    FOREIGN KEY(`HutManagerID`) REFERENCES `HutWorkers`(`id`)
);
CREATE TABLE IF NOT EXISTS `ParkingLots`(
    `ParkingID` INTEGER NOT NULL PRIMARY KEY,
    `AssociatedGuide` TEXT,
    `NumAuto` INTEGER,
    `Free` INTEGER,
    FOREIGN KEY(`AssociatedGuide`) REFERENCES `LocalGuides`(`id`)
);
CREATE TABLE IF NOT EXISTS `pictures`(
    `NameFile` TEXT PRIMARY KEY NOT NULL,
    `associatedPoint` INTEGER NULL,
    `HikeID` INTEGER NULL,
    FOREIGN KEY(`associatedPoint`) REFERENCES `ReferencePoints`(`id`),
    FOREIGN KEY(`associatedPoint`) REFERENCES `Huts`(`id`)
);
CREATE TABLE IF NOT EXISTS `PointsOfHike`(
    `HikeID` INTEGER NOT NULL,
    `PointID` INTEGER NOT NULL,
    `IsStart` TINYINT(1),
    `IsEnd` TINYINT(1),
    PRIMARY KEY(`HikeID`,`PointID`),
    FOREIGN KEY(`PointID`) REFERENCES `ReferencePoints`(`id`),
    FOREIGN KEY(`HikeID`) REFERENCES `Hikes`(`HikeID`)
);
CREATE TABLE IF NOT EXISTS `ActiveHikePoints`(
    `id` INTEGER NOT NULL PRIMARY KEY,
    `HikeID` INTEGER NOT NULL,
    `PointID` INTEGER NOT NULL,
    `HikerID` TEXT NOT NULL,
    `ArrivalTime` NUMERIC,
    FOREIGN KEY(`HikeID`) REFERENCES `Hikes`(`HikeID`),
    FOREIGN KEY(`PointID`) REFERENCES `ReferencePoints`(`id`),
    FOREIGN KEY(`HikerID`) REFERENCES `Users`(`Id`)
)