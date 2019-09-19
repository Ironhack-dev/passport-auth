const hbs = require('hbs');

hbs.registerHelper('checkCondition', (userRole, role, options) => {
  if (userRole === role) {
    return options.inverse(this);
  }
  return options.fn(this);
});
