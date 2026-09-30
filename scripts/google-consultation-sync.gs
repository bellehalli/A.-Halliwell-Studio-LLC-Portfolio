// Install in the Google account that owns the consultation booking calendar.
// Keep secrets in Script Properties, never in this file.
function bookingDigest_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function (byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
}
function sendBooking_(booking, config) {
  var raw = JSON.stringify(booking), timestamp = String(Math.floor(Date.now() / 1000));
  var signature = Utilities.computeHmacSha256Signature(timestamp + '.' + raw, config.secret, Utilities.Charset.UTF_8)
    .map(function (byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
  var response = UrlFetchApp.fetch(config.url, {
    method: 'post', contentType: 'application/json', payload: raw, muteHttpExceptions: true,
    headers: { 'x-booking-timestamp': timestamp, 'x-booking-signature': signature }
  });
  if (response.getResponseCode() !== 200 || !JSON.parse(response.getContentText()).ok) {
    throw new Error('Booking sync rejected; it will retry on the next run. HTTP ' + response.getResponseCode());
  }
}
function syncConsultations() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    var props = PropertiesService.getScriptProperties(), settings = props.getProperties();
    var config = { calendarId: settings.BOOKING_CALENDAR_ID, prefix: settings.BOOKING_TITLE_PREFIX,
      secret: settings.BOOKING_WEBHOOK_SECRET,
      url: settings.BOOKING_WEBHOOK_URL || 'https://www.ahalliwellstudio.com/api/consultations/webhook' };
    if (!config.calendarId || !config.prefix || !config.secret) throw new Error('Set all required booking Script Properties first.');
    if (!/^https:\/\//.test(config.url)) throw new Error('Webhook must use HTTPS.');
    var from = new Date(Date.now() - 86400000), to = new Date(Date.now() + 90 * 86400000), observed = {};
    var events = [], pageToken;
    do {
      var page = Calendar.Events.list(config.calendarId, { timeMin: from.toISOString(), timeMax: to.toISOString(), singleEvents: true, showDeleted: false, maxResults: 2500, pageToken: pageToken });
      events = events.concat(page.items || []);
      pageToken = page.nextPageToken;
    } while (pageToken);
    events.forEach(function (event) {
      if ((event.summary || '').indexOf(config.prefix) !== 0 || event.status !== 'confirmed' || !event.start.dateTime || !event.end.dateTime) return;
      var guests = (event.attendees || []).filter(function (guest) {
        return guest.email && !guest.self && !guest.organizer
          && guest.email.toLowerCase() !== config.calendarId.toLowerCase()
          && guest.email.toLowerCase() !== ((event.organizer || {}).email || '').toLowerCase();
      });
      // Appointment slots without a booked guest and unrelated group meetings are excluded.
      if (guests.length !== 1) return;
      var booking = { bookingId: config.calendarId + ':' + event.id, name: (guests[0].displayName || guests[0].email).slice(0, 100),
        email: guests[0].email, startsAt: new Date(event.start.dateTime).toISOString(), endsAt: new Date(event.end.dateTime).toISOString(),
        updatedAt: event.updated, status: 'confirmed',
        details: (event.description || '').replace(/<[^>]*>/g, ' ').slice(0, 5000) };
      var key = 'AHS_BOOKING_' + bookingDigest_(booking.bookingId), fingerprint = bookingDigest_(JSON.stringify(booking));
      observed[key] = true;
      var previous = settings[key] ? JSON.parse(settings[key]) : null;
      if (previous && previous.fingerprint === fingerprint) return;
      sendBooking_(booking, config);
      // No appointment descriptions retained in Script Properties.
      booking.details = '';
      props.setProperty(key, JSON.stringify({ eventId: event.id, fingerprint: fingerprint, booking: booking }));
    });
    Object.keys(settings).filter(function (key) { return key.indexOf('AHS_BOOKING_') === 0 && !observed[key]; }).forEach(function (key) {
      var previous = JSON.parse(settings[key]);
      if (Date.parse(previous.booking.endsAt) < from.getTime()) { props.deleteProperty(key); return; }
      // A moved appointment outside the scan window is not a cancellation.
      var event = Calendar.Events.get(config.calendarId, previous.eventId);
      if (event.status !== 'cancelled') return;
      previous.booking.status = 'cancelled';
      previous.booking.updatedAt = event.updated || new Date().toISOString();
      sendBooking_(previous.booking, config);
      props.deleteProperty(key);
    });
  } finally { lock.releaseLock(); }
}
function installConsultationSync() {
  ScriptApp.getProjectTriggers().filter(function (trigger) { return trigger.getHandlerFunction() === 'syncConsultations'; })
    .forEach(function (trigger) { ScriptApp.deleteTrigger(trigger); });
  ScriptApp.newTrigger('syncConsultations').timeBased().everyMinutes(5).create();
}
