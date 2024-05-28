-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema picchat
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema picchat
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `picchat` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `picchat` ;

-- -----------------------------------------------------
-- Table `picchat`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `picchat`.`user` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `nickname` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `picchat`.`consultant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `picchat`.`consultant` (
  `idConsultant` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `dialog` MEDIUMTEXT NULL DEFAULT NULL,
  `summary` MEDIUMTEXT NULL DEFAULT NULL,
  `userId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idConsultant`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `consultant_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `picchat`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `picchat`.`survey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `picchat`.`survey` (
  `idSurvey` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL DEFAULT NULL,
  `consultantId` INT NULL DEFAULT NULL,
  `feedback` ENUM('좋음', '싫음') NOT NULL,
  PRIMARY KEY (`idSurvey`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  INDEX `consultantId` (`consultantId` ASC) VISIBLE,
  CONSTRAINT `survey_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `picchat`.`user` (`idUser`),
  CONSTRAINT `survey_ibfk_2`
    FOREIGN KEY (`consultantId`)
    REFERENCES `picchat`.`consultant` (`idConsultant`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
