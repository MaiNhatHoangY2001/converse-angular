const PAGE_LIST_EVENT = 'pageListEvent',
  PAGE_URL = 'pageURL',
  PAGE_BUTTON = 'pageButton',
  BASE_API = 'https://api-dev-tmtrav.tma-swerp.com',
  COOKIE_SOCTRIP_NAME = 'user-tracking',
  SELECT_BUTTON_KEY = 'selected-btn',
  EVENT_TRACKING_KEY = 'event-tracking-data',
  TRACKING_TYPE = { URL: 'URL', BUTTON: 'BUTTON' },
  MODE_TRACKING = { SETUP: 'setup', NORMAL: 'normal' },
  USER_TYPE = { ANONYMOUS: 'ANONYMOUS', SOCTRIP: 'SOCTRIP' },
  urlParams = new URLSearchParams(window.location.search),
  mode = urlParams.get('mode'),
  scriptTag = document.currentScript,
  pixelId = scriptTag.getAttribute('data-pixel-id');
let dimOverlay,
  switchContainer = document.createElement('div'),
  cancelDimBtnContainer = document.createElement('div'),
  eventTrackingData = [],
  userInfo = null,
  userType = USER_TYPE.ANONYMOUS;
function setCheckTrackingWhenNavigate() {
  window.addEventListener('popstate', () => {
    trackingEventPixel(eventTrackingData);
  }),
    (window.onload = () => {
      trackingEventPixel(eventTrackingData);
    }),
    (function (n) {
      const e = n.pushState,
        t = n.replaceState;
      (n.pushState = function (...t) {
        e.apply(n, t), trackingEventPixel(eventTrackingData);
      }),
        (n.replaceState = function (...e) {
          t.apply(n, e), trackingEventPixel(eventTrackingData);
        });
    })(window.history);
}
function getCookie(n) {
  const e = `; ${document.cookie}`.split(`; ${n}=`);
  if (2 === e.length) return e.pop().split(';').shift();
}
function getUserTracking() {
  const n = getCookie('user-tracking');
  if (n) {
    const e = JSON.parse(decodeURIComponent(n));
    (userInfo = e), (userType = USER_TYPE.SOCTRIP);
  } else (userInfo = null), (userType = USER_TYPE.ANONYMOUS);
}
function trackingEventPixel(n) {
  if (n && n.length) {
    const e = new URL(window.location.href),
      t = e.origin + e.pathname;
    n.forEach(n => {
      switch (n.tracking_type) {
        case TRACKING_TYPE.URL:
          n.url_contains === t && trackUserAction(n, e);
          break;
        case TRACKING_TYPE.BUTTON:
          const i = n.tracking_value.split('|')[0],
            o = document.getElementById(i);
          o &&
            o.addEventListener('click', () => {
              trackUserAction(n, e);
            });
      }
    });
  }
}
function trackUserAction(n, e) {
  const t = `${BASE_API}/pixel/events/tracking`,
    i = `${BASE_API}/regional/me`;
  let o = {
    pixel_code: pixelId,
    event_id: n.id,
    user_info: userInfo,
    json_object: '',
    connection_type: 'BROWSER',
    user_type: userType,
    device_type: 'W',
    url: e,
  };
  userInfo
    ? apiActionTracking(t, o)
    : fetch(i, { method: 'GET', headers: { Accept: 'application/json' } })
        .then(n => n.json())
        .then(n => {
          const e = n.data[0];
          (o.user_info = {
            country: e.country,
            country_code: e.country_code,
            state: e.region,
            city: e.city,
            zip_code: e.zip_code,
          }),
            apiActionTracking(t, o);
        });
}
function apiActionTracking(n, e) {
  fetch(n, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(e),
  });
}
function setOptionsEventTypes(n) {
  let e = document.querySelector('#soctripEventSetup #eventTypeURL'),
    t = document.querySelector('#soctripEventSetup #eventTypeButton');
  n.forEach(n => {
    const i = document.createElement('option');
    (i.value = n), (i.text = getEventNameValue(n));
    const o = document.createElement('option');
    (o.value = n), (o.text = getEventNameValue(n)), e.appendChild(i), t.appendChild(o);
  });
}
function setupEventPixel() {
  const n = document.createElement('style');
  (n.innerHTML = getCSSDialog()), document.head.appendChild(n);
  const e = getHTMLDialog();
  Object.assign(switchContainer.style, {
    position: 'fixed',
    top: '32px',
    left: '32px',
    zIndex: '1001',
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    padding: '5px 10px',
    borderRadius: '12px',
    border: '1px solid #eaecf0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  }),
    (switchContainer.innerHTML = e),
    document.body.appendChild(switchContainer),
    createCancelDimContainer();
}
function getEventTypes() {
  fetch(`${BASE_API}/pixel/event-types`, { method: 'GET', headers: { Accept: 'application/json' } })
    .then(n => n.json())
    .then(n => {
      setOptionsEventTypes(n.data);
    });
}
function openTab(n, e) {
  var t, i, o;
  for (i = document.querySelectorAll('#soctripEventSetup .tabcontent'), t = 0; t < i.length; t++)
    i[t].style.display = 'none';
  for (o = document.querySelectorAll('#soctripEventSetup .tablinks'), t = 0; t < o.length; t++)
    o[t].className = o[t].className.replace(' active', '');
  (document.getElementById(e).style.display = 'block'), (n.currentTarget.className += ' active');
}
function switchPage(n) {
  document.querySelectorAll('#soctripEventSetup .page').forEach(n => n.classList.remove('active')),
    document.getElementById(n).classList.add('active');
}
function onClickNextPage() {
  switch (document.querySelector('input[name="event-type"]:checked').value) {
    case TRACKING_TYPE.BUTTON:
      onChangeViewMode(!0);
      break;
    case TRACKING_TYPE.URL:
      switchPage(PAGE_URL);
  }
}
function onClickConfirm(n) {
  switch (n) {
    case TRACKING_TYPE.BUTTON:
      const n = document.querySelector('#soctripEventSetup #eventTypeButton').value,
        e = JSON.parse(localStorage.getItem(SELECT_BUTTON_KEY) || '');
      addEventTrackingData({
        id: null,
        event_type: n,
        url_contains: null,
        tracking_value: `${e.id}|${e.content}`,
        tracking_type: TRACKING_TYPE.BUTTON,
      }),
        switchPage('pageListEvent'),
        clearInput();
      break;
    case TRACKING_TYPE.URL:
      addEventTrackingData({
        id: null,
        event_type: document.querySelector('#soctripEventSetup #eventTypeURL').value,
        url_contains: document.querySelector('#soctripEventSetup #urlContain').value,
        tracking_value: null,
        tracking_type: TRACKING_TYPE.URL,
      }),
        switchPage('pageListEvent'),
        clearInput();
  }
}
function clearInput() {
  (document.querySelector('#soctripEventSetup #eventTypeURL').selectedIndex = 0),
    (document.querySelector('#soctripEventSetup #urlContain').value = '');
}
function addEventTrackingData(n) {
  eventTrackingData.push(n),
    localStorage.setItem(EVENT_TRACKING_KEY, JSON.stringify(eventTrackingData)),
    updateListEvent();
}
function setEventTrackingData(n, e = !1) {
  (eventTrackingData = n || []),
    localStorage.setItem(EVENT_TRACKING_KEY, JSON.stringify(n)),
    e && updateListEvent();
}
function updateListEvent() {
  let n = eventTrackingData.reduce(
    (n, e) => n + getEventItem(e.event_type, e.tracking_type, e.url_contains, e.tracking_value),
    '',
  );
  n || (n = 'No events found on this page. Click “Add event” to start adding events.'),
    (document.getElementById('listEvent').innerHTML = n);
}
function createDimOverlay() {
  (dimOverlay = document.createElement('div')),
    Object.assign(dimOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: '999',
      pointerEvents: 'none',
    }),
    document.body.appendChild(dimOverlay);
}
function removeDimOverlay() {
  document.body.removeChild(dimOverlay), (dimOverlay = null);
}
function onChangeViewMode(n) {
  n && !dimOverlay
    ? (createDimOverlay(),
      (switchContainer.style.visibility = 'hidden'),
      (cancelDimBtnContainer.style.visibility = 'visible'),
      (document.body.style.pointerEvents = 'none'),
      (switchContainer.style.pointerEvents = 'auto'),
      (cancelDimBtnContainer.style.pointerEvents = 'auto'),
      document
        .querySelectorAll('[id]:not(#soctripEventSetup, #soctripEventSetup [id])')
        .forEach(n => {
          Object.assign(n.style, { position: 'relative', zIndex: '1000', pointerEvents: 'none' }),
            n.setAttribute('data-tracked', !1),
            createOverlapButton(n);
        }))
    : !n &&
      dimOverlay &&
      ((document.body.style.pointerEvents = 'auto'),
      (switchContainer.style.visibility = 'visible'),
      (cancelDimBtnContainer.style.visibility = 'hidden'),
      removeDimOverlay(),
      document
        .querySelectorAll('[id]:not(#soctripEventSetup, #soctripEventSetup [id])')
        .forEach(n => {
          (n.style.position = ''),
            (n.style.zIndex = ''),
            (n.style.pointerEvents = 'auto'),
            n.removeAttribute('data-tracked'),
            removeOverlapButton();
        }));
}
function createOverlapButton(n) {
  const e = n.getBoundingClientRect(),
    t = document.createElement('button');
  t.classList.add('overlap-tracking-button'),
    (t.style.position = 'absolute'),
    (t.style.top = `${e.top}px`),
    (t.style.left = `${e.left}px`),
    (t.style.width = `${e.width}px`),
    (t.style.height = `${e.height}px`),
    (t.style.border = 'none'),
    (t.style.cursor = 'pointer'),
    (t.style.zIndex = '1001'),
    (t.style.pointerEvents = 'auto'),
    (t.onclick = () => setTrackingButton(n)),
    document.body.appendChild(t);
}
function removeOverlapButton() {
  const n = document.querySelectorAll('.overlap-tracking-button');
  n && n.forEach(n => n.remove());
}
function createCancelDimContainer() {
  Object.assign(cancelDimBtnContainer.style, {
    position: 'fixed',
    bottom: '48px',
    left: '40%',
    zIndex: '1001',
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    padding: '12px 24px 12px 24px',
    borderRadius: '12px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    width: '400px',
    visibility: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
  });
  const n = document.createElement('span');
  n.textContent = 'Click the button you want to track';
  const e = document.createElement('button');
  (e.style.cursor = 'pointer'),
    (e.textContent = 'Cancel'),
    (e.style.color = '#1570EF'),
    (e.onclick = () => {
      onChangeViewMode(!1);
    }),
    cancelDimBtnContainer.append(n, e),
    document.body.appendChild(cancelDimBtnContainer);
}
function setTrackingButton(n) {
  const e = { id: n.id, content: n.textContent };
  switchPage(PAGE_BUTTON),
    onChangeViewMode(!1),
    updateContentSelectButton(e),
    localStorage.setItem(SELECT_BUTTON_KEY, JSON.stringify(e));
}
function updateContentSelectButton(n) {
  document.querySelector('#soctripEventSetup #trackingButton').textContent =
    `Button with text “${n.content}” selected`;
}
function onClickFinishSetup() {
  const n = document.querySelector('#soctripEventSetup #exitSetupDialog');
  (switchContainer.style.visibility = 'hidden'),
    (n.style.visibility = 'visible'),
    createDimOverlay();
}
function onClickBackToEdit() {
  const n = document.querySelector('#soctripEventSetup #exitSetupDialog');
  (switchContainer.style.visibility = 'visible'),
    (n.style.visibility = 'hidden'),
    removeDimOverlay();
}
function onClickConfirmAndExit() {
  const n = { definitions: eventTrackingData };
  fetch(`${BASE_API}/pixel/events/pixels/${pixelId}/event-definitions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(n),
  }),
    window.close();
}
function getEventItem(n, e, t, i) {
  return `\n  <div style="display: flex; gap: 10px">\n  <span style="width: 40px; height: 40px; background-color: #f2f4f7; border-radius: 4px; align-self: center"></span>\n  <div style="display: flex; flex-direction: column; gap: 2px">\n    <span class="text-title">${getEventNameValue(n)}</span>\n    <span class="description" style="width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">\n      ${getStringEventItem(e, t, i)}\n    </span>\n  </div>\n</div>\n`;
}
function getEventNameValue(n) {
  return capitalizeFirstLetter(n.toLowerCase().replaceAll('_', ' '));
}
function capitalizeFirstLetter(n) {
  return String(n).charAt(0).toUpperCase() + String(n).slice(1);
}
function getStringEventItem(n, e, t) {
  return n == TRACKING_TYPE.BUTTON
    ? `Button with text “${t.split('|')[1]}” selected`
    : `URLs that contain ‘${e}’`;
}
function getHTMLDialog() {
  return '\n      <div id="soctripEventSetup">\n      <div\n        style="\n          width: 360px;\n          padding-top: 20px;\n          padding-bottom: 12px;\n          padding-left: 20px;\n          padding-right: 20px;\n          border-radius: 12px;\n        "\n      >\n        <div class="page active" id="pageListEvent">\n          <div style="display: flex; justify-content: space-between">\n            <span class="text-title" style="align-self: center">\n              Event builder\n            </span>\n            <button\n              onclick="onClickFinishSetup()"\n              style="\n                padding-left: 16px;\n                padding-right: 16px;\n                padding-top: 8px;\n                padding-bottom: 8px;\n                background: white;\n                border-radius: 8px;\n                overflow: hidden;\n                border: 1px #d0d5dd solid;\n                justify-content: center;\n                align-items: center;\n                gap: 8px;\n                display: inline-flex;\n                cursor: pointer;\n              "\n            >\n              <span\n                style="\n                  color: #101828;\n                  font-size: 14px;\n                  font-family: Inter;\n                  font-weight: 600;\n                  line-height: 20px;\n                "\n              >\n                Finish setup\n              </span>\n            </button>\n          </div>\n\n          <div class="tab">\n            <button\n              class="tablinks active"\n              onclick="openTab(event, \'currentEvent\')"\n            >\n              Events on page\n            </button>\n            <button class="tablinks" onclick="openTab(event, \'allEvent\')">\n              All events\n            </button>\n          </div>\n\n          <div id="currentEvent" class="tabcontent" style="display: block">\n            <div\n              style="\n                display: flex;\n                flex-direction: column;\n                gap: 16px;\n                padding-top: 16px;\n                padding-bottom: 16px;\n              "\n            >\n              <span id="listEvent">\n                \n              </span>\n              <button\n                onclick="switchPage(\'pageEvent\')"\n                class="btn"\n                style="background: #1570ef; border: none"\n              >\n                <span style="color: #fff"> Add event </span>\n              </button>\n              <div style="text-align: center">\n                <span class="text">Need help? Visit </span>\n                <a class="link" href="#"> Help center </a>\n                <span class="text"> or </span>\n                <a class="link" href="#">Report issue</a>\n                <span class="text"> . </span>\n              </div>\n            </div>\n          </div>\n\n          <div id="allEvent" class="tabcontent">\n            <span>\n              No events found on this page. Click “Add event” to start adding\n              events.\n            </span>\n          </div>\n        </div>\n\n        <div class="page" id="pageEvent">\n          <div style="display: flex; flex-direction: column; gap: 16px">\n            <span class="text-title">New event</span>\n            <span>Select a tracking method</span>\n            <label>\n              <input type="radio" name="event-type" value="BUTTON" checked />\n              <span class="radio-label">Button clicks</span>\n              <span class="description" style="margin-left: 20px"\n                >Track when a specific button or element is clicked. For\n                example, report an AddToCart event when someone clicks on the\n                add to cart button.</span\n              >\n            </label>\n            <label>\n              <input type="radio" name="event-type" value="URL" />\n              <span class="radio-label">URL visits</span>\n              <span class="description" style="margin-left: 20px"\n                >Track when a URL with a specific keyword is visited. For\n                example, report a ViewContent event when someone visits a URL\n                that contains “/product” keyword.</span\n              >\n            </label>\n            <div class="button-container">\n              <button\n                onclick="switchPage(\'pageListEvent\')"\n                class="btn"\n                style="background: #fff; border: 1px solid #d0d5dd"\n              >\n                <span style="color: #101828"> Cancel </span>\n              </button>\n              <button\n                onclick="onClickNextPage()"\n                class="btn"\n                style="background: #1570ef; border: none"\n              >\n                <span style="color: #fff"> Next </span>\n              </button>\n            </div>\n            <div style="text-align: center">\n                <span class="text">Need help? Visit </span>\n                <a class="link" href="#"> Help center </a>\n                <span class="text"> or </span>\n                <a class="link" href="#">Report issue</a>\n                <span class="text"> . </span>\n              </div>\n          </div>\n        </div>\n\n        <div class="page" id="pageURL">\n          <div style="display: flex; flex-direction: column; gap: 16px">\n            <span class="text-title">URL visits</span>\n            <div style="display: flex; flex-direction: column; gap: 4px">\n              <label for="eventTypeURL">Event type</label>\n              <select\n                style="\n                  width: 100%;\n                  border-radius: 8px;\n                  padding: 12px 8px 12px 8px;\n                  border: 1px solid #d0d5dd;\n                "\n                id="eventTypeURL"\n              >\n              </select>\n            </div>\n            <div style="display: flex; flex-direction: column; gap: 4px">\n              <label for="urlContain">URL contains</label>\n              <textarea\n                class="boxsizingBorder"\n                style="\n                  border-radius: 8px;\n                  border: 1px solid #d0d5dd;\n                  resize: none;\n                  padding: 12px 16px;\n                "\n                rows="5"\n                name="urlContain"\n                id="urlContain"\n              ></textarea>\n            </div>\n            <div class="button-container">\n              <button\n                onclick="switchPage(\'pageListEvent\')"\n                class="btn"\n                style="background: #fff; border: 1px solid #d0d5dd"\n              >\n                <span style="color: #101828"> Cancel </span>\n              </button>\n              <button\n                onclick="onClickConfirm(\'URL\')"\n                class="btn"\n                style="background: #1570ef; border: none"\n              >\n                <span style="color: #fff"> Confirm </span>\n              </button>\n            </div>\n            <div style="text-align: center">\n                <span class="text">Need help? Visit </span>\n                <a class="link" href="#"> Help center </a>\n                <span class="text"> or </span>\n                <a class="link" href="#">Report issue</a>\n                <span class="text"> . </span>\n              </div>\n          </div>\n        </div>\n\n        <div class="page" id="pageButton">\n          <div style="display: flex; flex-direction: column; gap: 16px">\n            <span class="text-title">Button clicks</span>\n            <div\n              style="\n                display: flex;\n                flex-direction: column;\n                gap: 8px;\n                background: #eff8ff;\n                border: radius 8px;\n                padding: 8px 12px 8px 12px;\n                border-radius: 8px;\n              "\n            >\n              <span id="trackingButton" class="radio-label"></span>\n            </div>\n            <div style="display: flex; flex-direction: column; gap: 4px">\n              <label for="eventTypeURL">Event type</label>\n              <select\n                style="\n                  width: 100%;\n                  border-radius: 8px;\n                  padding: 12px 8px 12px 8px;\n                  border: 1px solid #d0d5dd;\n                "\n                id="eventTypeButton"\n              >\n              </select>\n            </div>\n            <div class="button-container">\n              <button\n                onclick="switchPage(\'pageListEvent\')"\n                class="btn"\n                style="background: #fff; border: 1px solid #d0d5dd"\n              >\n                <span style="color: #101828"> Cancel </span>\n              </button>\n              <button\n                onclick="onClickConfirm(\'BUTTON\')"\n                class="btn"\n                style="background: #1570ef; border: none"\n              >\n                <span style="color: #fff"> Confirm </span>\n              </button>\n            </div>\n            <div style="text-align: center">\n                <span class="text">Need help? Visit </span>\n                <a class="link" href="#"> Help center </a>\n                <span class="text"> or </span>\n                <a class="link" href="#">Report issue</a>\n                <span class="text"> . </span>\n              </div>\n          </div>\n        </div>\n\n        <div id="exitSetupDialog">\n          <div style="display: flex; justify-content: space-between">\n            <span class="text-title" style="align-self:center;">Exit event builder</span>\n            <span\n              id="closeDialog"\n              style="font-size: 25px; cursor: pointer; user-select: none"\n              onclick="onClickBackToEdit()"\n              >&times;</span\n            >\n          </div>\n          <span>\n            Your changes have been saved. You can return to the pixel detail\n            page to view event details. The changes may take up to 30 minutes to\n            be effective.\n          </span>\n          <div style="display: flex; gap: 12px; justify-content: flex-end">\n            <button\n              onclick="onClickBackToEdit()"\n              class="btn"\n              style="\n                background: #fff;\n                border: 1px solid #d0d5dd;\n                width: fit-content;\n              "\n            >\n              <span style="color: #101828"> Back to edit </span>\n            </button>\n            <button\n              onclick="onClickConfirmAndExit()"\n              class="btn"\n              style="background: #1570ef; border: none; width: fit-content"\n            >\n              <span style="color: #fff"> Confirm & Exit </span>\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n    ';
}
function getCSSDialog() {
  return '\n     #soctripEventSetup .tab {\n        overflow: hidden;\n        border-bottom: 1px #eaecf0 solid;\n      }\n\n      #soctripEventSetup .tab button {\n        background-color: inherit;\n        float: left;\n        border: none;\n        outline: none;\n        cursor: pointer;\n        padding: 14px 16px;\n        transition: 0.3s;\n        font-size: 14px;\n        font-family: Inter;\n        font-weight: 600;\n        line-height: 20px;\n      }\n\n      #soctripEventSetup .tab button.active {\n        color: #1570ef;\n        border-bottom: 1px #1570ef solid;\n      }\n\n      #soctripEventSetup .tabcontent {\n        display: none;\n        padding: 6px 12px;\n      }\n\n      #soctripEventSetup .link {\n        color: #1570ef;\n        font-size: 12px;\n        font-family: Inter;\n        font-weight: 400;\n        line-height: 16px;\n        word-wrap: break-word;\n        text-decoration: none;\n      }\n\n      #soctripEventSetup .text {\n        color: #667085;\n        font-size: 12px;\n        font-family: Inter;\n        font-weight: 400;\n        line-height: 16px;\n        word-wrap: break-word;\n      }\n      #soctripEventSetup .page {\n        display: none;\n      }\n      #soctripEventSetup .page.active {\n        display: block;\n      }\n      #soctripEventSetup .button-container {\n        display: flex;\n        gap: 8px;\n      }\n      #soctripEventSetup .text-title {\n        font-size: 16px;\n        font-family: Inter;\n        font-weight: 600;\n        line-height: 24px;\n      }\n      #soctripEventSetup .text-normal {\n        font-size: 16px;\n        font-family: Inter;\n        font-weight: 600;\n        line-height: 24px;\n      }\n      #soctripEventSetup .radio-label {\n        color: #101828;\n        font-size: 14px;\n        font-family: Inter;\n        font-weight: 500;\n        line-height: 20px;\n      }\n      #soctripEventSetup .description {\n        display: block;\n        font-size: 14px;\n        color: #667085;\n        font-family: Inter;\n        font-weight: 400;\n        line-height: 20px;\n      }\n      #soctripEventSetup .btn {\n        width: 100%;\n        padding-left: 20px;\n        padding-right: 20px;\n        padding-top: 10px;\n        padding-bottom: 10px;\n        border-radius: 8px;\n        cursor: pointer;\n      }\n      #soctripEventSetup .btn > span {\n        font-size: 14px;\n        font-family: Inter;\n        font-weight: 600;\n        line-height: 20px;\n      }\n      #soctripEventSetup select:focus,\n      textarea:focus {\n        outline: none !important;\n        border: 1px solid #1570ef;\n      }\n      #soctripEventSetup .boxsizingBorder {\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n      }\n      #soctripEventSetup #exitSetupDialog {\n        position: fixed;\n        left: 35%;\n        bottom: 45%;\n        min-width: 588px;\n        max-width: 588px;\n        border-radius: 16px;\n        background-color: #fff;\n        padding: 24px;\n        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n        display: flex;\n        flex-direction: column;\n        gap: 24px;\n        border: 1px solid #eaecf0;\n        visibility: hidden;\n      }\n    ';
}
fetch(`${BASE_API}/pixel/events/pixels/${pixelId}`, {
  method: 'GET',
  headers: { Accept: 'application/json' },
})
  .then(n => n.json())
  .then(n => {
    mode === MODE_TRACKING.SETUP
      ? (getEventTypes(), setupEventPixel(), setEventTrackingData(n.data, !0))
      : (getUserTracking(), setEventTrackingData(n.data, !1), setCheckTrackingWhenNavigate());
  });
