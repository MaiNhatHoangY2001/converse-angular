const PAGE_LIST_EVENT = 'pageListEvent';
const PAGE_URL = 'pageURL';
const PAGE_BUTTON = 'pageButton';
const BASE_API = 'https://api-dev-tmtrav.tma-swerp.com';
const COOKIE_SOCTRIP_NAME = 'user-tracking';
const SELECT_BUTTON_KEY = 'selected-btn';
const EVENT_TRACKING_KEY = 'event-tracking-data';

const TRACKING_TYPE = {
  URL: 'URL',
  BUTTON: 'BUTTON'
};

const MODE_TRACKING = {
  SETUP: 'setup',
  NORMAL: 'normal'
};

const USER_TYPE = {
  ANONYMOUS: 'ANONYMOUS',
  SOCTRIP: 'SOCTRIP'
};

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const scriptTag = document.currentScript;
const pixelId = scriptTag.getAttribute('data-pixel-id');
let switchContainer = document.createElement('div');
let cancelDimBtnContainer = document.createElement('div');
let eventTrackingData = [];
let userInfo = null;
let userType = USER_TYPE.ANONYMOUS;
let dimOverlay;

(function () {
  const url = `${BASE_API}/pixel/events/pixels/${pixelId}`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .then(res => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://tmtrav-dev.tma-swerp.com';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
      const cookie = iframe.contentWindow.document.cookie;
      console.log(cookie);

      //   if (mode === MODE_TRACKING.SETUP) {
      //     getEventTypes();
      //     setupEventPixel();
      //     setEventTrackingData(res.data, true);
      //   } else {
      //     getUserTracking();
      //     setEventTrackingData(res.data, false);
      //     setCheckTrackingWhenNavigate();
      //   }
    });
})();

function setCheckTrackingWhenNavigate() {
  window.addEventListener('popstate', () => {
    trackingEventPixel(eventTrackingData);
  });

  window.onload = () => {
    trackingEventPixel(eventTrackingData);
  };

  // Overwrite `pushState` and `replaceState` to detect programmatic navigation
  (function (history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function (...args) {
      pushState.apply(history, args);
      trackingEventPixel(eventTrackingData);
    };

    history.replaceState = function (...args) {
      replaceState.apply(history, args);
      trackingEventPixel(eventTrackingData);
    };
  })(window.history);
}

function getCookie(cookie, name) {
  function escape(s) {
    return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
  }
  var match = cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

function getUserTracking() {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://tmtrav-dev.tma-swerp.com';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);
  const cookie = iframe.contentWindow.document.cookie;
  const userCookie = getCookie(cookie, COOKIE_SOCTRIP_NAME);
  if (userCookie) {
    const user = JSON.parse(decodeURIComponent(userCookie));
    userInfo = user;
    userType = USER_TYPE.SOCTRIP;
  } else {
    userInfo = { user_id: generateUUID() };
    userType = USER_TYPE.ANONYMOUS;
  }
}

function trackingEventPixel(events) {
  if (events && events.length) {
    const fullUrl = new URL(window.location.href);
    const cleanUrl = fullUrl.origin + fullUrl.pathname;
    events.forEach(event => {
      switch (event.tracking_type) {
        case TRACKING_TYPE.URL:
          if (event.url_contains === cleanUrl) {
            trackUserAction(event, fullUrl);
          }
          break;
        case TRACKING_TYPE.BUTTON:
          const buttonId = event.tracking_value.split('|')[0];
          const element = document.getElementById(buttonId);
          if (element) {
            element.addEventListener('click', () => {
              trackUserAction(event, fullUrl);
            });
          }
          break;
      }
    });
  }
}

function trackUserAction(event, fullUrl) {
  const url = `${BASE_API}/pixel/events/tracking`;
  const userInfoUrl = `${BASE_API}/regional/me`;
  let body = {
    pixel_code: pixelId,
    event_id: event.id,
    user_info: userInfo,
    json_object: '',
    connection_type: 'BROWSER',
    user_type: userType,
    device_type: 'W',
    url: fullUrl
  };
  if (!userInfo) {
    fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(res => {
        const location = res.data[0];
        body.user_info = {
          country: location.country,
          country_code: location.country_code,
          state: location.region,
          city: location.city,
          zip_code: location.zip_code
        };
        apiActionTracking(url, body);
      });
  } else apiActionTracking(url, body);
}

function apiActionTracking(url, body) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

function setOptionsEventTypes(eventTypes) {
  let eventTypeUrl = document.querySelector('#soctripEventSetup #eventTypeURL');
  let eventTypeButton = document.querySelector('#soctripEventSetup #eventTypeButton');

  eventTypes.forEach(item => {
    const optionElementUrl = document.createElement('option');
    optionElementUrl.value = item;
    optionElementUrl.text = getEventNameValue(item);

    const optionElementBtn = document.createElement('option');
    optionElementBtn.value = item;
    optionElementBtn.text = getEventNameValue(item);

    eventTypeUrl.appendChild(optionElementUrl);
    eventTypeButton.appendChild(optionElementBtn);
  });
}

function setupEventPixel() {
  const style = document.createElement('style');
  style.innerHTML = getCSSDialog();
  document.head.appendChild(style);
  const htmlContent = getHTMLDialog();

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
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
  });
  switchContainer.innerHTML = htmlContent;
  document.body.appendChild(switchContainer);
  createCancelDimContainer();
}

function getEventTypes() {
  const url = `${BASE_API}/pixel/event-types`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .then(res => {
      setOptionsEventTypes(res.data);
    });
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.querySelectorAll('#soctripEventSetup .tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  tablinks = document.querySelectorAll('#soctripEventSetup .tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

function switchPage(pageId) {
  document.querySelectorAll('#soctripEventSetup .page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function onClickNextPage() {
  const selectedOption = document.querySelector('input[name="event-type"]:checked').value;

  switch (selectedOption) {
    case TRACKING_TYPE.BUTTON:
      onChangeViewMode(true);
      break;
    case TRACKING_TYPE.URL:
      switchPage(PAGE_URL);
      break;
  }
}

function onClickConfirm(selectedOption) {
  switch (selectedOption) {
    case TRACKING_TYPE.BUTTON:
      const eventTypeBtn = document.querySelector('#soctripEventSetup #eventTypeButton').value;
      const selectBtn = JSON.parse(localStorage.getItem(SELECT_BUTTON_KEY) || '');
      const eventBtn = {
        id: null,
        event_type: eventTypeBtn,
        url_contains: null,
        tracking_value: `${selectBtn.id}|${selectBtn.content}`,
        tracking_type: TRACKING_TYPE.BUTTON
      };
      addEventTrackingData(eventBtn);
      switchPage(PAGE_LIST_EVENT);
      clearInput();
      break;
    case TRACKING_TYPE.URL:
      const eventTypeUrl = document.querySelector('#soctripEventSetup #eventTypeURL').value;
      const urlContain = document.querySelector('#soctripEventSetup #urlContain').value;
      const eventUrl = {
        id: null,
        event_type: eventTypeUrl,
        url_contains: urlContain,
        tracking_value: null,
        tracking_type: TRACKING_TYPE.URL
      };
      addEventTrackingData(eventUrl);
      switchPage(PAGE_LIST_EVENT);
      clearInput();
      break;
  }
}

function clearInput() {
  document.querySelector('#soctripEventSetup #eventTypeURL').selectedIndex = 0;
  document.querySelector('#soctripEventSetup #urlContain').value = '';
}

function addEventTrackingData(event) {
  eventTrackingData.push(event);
  localStorage.setItem(EVENT_TRACKING_KEY, JSON.stringify(eventTrackingData));
  updateListEvent();
}

function setEventTrackingData(event, isSetup = false) {
  eventTrackingData = event || [];
  localStorage.setItem(EVENT_TRACKING_KEY, JSON.stringify(event));
  if (isSetup) updateListEvent();
}

function updateListEvent() {
  let eventItemHtml = eventTrackingData.reduce(
    (eventItemHtml, event) =>
      (eventItemHtml += getEventItem(event.event_type, event.tracking_type, event.url_contains, event.tracking_value)),
    ''
  );
  if (!eventItemHtml) eventItemHtml = 'No events found on this page. Click “Add event” to start adding events.';
  document.getElementById('listEvent').innerHTML = eventItemHtml;
}

function createDimOverlay() {
  dimOverlay = document.createElement('div');
  Object.assign(dimOverlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: '999',
    pointerEvents: 'none'
  });
  document.body.appendChild(dimOverlay);
}

function removeDimOverlay() {
  document.body.removeChild(dimOverlay);
  dimOverlay = null;
}

function onChangeViewMode(enable) {
  if (enable && !dimOverlay) {
    createDimOverlay();
    switchContainer.style.visibility = 'hidden';
    cancelDimBtnContainer.style.visibility = 'visible';
    document.body.style.pointerEvents = 'none';
    switchContainer.style.pointerEvents = 'auto';
    cancelDimBtnContainer.style.pointerEvents = 'auto';
    document.querySelectorAll('[id]:not(#soctripEventSetup, #soctripEventSetup [id])').forEach(element => {
      Object.assign(element.style, {
        position: 'relative',
        zIndex: '1000',
        pointerEvents: 'none'
      });
      element.setAttribute('data-tracked', false);
      createOverlapButton(element);
    });
  } else if (!enable && dimOverlay) {
    document.body.style.pointerEvents = 'auto';
    switchContainer.style.visibility = 'visible';
    cancelDimBtnContainer.style.visibility = 'hidden';
    removeDimOverlay();
    document.querySelectorAll('[id]:not(#soctripEventSetup, #soctripEventSetup [id])').forEach(element => {
      element.style.position = '';
      element.style.zIndex = '';
      element.style.pointerEvents = 'auto';
      element.removeAttribute('data-tracked');
      removeOverlapButton();
    });
  }
}

function createOverlapButton(element) {
  const rect = element.getBoundingClientRect();
  const overlappingButton = document.createElement('button');
  overlappingButton.classList.add('overlap-tracking-button');
  overlappingButton.style.position = 'absolute';
  overlappingButton.style.top = `${rect.top}px`;
  overlappingButton.style.left = `${rect.left}px`;
  overlappingButton.style.width = `${rect.width}px`;
  overlappingButton.style.height = `${rect.height}px`;
  overlappingButton.style.border = 'none';
  overlappingButton.style.cursor = 'pointer';
  overlappingButton.style.zIndex = '1001';
  overlappingButton.style.pointerEvents = 'auto';
  overlappingButton.onclick = () => setTrackingButton(element);
  document.body.appendChild(overlappingButton);
}

function removeOverlapButton() {
  const overlapButtons = document.querySelectorAll('.overlap-tracking-button');
  if (overlapButtons) {
    overlapButtons.forEach(element => element.remove());
  }
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
    justifyContent: 'space-between'
  });

  const switchText = document.createElement('span');
  switchText.textContent = 'Click the button you want to track';

  const button = document.createElement('button');
  button.style.cursor = 'pointer';
  button.textContent = 'Cancel';
  button.style.color = '#1570EF';
  button.onclick = () => {
    onChangeViewMode(false);
  };

  cancelDimBtnContainer.append(switchText, button);
  document.body.appendChild(cancelDimBtnContainer);
}

function setTrackingButton(element) {
  const selectButton = {
    id: element.id,
    content: element.textContent
  };
  switchPage(PAGE_BUTTON);
  onChangeViewMode(false);
  updateContentSelectButton(selectButton);
  localStorage.setItem(SELECT_BUTTON_KEY, JSON.stringify(selectButton));
}

function updateContentSelectButton(selectButton) {
  const element = document.querySelector('#soctripEventSetup #trackingButton');
  element.textContent = `Button with text “${selectButton.content}” selected`;
}

function onClickFinishSetup() {
  const confirmExitContainer = document.querySelector('#soctripEventSetup #exitSetupDialog');
  switchContainer.style.visibility = 'hidden';
  confirmExitContainer.style.visibility = 'visible';
  createDimOverlay();
}

function onClickBackToEdit() {
  const confirmExitContainer = document.querySelector('#soctripEventSetup #exitSetupDialog');
  switchContainer.style.visibility = 'visible';
  confirmExitContainer.style.visibility = 'hidden';
  removeDimOverlay();
}

function onClickConfirmAndExit() {
  const url = `${BASE_API}/pixel/events/pixels/${pixelId}/event-definitions`;
  const data = {
    definitions: eventTrackingData
  };
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  window.close();
}

function generateUUID() {
  return '99999999-9999-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, c => {
    const randomValue = crypto.getRandomValues(new Uint8Array(1))[0] & 15; // Generate a random 4-bit value
    return randomValue.toString(16); // Convert the value to a hexadecimal string
  });
}

function getEventItem(name, trackingType, urlContain, btnContent) {
  const eventName = getEventNameValue(name);
  return `
  <div style="display: flex; gap: 10px">
  <span style="width: 40px; height: 40px; background-color: #f2f4f7; border-radius: 4px; align-self: center"></span>
  <div style="display: flex; flex-direction: column; gap: 2px">
    <span class="text-title">${eventName}</span>
    <span class="description" style="width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
      ${getStringEventItem(trackingType, urlContain, btnContent)}
    </span>
  </div>
</div>
`;
}

function getEventNameValue(name) {
  const nameLowerCase = name.toLowerCase().replaceAll('_', ' ');
  return capitalizeFirstLetter(nameLowerCase);
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function getStringEventItem(trackingType, urlContain, btnContent) {
  if (trackingType == TRACKING_TYPE.BUTTON) {
    return `Button with text “${btnContent.split('|')[1]}” selected`;
  }
  return `URLs that contain ‘${urlContain}’`;
}

function getHTMLDialog() {
  return `
      <div id="soctripEventSetup">
      <div
        style="
          width: 360px;
          padding-top: 20px;
          padding-bottom: 12px;
          padding-left: 20px;
          padding-right: 20px;
          border-radius: 12px;
        "
      >
        <div class="page active" id="pageListEvent">
          <div style="display: flex; justify-content: space-between">
            <span class="text-title" style="align-self: center">
              Event builder
            </span>
            <button
              onclick="onClickFinishSetup()"
              style="
                padding-left: 16px;
                padding-right: 16px;
                padding-top: 8px;
                padding-bottom: 8px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                border: 1px #d0d5dd solid;
                justify-content: center;
                align-items: center;
                gap: 8px;
                display: inline-flex;
                cursor: pointer;
              "
            >
              <span
                style="
                  color: #101828;
                  font-size: 14px;
                  font-family: Inter;
                  font-weight: 600;
                  line-height: 20px;
                "
              >
                Finish setup
              </span>
            </button>
          </div>

          <div class="tab">
            <button
              class="tablinks active"
              onclick="openTab(event, 'currentEvent')"
            >
              Events on page
            </button>
            <button class="tablinks" onclick="openTab(event, 'allEvent')">
              All events
            </button>
          </div>

          <div id="currentEvent" class="tabcontent" style="display: block">
            <div
              style="
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding-top: 16px;
                padding-bottom: 16px;
              "
            >
              <span id="listEvent">
                
              </span>
              <button
                onclick="switchPage('pageEvent')"
                class="btn"
                style="background: #1570ef; border: none"
              >
                <span style="color: #fff"> Add event </span>
              </button>
              <div style="text-align: center">
                <span class="text">Need help? Visit </span>
                <a class="link" href="#"> Help center </a>
                <span class="text"> or </span>
                <a class="link" href="#">Report issue</a>
                <span class="text"> . </span>
              </div>
            </div>
          </div>

          <div id="allEvent" class="tabcontent">
            <span>
              No events found on this page. Click “Add event” to start adding
              events.
            </span>
          </div>
        </div>

        <div class="page" id="pageEvent">
          <div style="display: flex; flex-direction: column; gap: 16px">
            <span class="text-title">New event</span>
            <span>Select a tracking method</span>
            <label>
              <input type="radio" name="event-type" value="BUTTON" checked />
              <span class="radio-label">Button clicks</span>
              <span class="description" style="margin-left: 20px"
                >Track when a specific button or element is clicked. For
                example, report an AddToCart event when someone clicks on the
                add to cart button.</span
              >
            </label>
            <label>
              <input type="radio" name="event-type" value="URL" />
              <span class="radio-label">URL visits</span>
              <span class="description" style="margin-left: 20px"
                >Track when a URL with a specific keyword is visited. For
                example, report a ViewContent event when someone visits a URL
                that contains “/product” keyword.</span
              >
            </label>
            <div class="button-container">
              <button
                onclick="switchPage('pageListEvent')"
                class="btn"
                style="background: #fff; border: 1px solid #d0d5dd"
              >
                <span style="color: #101828"> Cancel </span>
              </button>
              <button
                onclick="onClickNextPage()"
                class="btn"
                style="background: #1570ef; border: none"
              >
                <span style="color: #fff"> Next </span>
              </button>
            </div>
            <div style="text-align: center">
                <span class="text">Need help? Visit </span>
                <a class="link" href="#"> Help center </a>
                <span class="text"> or </span>
                <a class="link" href="#">Report issue</a>
                <span class="text"> . </span>
              </div>
          </div>
        </div>

        <div class="page" id="pageURL">
          <div style="display: flex; flex-direction: column; gap: 16px">
            <span class="text-title">URL visits</span>
            <div style="display: flex; flex-direction: column; gap: 4px">
              <label for="eventTypeURL">Event type</label>
              <select
                style="
                  width: 100%;
                  border-radius: 8px;
                  padding: 12px 8px 12px 8px;
                  border: 1px solid #d0d5dd;
                "
                id="eventTypeURL"
              >
              </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px">
              <label for="urlContain">URL contains</label>
              <textarea
                class="boxsizingBorder"
                style="
                  border-radius: 8px;
                  border: 1px solid #d0d5dd;
                  resize: none;
                  padding: 12px 16px;
                "
                rows="5"
                name="urlContain"
                id="urlContain"
              ></textarea>
            </div>
            <div class="button-container">
              <button
                onclick="switchPage('pageListEvent')"
                class="btn"
                style="background: #fff; border: 1px solid #d0d5dd"
              >
                <span style="color: #101828"> Cancel </span>
              </button>
              <button
                onclick="onClickConfirm('URL')"
                class="btn"
                style="background: #1570ef; border: none"
              >
                <span style="color: #fff"> Confirm </span>
              </button>
            </div>
            <div style="text-align: center">
                <span class="text">Need help? Visit </span>
                <a class="link" href="#"> Help center </a>
                <span class="text"> or </span>
                <a class="link" href="#">Report issue</a>
                <span class="text"> . </span>
              </div>
          </div>
        </div>

        <div class="page" id="pageButton">
          <div style="display: flex; flex-direction: column; gap: 16px">
            <span class="text-title">Button clicks</span>
            <div
              style="
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: #eff8ff;
                border: radius 8px;
                padding: 8px 12px 8px 12px;
                border-radius: 8px;
              "
            >
              <span id="trackingButton" class="radio-label"></span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px">
              <label for="eventTypeURL">Event type</label>
              <select
                style="
                  width: 100%;
                  border-radius: 8px;
                  padding: 12px 8px 12px 8px;
                  border: 1px solid #d0d5dd;
                "
                id="eventTypeButton"
              >
              </select>
            </div>
            <div class="button-container">
              <button
                onclick="switchPage('pageListEvent')"
                class="btn"
                style="background: #fff; border: 1px solid #d0d5dd"
              >
                <span style="color: #101828"> Cancel </span>
              </button>
              <button
                onclick="onClickConfirm('BUTTON')"
                class="btn"
                style="background: #1570ef; border: none"
              >
                <span style="color: #fff"> Confirm </span>
              </button>
            </div>
            <div style="text-align: center">
                <span class="text">Need help? Visit </span>
                <a class="link" href="#"> Help center </a>
                <span class="text"> or </span>
                <a class="link" href="#">Report issue</a>
                <span class="text"> . </span>
              </div>
          </div>
        </div>

        <div id="exitSetupDialog">
          <div style="display: flex; justify-content: space-between">
            <span class="text-title" style="align-self:center;">Exit event builder</span>
            <span
              id="closeDialog"
              style="font-size: 25px; cursor: pointer; user-select: none"
              onclick="onClickBackToEdit()"
              >&times;</span
            >
          </div>
          <span>
            Your changes have been saved. You can return to the pixel detail
            page to view event details. The changes may take up to 30 minutes to
            be effective.
          </span>
          <div style="display: flex; gap: 12px; justify-content: flex-end">
            <button
              onclick="onClickBackToEdit()"
              class="btn"
              style="
                background: #fff;
                border: 1px solid #d0d5dd;
                width: fit-content;
              "
            >
              <span style="color: #101828"> Back to edit </span>
            </button>
            <button
              onclick="onClickConfirmAndExit()"
              class="btn"
              style="background: #1570ef; border: none; width: fit-content"
            >
              <span style="color: #fff"> Confirm & Exit </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
}

function getCSSDialog() {
  return `
     #soctripEventSetup .tab {
        overflow: hidden;
        border-bottom: 1px #eaecf0 solid;
      }

      #soctripEventSetup .tab button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
        font-size: 14px;
        font-family: Inter;
        font-weight: 600;
        line-height: 20px;
      }

      #soctripEventSetup .tab button.active {
        color: #1570ef;
        border-bottom: 1px #1570ef solid;
      }

      #soctripEventSetup .tabcontent {
        display: none;
        padding: 6px 12px;
      }

      #soctripEventSetup .link {
        color: #1570ef;
        font-size: 12px;
        font-family: Inter;
        font-weight: 400;
        line-height: 16px;
        word-wrap: break-word;
        text-decoration: none;
      }

      #soctripEventSetup .text {
        color: #667085;
        font-size: 12px;
        font-family: Inter;
        font-weight: 400;
        line-height: 16px;
        word-wrap: break-word;
      }
      #soctripEventSetup .page {
        display: none;
      }
      #soctripEventSetup .page.active {
        display: block;
      }
      #soctripEventSetup .button-container {
        display: flex;
        gap: 8px;
      }
      #soctripEventSetup .text-title {
        font-size: 16px;
        font-family: Inter;
        font-weight: 600;
        line-height: 24px;
      }
      #soctripEventSetup .text-normal {
        font-size: 16px;
        font-family: Inter;
        font-weight: 600;
        line-height: 24px;
      }
      #soctripEventSetup .radio-label {
        color: #101828;
        font-size: 14px;
        font-family: Inter;
        font-weight: 500;
        line-height: 20px;
      }
      #soctripEventSetup .description {
        display: block;
        font-size: 14px;
        color: #667085;
        font-family: Inter;
        font-weight: 400;
        line-height: 20px;
      }
      #soctripEventSetup .btn {
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 8px;
        cursor: pointer;
      }
      #soctripEventSetup .btn > span {
        font-size: 14px;
        font-family: Inter;
        font-weight: 600;
        line-height: 20px;
      }
      #soctripEventSetup select:focus,
      textarea:focus {
        outline: none !important;
        border: 1px solid #1570ef;
      }
      #soctripEventSetup .boxsizingBorder {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      #soctripEventSetup #exitSetupDialog {
        position: fixed;
        left: 35%;
        bottom: 45%;
        min-width: 588px;
        max-width: 588px;
        border-radius: 16px;
        background-color: #fff;
        padding: 24px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        gap: 24px;
        border: 1px solid #eaecf0;
        visibility: hidden;
      }
    `;
}
