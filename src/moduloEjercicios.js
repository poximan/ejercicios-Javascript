import basededatos from './basededatos.js';


/**
 * Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
 */
export const promedioAnioEstreno = () => {
  // Ejemplo de como accedo a datos dentro de la base de datos
  // console.log(basededatos.peliculas);
  let total = 0

  for (let pelicula of basededatos.peliculas)
    total += pelicula["anio"]

  return total / basededatos.peliculas.length;
};

/**
 * Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
 * por parametro.
 * @param {number} promedio
 */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {
  return pelicuasConCriticaPromedio(promedio, mayor)
};

const mayor = (prueba, referenca) => {
  return prueba > referenca
}
const mayorIgual = (prueba, referenca) => {
  return prueba >= referenca
}

const pelicuasConCriticaPromedio = (promedio, comparador) => {

  let peliculas = []

  for (let pelicula of basededatos.peliculas) {
    let promedio_actual = promedioDeCriticaBypeliculaId(pelicula["id"])

    if (comparador(promedio_actual, promedio))
      peliculas.push({
        "pelicula": pelicula.nombre,
        "promedio": promedio_actual
      })
  }
  return peliculas;
};

/**
 * Devuelve la lista de peliculas de un director
 * @param {string} nombreDirector
 */
export const peliculasDeUnDirector = (nombreDirector) => {

  let director = basededatos.directores.filter(director => director.nombre === nombreDirector);
  if (director.length > 1)
    console.log("ERROR: no hay coincidencia precisa con nombre de director");
  else
    director = director[0]

  let peliculas = basededatos.peliculas.filter(pelicula => pelicula.directores.includes(director.id));

  let seleccion = []
  for (let pelicula of peliculas)
    seleccion.push(pelicula.nombre)

  return seleccion
};

/**
 * Devuelve el promedio de critica segun el id de la pelicula.
 * @param {number} peliculaId
 */
export const promedioDeCriticaBypeliculaId = (peliculaId) => {

  let total = 0,
    divisor = 0

  basededatos.calificaciones.forEach(calificacion => {
    if (calificacion.pelicula == peliculaId) {
      total += calificacion.puntuacion
      divisor++
    }
  })

  return (total / divisor).toPrecision(3);
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado:
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
export const obtenerPeliculasConPuntuacionExcelente = () => {
  // Ejemplo de como accedo a datos dentro de la base de datos
  // console.log(basededatos.peliculas);
  return basededatos.peliculas.filter(
    pelicula => basededatos.calificaciones.some((calificacion) => {
      return calificacion.pelicula == pelicula.id && calificacion.puntuacion >= 9
    }))
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico:
                    {
                        id: 3,
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    },
                    puntuacion: 5
                },
                { critico:
                    {
                        id: 2,
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    },
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {

  let pelicula = basededatos.peliculas.filter(pelicula => pelicula.nombre === nombrePelicula);
  if (pelicula.length > 1)
    console.log("ERROR: no hay coincidencia precisa con nombre de pelicula");
  else
    pelicula = pelicula[0]

  let directores = []
  for (let director of pelicula.directores)
    directores.push(basededatos.directores.find((director_actual) => director_actual.id == director))
  pelicula.directores = directores

  let generos = []
  for (let genero of pelicula.generos)
    generos.push(basededatos.generos.find((genero_actual) => genero_actual.id == genero))
  pelicula.generos = generos

  let calificaciones = basededatos.calificaciones.filter((calificacion) => {
    return calificacion.pelicula == pelicula.id
  })

  let criticas = []
  for (let calificacion of calificaciones)
    criticas.push(
      basededatos.criticos.find((critico) => { critico.id == calificacion.critico })
    )
  pelicula.criticas = criticas

  return pelicula;
};
