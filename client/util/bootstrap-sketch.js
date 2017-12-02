export function bootstrap(sketch, elem) {
  return (p) => {
    return sketch(p, elem);
  };
}
