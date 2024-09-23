using System;
using System.Collections.Generic;

public class Estudiante
{
    public string Nombre { get; set; }
    private int Edad { get; set; }
    public double Promedio { get; set; }

    public Estudiante(string nombre, int edad, double promedio)
    {
        Nombre = nombre;
        Edad = edad;
        Promedio = promedio;
    }

    public bool EsMayorDeEdad()
    {
        return Edad >= 18;
    }

    public void MostrarInfo()
    {
        Console.WriteLine($"Nombre: {Nombre}, Promedio: {Promedio}");
    }
}

public class Programa
{
    public static void Main(string[] args)
    {
        Console.Write("¿Cuántos estudiantes deseas registrar? ");
        int cantidadEstudiantes = int.Parse(Console.ReadLine());

        List<Estudiante> estudiantes = new List<Estudiante>();

        for (int i = 0; i < cantidadEstudiantes; i++)
        {
            Console.WriteLine($"--- Estudiante {i + 1} ---");

            Console.Write("Nombre: ");
            string nombre = Console.ReadLine();

            Console.Write("Edad: ");
            int edad = int.Parse(Console.ReadLine());

            Console.Write("Promedio: ");
            double promedio = double.Parse(Console.ReadLine());

            estudiantes.Add(new Estudiante(nombre, edad, promedio));
        }

        Console.WriteLine("\n--- Estudiantes con promedio mayor o igual a 70 ---");

        int contador = 0;
        while (contador < estudiantes.Count)
        {
            Estudiante estudiante = estudiantes[contador];

            if (estudiante.Promedio >= 70)
            {
                estudiante.MostrarInfo();

                if (estudiante.EsMayorDeEdad())
                {
                    Console.WriteLine($"{estudiante.Nombre} es mayor de edad.");
                }
                else
                {
                    Console.WriteLine($"{estudiante.Nombre} es menor de edad.");
                }
            }

            contador++;
        }
    }
}
