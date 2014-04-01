bd.mobile.XTemplateHelpers = {

  disableFormats: true,

  isFavorite: function(id) {
    return Ext.getStore('Favourites').findExact('market_id', id) > -1;
  },

  getCumulativeOdds: function(values) {
    var odds = [];

    // if DataStore array (betslip) otherwise, assume API json of a Bet
    if(_.isArray(values))
      odds = _.map(values, function(item) { return item.data.outcome.odds_fractional });
    else
      odds = _.map(values.data.legs, function(item) { return item.odds_fractional });

    return bd.lib.Odds.getCumulative(odds).show();
  },

  setLowerCase: function(str, stripSpaces) {
    if(!str) return false;
    stripSpaces = stripSpaces || false;
    return ( stripSpaces ? str.toLowerCase().replace(/ /gi, '_') : str.toLowerCase() );
  },

  isGameEnabled: function(free, paid) {
    return (free || paid);
  },

  shortenTitle: function(str) {
    return app.validateLength(str, 23)
  },

  formatDate: function(date, format) {
    return moment(date).format(format);
  },

  isLeafItem: function(values) {
    // Np type => check if any (sub)sections/events, otherwise treat as leaf item
    if(!values.type) {
      if(values.sections || values.events) return 'list_item';
      else return 'leaf';
    } else {
      return values.type;
    }

  },

  getHandicap: function(value) {
    return value == 0 ? '' : bd.lib.Number.format(value, { plusIfPlus: true, without00: true });
  },

  getPreferencedOdds: function(data) {
    if(data.odds_fractional == '-') return data.odds_fractional;
    return new bd.lib.Odds(data.odds_fractional).show();
  },

  isChallengeableBet: function(values) {
    var now = new Date(),
        utcNow = moment(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())),
        diff;

    diff = _.any(values.data.legs, function(leg) { return moment(leg.market.event.date).diff(utcNow) < 0 });

    return !diff && bd.game.game_id && bd.game.challenges.unlocked_count > 0 && bd.game.challenges.remaining_today > 0 && values.data.cumulative_odds <= 3.0 && !values.data.already_challenged;
  },

  parseTrophyList: function(range) {
    var status,
        str = 'assets/internal/awards/';

    _.each(range, function(item) {
      _.each(item.data.badges, function(badge) {
        if(badge.award_status != 'locked' || badge.clock_status != 'locked')
          status = badge;
      });
      item.data.current_status = status ? status : item.data.badges[0];

      status = null;
    });
    return range;

  },

  getRunner: function(data) {
    var runner, silkImage, clothNumber, teamName, form;

    runner = this.hasRunner(data);
    if(!runner)
      return data.name;

    silkImage = runner.silk_image || '';
    clothNumber = runner.cloth_number || '';
    teamName = runner.team_name || '';
    form = runner.form ? '<strong>Form</strong> '+ runner.form : '';

    return '<img src="'+ silkImage +'" class="silk" />' +
            '<div class="runner"><h4><strong>'+ clothNumber +'</strong> '+ runner.name +'</h4>' +
            '<h5>'+ teamName +'</h5>' + form + '</div>';
  },

  hasRunner: function(data) {
    var event = Ext.getStore('Event').getAt(0),
        sport = this.setLowerCase(event.data.sport, true);

    if(!event.data.runners || !/horse_racing/.test(sport))
      return false;

    return _.find(event.data.runners, function(item) { return item.name == data.name });
  },

  isNonRunner: function(data) {
    var hasRunnerInfo = this.hasRunner(data);
    if(data.non_runner || (hasRunnerInfo && hasRunnerInfo.non_runner))
      return "non_runner"
  }

};
