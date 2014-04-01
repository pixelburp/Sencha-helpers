bd.mobile.lib.AjaxHeaders = function() {
  this.headers = {
    'X-BetDash-Source': 'mobile',
    'X-BetDash-API-Token': '',
    'X-BetDash-Swrve-UID': ''
  };

  Ext.Ajax.setUseDefaultXhrHeader(false);
  this.setAll();
};

_.extend(bd.mobile.lib.AjaxHeaders.prototype, {

  reset: function() {
    this.setSwrve();
    this.setToken();
  },

  setAll: function(token) {
    this.setSource();
    this.setSwrve();
    this.setToken(token);
  },

  setSource: function() {
    return this.headers['X-BetDash-Source'] = (!app.isNative() || !window.device || !device.platform)  ? 'mobile' : this.getNativePlatform();
  },

  getNativePlatform: function() {
    var platform = device.platform.toLowerCase();
    return /iphone/.test(platform) ? 'iphone' : platform;
  },

  setSwrve: function() {
    if (bd.user.swrve_uid){
        bd.swrve.userSwrveUUID = bd.user.swrve_uid;
    }
    return this.headers['X-BetDash-Swrve-UID'] = bd.user.swrve_uid || bd.swrve.userSwrveUUID;
  },

  setToken: function(token) {
    this.headers['X-BetDash-API-Token'] = token || '';
    Ext.Ajax.setDefaultHeaders(this.headers);
  }
});
