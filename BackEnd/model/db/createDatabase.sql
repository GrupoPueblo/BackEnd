-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS colegio;

-- Usar la base de datos
USE colegio;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rango TINYINT NOT NULL CHECK (rango BETWEEN 1 AND 4) -- 1: Alumno, 2: Preceptor, 3: Profesor, 4: Directivo
);
-- rango es lo que define que muestra en la sidebar

-- Crear tabla de alumnos
CREATE TABLE IF NOT EXISTS alumno (
    id_alumno INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    curso VARCHAR(50) NOT NULL
);

-- Crear tabla de profesores
CREATE TABLE IF NOT EXISTS profesor (
    id_profesor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
);

-- Crear tabla de preceptores
CREATE TABLE IF NOT EXISTS preceptor (
    id_preceptor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
);

-- Crear tabla de directivos
CREATE TABLE IF NOT EXISTS directivo (
    id_directivo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
);
