export interface Sorpresa {
  dia: number;
  titulo: string;
  mensaje: string;
  url_imagen?: string;
  tipo?: 'mensaje' | 'cupon' | 'recuerdo' | 'especial';
  codigo_cupon?: string;
  condicion_cupon?: string;
}

export const SORPRESAS_POR_DEFECTO: Sorpresa[] = [
  {
    dia: 1,
    titulo: "Bienvenida a nuestro Diciembre ✨",
    mensaje: "Empieza la cuenta atrás más mágica del año. Este calendario es solo un pequeño recordatorio de lo increíble que eres y lo afortunado que soy de tenerte a mi lado todos los días. ¡Prepárate para 24 días llenos de amor y sorpresas!",
    tipo: 'mensaje',
    url_imagen: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    dia: 2,
    titulo: "☕🥐 VALE POR: Desayuno en la cama",
    mensaje: "Válido por un desayuno completo servido sin alarmas el fin de semana que tú elijas. Tú solo tienes que despertar cuando quieras, relajarte y disfrutar de tu café o té favorito.",
    tipo: 'cupon',
    codigo_cupon: "LUCIA-02",
    condicion_cupon: "Canjeable cuando tú decidas con un beso ❤️"
  },
  {
    dia: 3,
    titulo: "Una razón por la que te quiero 💫",
    mensaje: "Me encanta tu forma de sonreír cuando algo te hace ilusión de verdad. Tienes esa luz que transforma cualquier día normal en un momento especial. Gracias por iluminar mi mundo.",
    tipo: 'mensaje'
  },
  {
    dia: 4,
    titulo: "Nuestra canción secreta 🎶",
    mensaje: "Cada vez que suena esa canción me acuerdo de ti, de tu risa y de cómo se me pasa el tiempo volando cuando estamos juntos. Hoy pon tu canción favorita y recuerda cuánto te quiero.",
    tipo: 'mensaje'
  },
  {
    dia: 5,
    titulo: "Noche de pelis y mantita 🎬🍿",
    mensaje: "Esta noche el plan lo mandas tú: tú eliges la película (aunque sea esa comedia romántica que ya has visto tres veces), las palomitas van por mi cuenta y la mantita compartida es obligatoria.",
    tipo: 'mensaje'
  },
  {
    dia: 6,
    titulo: "💆‍♀️✨ VALE POR: Sesión de masajes",
    mensaje: "Concede un masaje relajante de espalda, hombros o pies de 20 minutos, con crema hidratante, velitas y música suave para desconectar del estrés del día.",
    tipo: 'cupon',
    codigo_cupon: "LUCIA-06",
    condicion_cupon: "Válido cualquier noche que necesites desconectar ❤️"
  },
  {
    dia: 7,
    titulo: "Ese recuerdo que nunca olvido 📸",
    mensaje: "¿Te acuerdas de aquel día en el que no podíamos parar de reírnos por una tontería? Esos son mis momentos favoritos contigo: los sencillos, los reales, los que me hacen sentir en casa.",
    tipo: 'recuerdo',
    url_imagen: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    dia: 8,
    titulo: "Un café o chocolate caliente juntos ☕🍫",
    mensaje: "El frío de diciembre se cura con una buena taza caliente y tus manos entre las mías. Hoy nos tomamos ese café especial que tanto nos gusta sin ninguna prisa.",
    tipo: 'mensaje'
  },
  {
    dia: 9,
    titulo: "🍕🍣 VALE POR: Cena a tu elección",
    mensaje: "Hoy no se cocina, no se friega y no se discute. Tú eliges exactamente qué te apetece cenar: ¿pizza, sushi, hamburguesa o tu restaurante favorito? Yo invito y me encargo de todo.",
    tipo: 'cupon',
    codigo_cupon: "LUCIA-09",
    condicion_cupon: "Canjeable cualquier día de la semana ❤️"
  },
  {
    dia: 10,
    titulo: "Lo orgulloso que estoy de ti 🌟",
    mensaje: "A veces con las prisas del día a día se nos olvida decir lo importante: admiro tu fuerza, tu constancia y tu ternura. Eres una persona increíble y ver cómo creces cada día me llena de orgullo.",
    tipo: 'mensaje'
  },
  {
    dia: 11,
    titulo: "Paseo navideño por las luces 🎄✨",
    mensaje: "Hoy toca abrigarse bien, ponerse la bufanda y salir a caminar bajo las luces de Navidad de la ciudad agarrados de la mano. No hay mejor postal navideña que tú a mi lado.",
    tipo: 'mensaje'
  },
  {
    dia: 12,
    titulo: "Ecuador del calendario: ¡Mitad de sorpresas! 🎁",
    mensaje: "Ya hemos llegado a la mitad del mes. Espero que cada una de estas ventanitas te haya sacado una sonrisa. Lo mejor de todo es que lo más bonito aún está por llegar.",
    tipo: 'mensaje'
  },
  {
    dia: 13,
    titulo: "🫂 VALE POR: Abrazo recargador",
    mensaje: "Válido para venir a buscarme en cualquier instante, cerrar los ojos y pedirme un abrazo largo de un minuto sin decir nada. Para recargar energía en cualquier día duro.",
    tipo: 'cupon',
    codigo_cupon: "LUCIA-13",
    condicion_cupon: "Uso ilimitado cuando lo necesites ❤️"
  },
  {
    dia: 14,
    titulo: "Detalle dulce para hoy 🍬",
    mensaje: "Hoy tienes permitido el capricho más dulce del día. La vida contigo es mucho más bonita y dulce, así que hoy te mereces un premio extra.",
    tipo: 'mensaje'
  },
  {
    dia: 15,
    titulo: "Nuestros planes de futuro ✈️🗺️",
    mensaje: "Pensar en el próximo viaje, en los lugares que aún nos quedan por descubrir juntos y en todas las aventuras que nos esperan me hace inmensamente feliz. Donde sea, pero contigo.",
    tipo: 'mensaje'
  },
  {
    dia: 16,
    titulo: "🧹❌ VALE POR: Exención total de tareas",
    mensaje: "Hoy no mueves ni un solo dedo. Yo me encargo de recoger, limpiar, fregar y dejar todo perfecto. Tu única misión hoy es tumbarte, descansar y dejarte mimar.",
    tipo: 'cupon',
    codigo_cupon: "LUCIA-16",
    condicion_cupon: "Válido por un día entero de descanso para ti ❤️"
  },
  {
    dia: 17,
    titulo: "Lo que más me gusta de ti 💖",
    mensaje: "Tu mirada, tu bondad natural, cómo te preocupas por los que quieres y la calidez con la que me abrazas. Haces que el mundo sea un lugar infinitamente más bonito.",
    tipo: 'mensaje'
  },
  {
    dia: 18,
    titulo: "¡Solo una semana para Navidad! 🎅",
    mensaje: "Empieza la recta final del año. Da igual cuántas cosas pasen ahí fuera: tenerte a mi lado hace que cualquier época sea la mejor época. Gracias por ser mi mayor regalo.",
    tipo: 'mensaje'
  },
  {
    dia: 19,
    titulo: "Una promesa para el nuevo año 🤞",
    mensaje: "Te prometo seguir escuchándote con el mismo interés del primer día, seguir haciéndote reír en tus días malos y recordarte siempre lo valiosa e irreemplazable que eres.",
    tipo: 'mensaje'
  },
  {
    dia: 20,
    titulo: "Una noche mágica de juegos o risas 🎲",
    mensaje: "Hoy nos desconectamos de las pantallas un ratito y compartimos risas, juegos o simplemente una charla de esas que duran horas sin darnos cuenta de la hora que es.",
    tipo: 'mensaje'
  },
  {
    dia: 21,
    titulo: "🍦🍰 VALE POR: Tu dulce o postre favorito",
    mensaje: "Válido por ir juntos a esa pastelería, cafetería o heladería que tanto te gusta y pedir exactamente lo que se te antoje. ¡Sin remordimientos y con todo el disfrute!",
    tipo: 'cupon',
    codigo_cupon: "LUCIA-21",
    condicion_cupon: "Canjeable con antojo dulce garantizado ❤️"
  },
  {
    dia: 22,
    titulo: "La suerte de mi vida 🍀",
    mensaje: "Hoy se celebra la lotería de Navidad, pero yo ya sé que me tocó el premio gordo el día que entraste en mi vida. No hay premio más grande que compartir mis días contigo.",
    tipo: 'mensaje'
  },
  {
    dia: 23,
    titulo: "🕯️🍷 VALE POR: Cita romántica previa",
    mensaje: "Víspera de Nochebuena. Válido por una cena íntima a la luz de las velas, con una copa de vino, buena música de fondo y todo preparado para celebrar nosotros dos.",
    tipo: 'cupon',
    codigo_cupon: "LUCIA-23",
    condicion_cupon: "Canjeable con vestimenta elegante o pijama a juego ❤️"
  },
  {
    dia: 24,
    titulo: "🎁✨ NOCHEBUENA: Lo que tú quieras (Comodín de Oro)",
    mensaje: "¡Feliz Nochebuena, mi amor! Has llegado al final del calendario, pero nuestro viaje sigue cada día. Este es el Comodín Dorado: canjeable por cualquier deseo, plan, viaje o capricho que tú me pidas. Te amo con todo mi corazón. ¡Feliz Navidad, Lucía! ❤️",
    tipo: 'especial',
    codigo_cupon: "LUCIA-ORO-24",
    condicion_cupon: "Comodín supremo ilimitado canjeable por cualquier deseo ❤️",
    url_imagen: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?auto=format&fit=crop&w=800&q=80'
  }
];
