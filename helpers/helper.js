const hbs = require('hbs');

hbs.registerHelper('checkCondition', (user, role, options) => {
  if (user.role === role) {
    return options.fn(this);
  }
  return options.inverse(this);
});
