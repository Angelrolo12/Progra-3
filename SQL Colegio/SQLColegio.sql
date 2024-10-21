create table Colegio (
	ColegioId int primary key identity (1,1),
	NombreColegio varchar (50) not null,
	Descripcion varchar (1000),
	Direccion varchar (50),
	Telefono varchar (50),
	CodigoPostal varchar (50),
	DireccionPostal varchar (50)
);

create table Clase (
	ClaseId int primary key identity (1,1),
	ColegioId int not null,
	NombreClase varchar (50) not null,
	Descripcion varchar (1000),
	foreign key (ColegioId) references Colegio(ColegioId)
);

create table Curso (
	CursoId int primary key identity (1,1),
	ColegioId int not null,
	NombreCurso varchar (50) not null,
	Descripcion varchar (1000),
	foreign key (ColegioId) references Colegio(ColegioId)
);

create table Profesor (
	ProfesorId int primary key identity (1,1),
	ColegioId int not null,
	NombreProfesor varchar (50) not null,
	Descripcion varchar (1000),
	foreign key (ColegioId) references Colegio(ColegioId)
);

create table Estudiante (
	EstudianteId int primary key identity (1,1),
	ClaseId int not null,
	NombreEstudiante varchar (100) not null,
	NumeroEstudiante varchar (20),
	NotasTotal float,
	Direccion varchar (100),
	Telefono varchar (20),
	Email varchar (100),
	foreign key (ClaseId) references Clase(ClaseId)
);

create table Estudiante_Curso (
	EstudianteId int not null,
	CursoId int not null,
	primary key (EstudianteId, CursoId),
	foreign key (EstudianteId) references Estudiante(EstudianteId),
	foreign key (CursoId) references Curso(CursoId)
);

create table Profesor_Curso (
	ProfesorId int not null,
	CursoId int not null,
	primary key (ProfesorId, CursoId),
	foreign key (ProfesorId) references Profesor(ProfesorId),
	foreign key (CursoId) references Curso(CursoId)
);

create table Notas (
	NotasId int primary key identity (1,1),
	EstudianteId int not null,
	CursoId int not null,
	Notas float,
	comentario varchar (1000),
	foreign key (EstudianteId) references Estudiante(EstudianteId),
	foreign key (CursoId) references Curso(CursoId)
);

