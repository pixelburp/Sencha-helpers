bd.mobile.Form = {

  validate: function(id) {
    var query;
    if(!id) return false;

    // if Cmp itself is a form
    query = Ext.ComponentQuery.query('#'+id);
    if(query.length == 0)
      return false;

    if(query[0].getBaseCls() == 'x-form')
      return this.parseFields(query[0], id);

    // Otherwise check for any children
    query = Ext.ComponentQuery.query('#'+id+' formpanel');
    if(query.length == 0)
      return false;

    return this.parseFields(query[0], id);
  },

  parseFields: function(query, id) {
    var self = this,
        value, placeHolder,
        errors = [],
        fields = query.getFields();

    $('.x-field', '#'+id).removeClass('x-field-error');
    _.each(fields, function(field) {

      if(typeof field.getValue != 'function') return 0;
      value = field.getValue();

      // Allow for fields to be completely ignored.
      if(field.ignore) return 0;

      if((field.getRequired() || field.xtype == 'passwordfield') && !field.getHidden()) {

        switch(field.xtype.toLowerCase()) {
          case 'numberfield':
            if(!value || value <= 0) errors.push(field.getName());
            break;
          case 'passwordfield':
            if(value === '') errors.push(field.getName());
            break;
          case 'datepickerfield':
            placeHolder = field.getPlaceHolder();
            if(!value && (placeHolder === '' || !placeHolder)) errors.push(field.getName());
            break;
          case 'checkboxfield':
            if(!field.getChecked()) errors.push(field.getName());
            break;
          default:
            if(!value || value === '') errors.push(field.getName());
            break;
        }

        // validate email fields, if any
        if(field.getName() == 'email') {
          if(!self.isValidEmail(value)) errors.push(field.getName());
        }

        // validate date o' birth, if any
        if(field.getName() == 'dob') {
          if(!self.isValidDob(field)) errors.push(field.getName());
        }

      }
    });

    if(errors.length == 0)
      return true;

    // If a t&c checkbox remains...
    if(errors.length == 1 && errors[0] == 'agree')
      Ext.Msg.alert('', 'You must agree to the Terms & Conditions');

    _.each(errors, function(name) {
      $('.x-field.' + name, '#'+id).addClass('x-field-error');
    });
    return false;
  },

  isValidEmail: function(address) {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(address);
  },

  isValidDob: function(field) {
    if(!field.getValue()) return false;
    var now = new Date(),
        dob = field.getValue(),
        diff = now - dob,
        years = Math.floor(diff / (1000*60*60*24*365));

    return years > 18;
  },

  parseCardDate: function(value) {
    if (value) {
      value = value.split('/').reverse();
      result = value[0] + '-' + value[1] + '-01';
    }
    else {
      result = '';
    }

    return result;
  }
};
