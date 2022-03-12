type Parameter = string | Record<string, boolean> | undefined;

export default function classnames(...params: Parameter[]) {
  let className = '';

  params.forEach((param) => {
    if (param === undefined) {
      // Do nothing
    } else if (typeof param === 'string') {
      className += ` ${param}`;
    } else {
      Object.keys(param).forEach((key) => {
        if (param[key]) {
          className += ` ${key}`;
        }
      });
    }
  });

  return className.trim();
}
