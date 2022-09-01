const generarToken = () => {
  const ramdom = Math.random().toString(32).substring(2);
  const fecha = Date.now().toString(32).substring(2);
  return ramdom + fecha;
};

export default generarToken;
