export default async function decorate(block2) {
  block2.innerHTML = `  <form id="specialEventsForm">
    <!-- Submission date (hidden) -->
    <input type="hidden" id="submission_date" name="submission_date" />

    <!-- Event Addresses -->
    <div class="addresses-container" id="addressesContainer">
      <!-- Address blocks will be inserted here by JS -->
    </div>
    <button type="button" class="add-address-btn" id="addAddressBtn">+ Add Another Address</button>

    <!-- Date fields -->
    <div class="date-section-standalone">
      <div class="date-fields">
        <div class="date-field">
          <label for="event_start">*Start Date</label>
          <input type="date" id="event_start" name="event_start" required />
        </div>
        <div class="date-field">
          <label for="event_end">*End Date</label>
          <input type="date" id="event_end" name="event_end" required />
        </div>
      </div>
    </div>

    <div class="contact-info-wrapper">
      <div class="column">
        <label for="first_name">*First Name:</label>
        <input type="text" id="first_name" name="first_name" required />
      </div>
      <div class="column">
        <label for="last_name">*Last Name:</label>
        <input type="text" id="last_name" name="last_name" required />
      </div>
      <div class="column">
        <label for="applicant_email">*Please provide your email:</label>
        <input type="email" id="applicant_email" name="applicant_email" required />
      </div>
      <div class="column">
        <label for="applicant_phone">*Contact phone number:</label>
        <input type="text"
               id="applicant_phone"
               name="applicant_phone"
               pattern="^[0-9+(). -]+$"
               title="Phone number can only contain numbers, spaces, dashes, parentheses, periods, and plus sign"
               required />
      </div>
    </div>

    <!-- Wrap all radio button groups in the new container -->
    <div class="radio-questions-wrapper">
      <!-- Replace first two radio groups with new dropdowns -->
      <div class="column">
        <label for="indoor_attendance">*Indoor attendance (if any):</label>
        <select id="indoor_attendance" name="indoor_attendance" class="select-half-width" required>
          <option value="" disabled selected>Select one</option>
          <option value="none">None</option>
          <option value="under_300">Under 300 people</option>
          <option value="300_to_4999">300-4,999 people</option>
          <option value="5000_to_14999">5,000-14,999 people</option>
          <option value="over_15000">15,000+ people</option>
        </select>
      </div>

      <div class="column">
        <label for="outdoor_attendance">*Outdoor attendance (if any):</label>
        <select id="outdoor_attendance" name="outdoor_attendance" class="select-half-width" required>
          <option value="" disabled selected>Select one</option>
          <option value="none">None</option>
          <option value="under_1000">Under 1000 people</option>
          <option value="1000_to_4999">1,000-4,999 people</option>
          <option value="5000_to_14999">5,000-14,999 people</option>
          <option value="over_15000">15,000+ people</option>
        </select>
      </div>

      <div class="column">
        <label>Will you charge for admission?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_charge" value="will not charge" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_charge" value="will charge" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Are you a Resort or Hotel/Casino?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_resort" value="is not a resort" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_resort" value="is a resort" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will there be live music or other performances?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_performances" value="no live performances" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_performances" value="live performances" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will there be rides or attractions?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_rides" value="no rides" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_rides" value="rides" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Is this a seasonal event?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_seasonal" value="not seasonal" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_seasonal" value="seasonal" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Is this a holiday event?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_holiday" value="not holiday" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_holiday" value="holiday" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will there be merchandise or other retail sales?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_merchandise" value="no merchandise" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_merchandise" value="merchandise" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will there be alcohol at the event?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_alcohol" value="no alcohol" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_alcohol" value="alcohol" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Are you applying for a rodeo permit?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_rodeo" value="no rodeo" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_rodeo" value="a rodeo" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Are you hosting an auction?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_auction" value="no auction" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_auction" value="auction" required />
            Yes
          </label>
        </div>
      </div>
      <div class="column">
        <label>Will there be commercial filming or photography?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_filming" value="no filming" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_filming" value="filming" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will there be snacks, meals, treats, or beverages?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_food" value="no food" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_food" value="food" required />
            Yes
          </label>
        </div>
      </div>
      <div class="column">
        <label>Will there be any pyrotechnics?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_pyrotechnics" value="no pyrotechnics" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_pyrotechnics" value="pyrotechnics" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will there be animals?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_animals" value="no animals" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_animals" value="animals" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will you have Tents (Canopies) and/or Temporary Structures (Stage(s)/Platform(s))?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_tents" value="no tents" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_tents" value="tents" required />
            Yes
          </label>
        </div>
      </div>

      <div class="column">
        <label>Will you have generators?</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="event_generators" value="no generators" checked required />
            No
          </label>
          <label>
            <input type="radio" name="event_generators" value="generators" required />
            Yes
          </label>
        </div>
      </div>
    </div>

    <div class="form-row center">
      <button type="submit" id="launchAssistantBtn">Submit</button>
    </div>
  </form>
  
  <div class="lightbox" id="lightbox">
    <div class="lightbox-content">
      <p id="lightbox-message"></p>
      <button id="lightbox-close">Close</button>
    </div>
  </div>
  `;

  // ── State abbreviation list ──
  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
  ];

  // ── Address block management ──
  const MAX_ADDRESSES = 6;
  let addressCount = 0;
  const addressData = {}; // keyed by index, stores verification data

  const addressesContainer = document.getElementById('addressesContainer');
  const addAddressBtn = document.getElementById('addAddressBtn');

  function createAddressBlock(index) {
    const block = document.createElement('div');
    block.className = 'address-block';
    block.dataset.index = index;
    block.id = `address_block_${index}`;

    const stateOptions = US_STATES.map((s) => `<option value="${s}"${s === 'NV' ? ' selected' : ''}>${s}</option>`).join('');

    block.innerHTML = `
        <div class="address-block-header">
          <h3>*Event Address ${index}</h3>
          ${index > 1 ? `<button type="button" class="remove-address-btn" onclick="removeAddressBlock(${index})">Remove</button>` : ''}
        </div>
        <div class="address-fields-grid">
          <div class="address-field full-width">
            <label for="addr_${index}_street1">*Street Address 1:</label>
            <input type="text" id="addr_${index}_street1" name="addr_${index}_street1" required />
          </div>
          <div class="address-field full-width">
            <label for="addr_${index}_street2">Suite/Apartment/Floor:</label>
            <input type="text" id="addr_${index}_street2" name="addr_${index}_street2" />
          </div>
          <div class="address-field full-width">
            <div class="address-city-state-zip">
              <div class="address-field">
                <label for="addr_${index}_city">*City:</label>
                <input type="text" id="addr_${index}_city" name="addr_${index}_city" required />
              </div>
              <div class="address-field">
                <label for="addr_${index}_state">*State:</label>
                <select id="addr_${index}_state" name="addr_${index}_state" required>
                  ${stateOptions}
                </select>
              </div>
              <div class="address-field">
                <label for="addr_${index}_zip">*ZIP Code:</label>
                <input type="text" id="addr_${index}_zip" name="addr_${index}_zip" required
                       pattern="^[0-9]{5}(-[0-9]{4})?$" title="Enter a valid 5-digit ZIP code" />
              </div>
            </div>
          </div>
        </div>
        <div class="address-verify-row">
          <button type="button" onclick="verifyAddressBlock(${index}, true)">Verify</button>
          <a href="#" id="addrStatus_${index}" class="status-icon" target="_blank" style="pointer-events:none;"></a>
        </div>
      `;

    // Listen for changes to reset verification status
    block.querySelectorAll('input, select').forEach((el) => {
      // eslint-disable-next-line no-use-before-define
      el.addEventListener('input', () => resetAddressStatus(index));
    });

    return block;
  }

  function addAddressBlock() {
    // eslint-disable-next-line no-plusplus
    addressCount++;
    const block = createAddressBlock(addressCount);
    addressesContainer.appendChild(block);
    addressData[addressCount] = {
      verified: false, lastVerified: '', xCoord: '', yCoord: '', mapLink: '', parcel: '',
    };
    // eslint-disable-next-line no-use-before-define
    updateAddButton();
  }

  function removeAddressBlock(index) {
    const block = document.getElementById(`address_block_${index}`);
    if (block) {
      block.remove();
      delete addressData[index];
      // eslint-disable-next-line no-use-before-define
      renumberAddressBlocks();
      // eslint-disable-next-line no-use-before-define
      updateAddButton();
    }
  }

  function renumberAddressBlocks() {
    const blocks = addressesContainer.querySelectorAll('.address-block');
    // We don't renumber IDs/names (which would break references), just update visible headers
    let num = 1;
    blocks.forEach((block) => {
      block.querySelector('h3').textContent = `*Event Address ${num}`;
      // eslint-disable-next-line no-plusplus
      num++;
    });
  }

  function updateAddButton() {
    const currentCount = addressesContainer.querySelectorAll('.address-block').length;
    addAddressBtn.disabled = currentCount >= MAX_ADDRESSES;
    addAddressBtn.textContent = currentCount >= MAX_ADDRESSES
      ? `Maximum ${MAX_ADDRESSES} addresses reached`
      : '+ Add Another Address';
  }

  function resetAddressStatus(index) {
    const statusEl = document.getElementById(`addrStatus_${index}`);
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.classList.remove('valid-address', 'invalid-address');
      statusEl.href = '#';
      statusEl.style.pointerEvents = 'none';
    }
    if (addressData[index]) {
      addressData[index].verified = false;
      addressData[index].lastVerified = '';
    }
  }

  function getFullAddress(index) {
    const street1 = document.getElementById(`addr_${index}_street1`)?.value.trim() || '';
    const street2 = document.getElementById(`addr_${index}_street2`)?.value.trim() || '';
    const city = document.getElementById(`addr_${index}_city`)?.value.trim() || '';
    const state = document.getElementById(`addr_${index}_state`)?.value || '';
    const zip = document.getElementById(`addr_${index}_zip`)?.value.trim() || '';
    const parts = [street1, street2, city, state, zip].filter(Boolean);
    return parts.join(', ');
  }

  async function verifyAddressBlock(index, showMessages = false) {
    const statusEl = document.getElementById(`addrStatus_${index}`);
    const fullAddress = getFullAddress(index);

    // Check cache
    if (addressData[index] && fullAddress === addressData[index].lastVerified) {
      return addressData[index].verified;
    }

    if (!fullAddress || !document.getElementById(`addr_${index}_street1`)?.value.trim()) {
      if (showMessages) {
        // eslint-disable-next-line no-use-before-define
        showLightbox(`Please enter a street address for Event Address ${index}.`);
      }
      return false;
    }

    try {
      // Geocode
      const street1 = document.getElementById(`addr_${index}_street1`)?.value.trim() || '';
      const street2 = document.getElementById(`addr_${index}_street2`)?.value.trim() || '';
      const city = document.getElementById(`addr_${index}_city`)?.value.trim() || '';
      const state = document.getElementById(`addr_${index}_state`)?.value || '';
      const zip = document.getElementById(`addr_${index}_zip`)?.value.trim() || '';
      const streetAddress = [street1, street2].filter(Boolean).join(', ');
      const geocodeUrl = `https://maps.clarkcountynv.gov/arcgis/rest/services/Locators/CC_MultiRole_pro/GeocodeServer/findAddressCandidates?Address=&Address2=&Address3=&Neighborhood=&City=${encodeURIComponent(city)}&Subregion=&Region=${encodeURIComponent(state)}&Postal=${encodeURIComponent(zip)}&PostalExt=&CountryCode=&SingleLine=${encodeURIComponent(streetAddress)}&outFields=&maxLocations=&matchOutOfRange=true&langCode=&locationType=&sourceCountry=&category=&location=&distance=&searchExtent=&outSR=&magicKey=&f=pjson`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.candidates || geocodeData.candidates.length === 0) {
        if (showMessages) {
          statusEl.textContent = 'X';
          statusEl.classList.add('invalid-address');
          statusEl.href = '#';
          statusEl.style.pointerEvents = 'none';
          // eslint-disable-next-line no-use-before-define
          showLightbox(`Unable to find Event Address ${index}. Please enter an address in Clark County.`);
        }
        addressData[index].lastVerified = fullAddress;
        addressData[index].verified = false;
        return false;
      }

      const firstMatch = geocodeData.candidates[0];
      const xCoord = firstMatch.location.x;
      const yCoord = firstMatch.location.y;

      // Jurisdiction check
      const zoningUrl = `https://maps.clarkcountynv.gov/gismo/webservice/GISDataWCF/GISDataService.svc/jsonep/getZoning?Xcoordinate=${xCoord}&Ycoordinate=${yCoord}`;
      const zoningResponse = await fetch(zoningUrl);
      const zoningData = await zoningResponse.json();
      const isInClarkCounty = zoningData.jurisdiction === 'Clark County';

      // Parcel lookup
      const parcelUrl = `https://maps.clarkcountynv.gov/gismo/webservice/GISDataWCF/GISDataService.svc/jsonep/PointToParcel?method=gismo&xcoordinate=${xCoord}&ycoordinate=${yCoord}`;
      const parcelResponse = await fetch(parcelUrl);
      const parcelData = await parcelResponse.json();
      const parcelNumber = parcelData.parcel || '';
      const mapLink = parcelNumber
        ? `https://maps.clarkcountynv.gov/ow/?getParcel=${parcelNumber}`
        : `https://maps.clarkcountynv.gov/ow/?@${Math.round(xCoord)},${Math.round(yCoord)},9`;

      if (showMessages) {
        if (isInClarkCounty) {
          statusEl.textContent = '✓';
          statusEl.classList.add('valid-address');
        } else {
          statusEl.textContent = 'X';
          statusEl.classList.add('invalid-address');
        }
        if (parcelNumber || (xCoord && yCoord)) {
          statusEl.href = mapLink;
          statusEl.style.pointerEvents = 'auto';
        } else {
          statusEl.href = '#';
          statusEl.style.pointerEvents = 'none';
        }
        if (!isInClarkCounty) {
          // eslint-disable-next-line no-use-before-define
          showLightbox(`Event Address ${index} is in ${zoningData.jurisdiction}. This experience is only for addresses in Clark County.`);
        }
      }

      // Store data
      addressData[index].xCoord = xCoord;
      addressData[index].yCoord = yCoord;
      addressData[index].mapLink = mapLink;
      addressData[index].parcel = parcelNumber;
      addressData[index].lastVerified = fullAddress;
      addressData[index].verified = isInClarkCounty;
      addressData[index].jurisdiction = zoningData.jurisdiction;
      addressData[index].resolvedAddress = firstMatch.address;

      return isInClarkCounty;
    } catch (err) {
      console.error(err);
      if (showMessages) {
        statusEl.textContent = 'X';
        statusEl.classList.add('invalid-address');
        statusEl.href = '#';
        statusEl.style.pointerEvents = 'none';
        // eslint-disable-next-line no-use-before-define
        showLightbox(`There was an error verifying Event Address ${index}. Please try again.`);
      }
      addressData[index].lastVerified = '';
      addressData[index].verified = false;
      return false;
    }
  }

  // Expose to onclick handlers
  window.removeAddressBlock = removeAddressBlock;
  window.verifyAddressBlock = verifyAddressBlock;

  // Initialize with one address block
  addAddressBlock();

  addAddressBtn.addEventListener('click', addAddressBlock);

  // ── Submission date ──
  // eslint-disable-next-line prefer-destructuring
  document.getElementById('submission_date').value = new Date().toISOString().split('T')[0];

  // ── Date logic ──
  const eventStart = document.getElementById('event_start');
  const eventEnd = document.getElementById('event_end');
  const today = new Date().toISOString().split('T')[0];
  eventStart.min = today;
  eventEnd.min = today;

  eventStart.addEventListener('change', () => {
    const startDate = eventStart.value;
    eventEnd.min = startDate;
    if (eventEnd.value < startDate) {
      eventEnd.value = startDate;
    }
    eventEnd.value = eventStart.value;
  });

  eventEnd.addEventListener('change', () => {
    if (eventEnd.value < eventStart.value) {
      eventEnd.value = eventStart.value;
    }
  });

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxMessage = document.getElementById('lightbox-message');
  const lightboxClose = document.getElementById('lightbox-close');

  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  function showLightbox(message) {
    lightboxMessage.innerHTML = message;
    lightbox.style.display = 'flex';
  }

  // ── Phone validation ──
  const phoneInput = document.getElementById('applicant_phone');
  phoneInput.addEventListener('input', (e) => {
    const { value } = e.target;
    const sanitized = value.replace(/[^0-9+().\s-]/g, '');
    if (value !== sanitized) {
      e.target.value = sanitized;
    }
  });

  // ── Form submission ──
  const form = document.getElementById('specialEventsForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();

    // Validate phone number
    const phone = phoneInput.value;
    if (!/^[0-9+().\s-]+$/.test(phone)) {
      showLightbox('Please enter a valid phone number.');
      return;
    }

    // Validate all zip codes before verification
    const blocks = addressesContainer.querySelectorAll('.address-block');
    // eslint-disable-next-line no-restricted-syntax
    for (const block of blocks) {
      // eslint-disable-next-line radix
      const idx = parseInt(block.dataset.index);
      const zipField = document.getElementById(`addr_${idx}_zip`);
      const zipVal = zipField?.value.trim() || '';
      if (!zipVal || !/^[0-9]{5}(-[0-9]{4})?$/.test(zipVal)) {
        showLightbox(`Please enter a valid 5-digit ZIP code for Event Address ${Array.from(blocks).indexOf(block) + 1}.`);
        zipField?.focus();
        return;
      }
    }

    // Verify all addresses independently
    let allVerified = true;
    let anyNotInClarkCounty = false;
    let failedJurisdiction = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const block of blocks) {
      // eslint-disable-next-line radix
      const idx = parseInt(block.dataset.index);
      // eslint-disable-next-line no-await-in-loop
      const result = await verifyAddressBlock(idx, false);
      if (!result) {
        allVerified = false;
        if (addressData[idx] && addressData[idx].jurisdiction && addressData[idx].jurisdiction !== 'Clark County') {
          anyNotInClarkCounty = true;
          failedJurisdiction = addressData[idx].jurisdiction;
        }
      }
    }

    // If any address is not in Clark County, show error but don't block other verifications
    if (!allVerified) {
      if (anyNotInClarkCounty) {
        showLightbox(`It appears that one or more event addresses are not within unincorporated Clark County (detected: ${failedJurisdiction}). Therefore, your event does not fall under this department's jurisdiction. If you feel this is incorrect, please contact the Sports and Special Events Team at <a href="mailto:CCSportsandSpecialEvents@ClarkCountyNV.gov">CCSportsandSpecialEvents@ClarkCountyNV.gov</a> or 702-455-3403.`);
      } else {
        showLightbox('One or more event addresses could not be verified. Please check each address and try again.');
      }
      return;
    }

    // Build params
    const params = new URLSearchParams();

    // Clark County status (all addresses verified)
    params.append('clark_county', 'is in');

    // Name fields
    params.append('first_name', firstName);
    params.append('last_name', lastName);
    params.append('applicant_name', firstName); // backward compat
    params.append('applicant_fullname', `${firstName} ${lastName}`); // backward compat

    // Contact info
    params.append('applicant_email', document.getElementById('applicant_email').value);
    params.append('applicant_phone', document.getElementById('applicant_phone').value);
    params.append('event_start', eventStart.value);
    params.append('event_end', eventEnd.value);
    params.append('submission_date', document.getElementById('submission_date').value);

    // Build eventAddresses JSON array
    const eventAddresses = [];
    blocks.forEach((block) => {
      // eslint-disable-next-line radix
      const idx = parseInt(block.dataset.index);
      const street1 = document.getElementById(`addr_${idx}_street1`)?.value.trim() || '';
      const street2 = document.getElementById(`addr_${idx}_street2`)?.value.trim() || '';
      const city = document.getElementById(`addr_${idx}_city`)?.value.trim() || '';
      const state = document.getElementById(`addr_${idx}_state`)?.value || '';
      const zip = document.getElementById(`addr_${idx}_zip`)?.value.trim() || '';

      eventAddresses.push({
        street1,
        street2,
        city,
        state,
        zip,
        full: getFullAddress(idx),
        verified: addressData[idx]?.verified ? 'true' : 'false',
        x_coordinate: addressData[idx]?.xCoord?.toString() || '',
        y_coordinate: addressData[idx]?.yCoord?.toString() || '',
        map_link: addressData[idx]?.mapLink || '',
        parcel: addressData[idx]?.parcel || '',
      });
    });

    params.append('eventAddresses', JSON.stringify(eventAddresses));
    params.append('address_count', eventAddresses.length.toString());

    // Also append each address as individual flat params
    eventAddresses.forEach((addr, i) => {
      const num = i + 1;
      const prefix = `event_address_${num}`;
      params.append(`${prefix}_street1`, addr.street1);
      params.append(`${prefix}_street2`, addr.street2);
      params.append(`${prefix}_city`, addr.city);
      params.append(`${prefix}_state`, addr.state);
      params.append(`${prefix}_zip`, addr.zip);
      params.append(`${prefix}_full`, addr.full);
      params.append(`${prefix}_verified`, addr.verified);
      if (addr.x_coordinate) {
        params.append(`${prefix}_x_coordinate`, addr.x_coordinate);
        params.append(`${prefix}_y_coordinate`, addr.y_coordinate);
        params.append(`${prefix}_map_link`, addr.map_link);
        if (addr.parcel) {
          params.append(`${prefix}_parcel`, addr.parcel);
        }
      }
    });

    // Attendance dropdowns
    params.append('indoor_attendance', document.getElementById('indoor_attendance').value);
    params.append('outdoor_attendance', document.getElementById('outdoor_attendance').value);

    // Yes/No radio fields
    params.append('event_charge', document.querySelector('input[name="event_charge"]:checked').value);
    params.append('event_resort', document.querySelector('input[name="event_resort"]:checked').value);
    params.append('event_performances', document.querySelector('input[name="event_performances"]:checked').value);
    params.append('event_rides', document.querySelector('input[name="event_rides"]:checked').value);
    params.append('event_seasonal', document.querySelector('input[name="event_seasonal"]:checked').value);
    params.append('event_holiday', document.querySelector('input[name="event_holiday"]:checked').value);
    params.append('event_merchandise', document.querySelector('input[name="event_merchandise"]:checked').value);
    params.append('event_alcohol', document.querySelector('input[name="event_alcohol"]:checked').value);
    params.append('event_rodeo', document.querySelector('input[name="event_rodeo"]:checked').value);
    params.append('event_auction', document.querySelector('input[name="event_auction"]:checked').value);
    params.append('event_filming', document.querySelector('input[name="event_filming"]:checked').value);
    params.append('event_food', document.querySelector('input[name="event_food"]:checked').value);
    params.append('event_pyrotechnics', document.querySelector('input[name="event_pyrotechnics"]:checked').value);
    params.append('event_animals', document.querySelector('input[name="event_animals"]:checked').value);
    params.append('event_tents', document.querySelector('input[name="event_tents"]:checked').value);
    params.append('event_generators', document.querySelector('input[name="event_generators"]:checked').value);

    // Navigate to launcher
    // window.location.href = `clark-county-launcher-v4-prod.html?${params.toString()}`;
    // temporary for testing
    window.location.href = `/drafts/jlui/development/issue1667/launcher?${params.toString()}`;
  });
}
