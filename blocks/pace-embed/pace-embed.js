/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable radix */
/* eslint-disable no-await-in-loop */

export default async function decorate(block2) {
  block2.innerHTML = `  <form id="specialEventsForm">
    <input type="hidden" id="submission_date" name="submission_date" />

    <div class="addresses-container" id="addressesContainer"></div>
    <button type="button" class="add-address-btn" id="addAddressBtn">+ Add Another Address</button>

    <div class="date-section-standalone">
      <div class="date-fields">
        <div class="date-field">
          <label for="event_start">*Start Date</label>
          <input type="date" id="event_start" name="event_start" required />
        </div>
        <div class="date-field">
          <label for="event_start_time">*Start Time</label>
          <select id="event_start_time" name="event_start_time" required>
            <option value="" disabled selected>Select time</option>
          </select>
        </div>
        <div class="date-field">
          <label for="event_end">*End Date</label>
          <input type="date" id="event_end" name="event_end" required />
        </div>
        <div class="date-field">
          <label for="event_end_time">*End Time</label>
          <select id="event_end_time" name="event_end_time" required>
            <option value="" disabled selected>Select time</option>
          </select>
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

    <div class="radio-questions-wrapper">
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
        <input type="radio" name="event_charge" value="will not charge" checked required class="radio-hidden" />
        <input type="radio" name="event_charge" value="will charge" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_charge" data-value="will not charge" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_charge" data-value="will charge" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Are you a Resort or Hotel/Casino?</label>
        <input type="radio" name="event_resort" value="is not a resort" checked required class="radio-hidden" />
        <input type="radio" name="event_resort" value="is a resort" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_resort" data-value="is not a resort" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_resort" data-value="is a resort" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be live music or other performances?</label>
        <input type="radio" name="event_performances" value="no live performances" checked required class="radio-hidden" />
        <input type="radio" name="event_performances" value="live performances" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_performances" data-value="no live performances" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_performances" data-value="live performances" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be rides or attractions?</label>
        <input type="radio" name="event_rides" value="no rides" checked required class="radio-hidden" />
        <input type="radio" name="event_rides" value="rides" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_rides" data-value="no rides" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_rides" data-value="rides" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Is street closure required?</label>
        <input type="radio" name="paceadm_streetclosure" value="no street closure" checked required class="radio-hidden" />
        <input type="radio" name="paceadm_streetclosure" value="street closure" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="paceadm_streetclosure" data-value="no street closure" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="paceadm_streetclosure" data-value="street closure" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Is sidewalk closure required?</label>
        <input type="radio" name="paceadm_sidewalkclosure" value="no sidewalk closure" checked required class="radio-hidden" />
        <input type="radio" name="paceadm_sidewalkclosure" value="sidewalk closure" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="paceadm_sidewalkclosure" data-value="no sidewalk closure" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="paceadm_sidewalkclosure" data-value="sidewalk closure" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Is this a seasonal event?</label>
        <input type="radio" name="event_seasonal" value="not seasonal" checked required class="radio-hidden" />
        <input type="radio" name="event_seasonal" value="seasonal" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_seasonal" data-value="not seasonal" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_seasonal" data-value="seasonal" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Is this a holiday event?</label>
        <input type="radio" name="event_holiday" value="not holiday" checked required class="radio-hidden" />
        <input type="radio" name="event_holiday" value="holiday" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_holiday" data-value="not holiday" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_holiday" data-value="holiday" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be merchandise or other retail sales?</label>
        <input type="radio" name="event_merchandise" value="no merchandise" checked required class="radio-hidden" />
        <input type="radio" name="event_merchandise" value="merchandise" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_merchandise" data-value="no merchandise" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_merchandise" data-value="merchandise" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will services be sold?</label>
        <input type="radio" name="paceadm_servicessold" value="no services sold" checked required class="radio-hidden" />
        <input type="radio" name="paceadm_servicessold" value="services sold" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="paceadm_servicessold" data-value="no services sold" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="paceadm_servicessold" data-value="services sold" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be alcohol at the event?</label>
        <input type="radio" name="event_alcohol" value="no alcohol" checked required class="radio-hidden" />
        <input type="radio" name="event_alcohol" value="alcohol" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_alcohol" data-value="no alcohol" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_alcohol" data-value="alcohol" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Are you applying for a rodeo permit?</label>
        <input type="radio" name="event_rodeo" value="no rodeo" checked required class="radio-hidden" />
        <input type="radio" name="event_rodeo" value="a rodeo" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_rodeo" data-value="no rodeo" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_rodeo" data-value="a rodeo" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Are you hosting an auction?</label>
        <input type="radio" name="event_auction" value="no auction" checked required class="radio-hidden" />
        <input type="radio" name="event_auction" value="auction" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_auction" data-value="no auction" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_auction" data-value="auction" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be commercial filming or photography?</label>
        <input type="radio" name="event_filming" value="no filming" checked required class="radio-hidden" />
        <input type="radio" name="event_filming" value="filming" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_filming" data-value="no filming" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_filming" data-value="filming" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be snacks, meals, or treats?</label>
        <input type="radio" name="event_food" value="no food" checked required class="radio-hidden" />
        <input type="radio" name="event_food" value="food" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_food" data-value="no food" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_food" data-value="food" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be non-alcoholic beverages?</label>
        <input type="radio" name="paceadm_nonalcoholicbeverages" value="no non-alcoholic beverages" checked required class="radio-hidden" />
        <input type="radio" name="paceadm_nonalcoholicbeverages" value="non-alcoholic beverages" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="paceadm_nonalcoholicbeverages" data-value="no non-alcoholic beverages" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="paceadm_nonalcoholicbeverages" data-value="non-alcoholic beverages" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be any pyrotechnics?</label>
        <input type="radio" name="event_pyrotechnics" value="no pyrotechnics" checked required class="radio-hidden" />
        <input type="radio" name="event_pyrotechnics" value="pyrotechnics" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_pyrotechnics" data-value="no pyrotechnics" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_pyrotechnics" data-value="pyrotechnics" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be fireworks?</label>
        <input type="radio" name="paceadm_pyrotechfireworks" value="no fireworks" checked required class="radio-hidden" />
        <input type="radio" name="paceadm_pyrotechfireworks" value="fireworks" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="paceadm_pyrotechfireworks" data-value="no fireworks" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="paceadm_pyrotechfireworks" data-value="fireworks" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be special effects?</label>
        <input type="radio" name="paceadm_specialeffects" value="no special effects" checked required class="radio-hidden" />
        <input type="radio" name="paceadm_specialeffects" value="special effects" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="paceadm_specialeffects" data-value="no special effects" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="paceadm_specialeffects" data-value="special effects" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will there be animals?</label>
        <input type="radio" name="event_animals" value="no animals" checked required class="radio-hidden" />
        <input type="radio" name="event_animals" value="animals" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_animals" data-value="no animals" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_animals" data-value="animals" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will you have Tents (Canopies) and/or Temporary Structures (Stage(s)/Platform(s))?</label>
        <input type="radio" name="event_tents" value="no tents" checked required class="radio-hidden" />
        <input type="radio" name="event_tents" value="tents" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_tents" data-value="no tents" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_tents" data-value="tents" data-yn="yes">Yes</button>
        </div>
      </div>

      <div class="column">
        <label>Will you have generators?</label>
        <input type="radio" name="event_generators" value="no generators" checked required class="radio-hidden" />
        <input type="radio" name="event_generators" value="generators" required class="radio-hidden" />
        <div class="yn-group">
          <button type="button" class="yn-btn" data-name="event_generators" data-value="no generators" data-yn="no">No</button>
          <button type="button" class="yn-btn" data-name="event_generators" data-value="generators" data-yn="yes">Yes</button>
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

  const MAX_ADDRESSES = 6;
  let addressCount = 0;
  const addressData = {};

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

    block.querySelectorAll('input, select').forEach((el) => {
      el.addEventListener('input', () => resetAddressStatus(index));
    });

    const street1Input = block.querySelector(`#addr_${index}_street1`);
    street1Input.addEventListener('input', () => unlockAddressFields(index));

    return block;
  }

  function addAddressBlock() {
    addressCount++;
    const block = createAddressBlock(addressCount);
    addressesContainer.appendChild(block);
    addressData[addressCount] = {
      verified: false, lastVerified: '', xCoord: '', yCoord: '', mapLink: '', parcel: '',
    };
    updateAddButton();
  }

  function removeAddressBlock(index) {
    const block = document.getElementById(`address_block_${index}`);
    if (block) {
      block.remove();
      delete addressData[index];
      renumberAddressBlocks();
      updateAddButton();
    }
  }

  function renumberAddressBlocks() {
    const blocks = addressesContainer.querySelectorAll('.address-block');
    let num = 1;
    blocks.forEach((block) => {
      block.querySelector('h3').textContent = `*Event Address ${num}`;
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

    if (addressData[index] && fullAddress === addressData[index].lastVerified) {
      return addressData[index].verified;
    }

    if (!fullAddress || !document.getElementById(`addr_${index}_street1`)?.value.trim()) {
      if (showMessages) showLightbox(`Please enter a street address for Event Address ${index}.`);
      return false;
    }

    try {
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
          showLightbox(`Unable to find Event Address ${index}. Please enter an address in Clark County.`);
        }
        addressData[index].lastVerified = fullAddress;
        addressData[index].verified = false;
        return false;
      }

      const firstMatch = geocodeData.candidates[0];
      const xCoord = firstMatch.location.x;
      const yCoord = firstMatch.location.y;

      const zoningUrl = `https://maps.clarkcountynv.gov/gismo/webservice/GISDataWCF/GISDataService.svc/jsonep/getZoning?Xcoordinate=${xCoord}&Ycoordinate=${yCoord}`;
      const zoningResponse = await fetch(zoningUrl);
      const zoningData = await zoningResponse.json();
      const isInClarkCounty = zoningData.jurisdiction === 'Clark County';

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
          showLightbox(`Event Address ${index} is in ${zoningData.jurisdiction}. This experience is only for addresses in Clark County.`);
        }
      }

      addressData[index].xCoord = xCoord;
      addressData[index].yCoord = yCoord;
      addressData[index].mapLink = mapLink;
      addressData[index].parcel = parcelNumber;
      addressData[index].lastVerified = fullAddress;
      addressData[index].verified = isInClarkCounty;
      if (isInClarkCounty) lockAddressFields(index);
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
        showLightbox(`There was an error verifying Event Address ${index}. Please try again.`);
      }
      addressData[index].lastVerified = '';
      addressData[index].verified = false;
      return false;
    }
  }

  window.removeAddressBlock = removeAddressBlock;
  window.verifyAddressBlock = verifyAddressBlock;

  addAddressBlock();
  addAddressBtn.addEventListener('click', addAddressBlock);

  document.getElementById('submission_date').value = new Date().toISOString().split('T')[0];

  // ── Time helpers ──
  function timeToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }

  function populateTimeOptions(select) {
    if (!select) return;
    for (let h = 0; h < 24; h++) {
      for (const m of [0, 30]) {
        const period = h < 12 ? 'AM' : 'PM';
        let hour12 = h % 12;
        if (hour12 === 0) hour12 = 12;
        const mm = m === 0 ? '00' : '30';
        const label = `${hour12}:${mm} ${period}`;
        const opt = document.createElement('option');
        opt.value = label;
        opt.textContent = label;
        select.appendChild(opt);
      }
    }
  }
  populateTimeOptions(document.getElementById('event_start_time'));
  populateTimeOptions(document.getElementById('event_end_time'));

  // ── Date logic ──
  const eventStart = document.getElementById('event_start');
  const eventEnd = document.getElementById('event_end');
  const today = new Date().toISOString().split('T')[0];
  eventStart.min = today;
  eventEnd.min = today;

  eventStart.addEventListener('change', () => {
    const startDate = eventStart.value;
    eventEnd.min = startDate;
    if (eventEnd.value < startDate) eventEnd.value = startDate;
    eventEnd.value = eventStart.value;
  });

  eventEnd.addEventListener('change', () => {
    if (eventEnd.value < eventStart.value) eventEnd.value = eventStart.value;
  });

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxMessage = document.getElementById('lightbox-message');
  const lightboxClose = document.getElementById('lightbox-close');

  lightboxClose.addEventListener('click', () => { lightbox.style.display = 'none'; });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') lightbox.style.display = 'none';
  });

  function showLightbox(message) {
    lightboxMessage.innerHTML = message;
    lightbox.style.display = 'flex';
    setTimeout(() => { lightboxClose.focus(); }, 0);
  }

  // ── Yes/No buttons → radio sync ──
  document.querySelectorAll('.yn-group').forEach((group, i) => {
    const firstBtn = group.querySelector('.yn-btn');
    const name = firstBtn ? firstBtn.dataset.name : (`yn_${i}`);
    group.setAttribute('role', 'group');
    let labelEl = group.previousElementSibling;
    while (labelEl && labelEl.tagName !== 'LABEL') labelEl = labelEl.previousElementSibling;
    if (labelEl) {
      if (!labelEl.id) labelEl.id = `q_${name}`;
      group.setAttribute('aria-labelledby', labelEl.id);
    }
    group.querySelectorAll('.yn-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
  });

  document.querySelectorAll('.yn-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { name } = btn.dataset;
      const { value } = btn.dataset;
      const { yn } = btn.dataset;
      document.querySelector(`input[name="${name}"][value="${value}"]`).checked = true;
      document.querySelectorAll(`.yn-btn[data-name="${name}"]`).forEach((b) => {
        b.classList.remove('selected-yes', 'selected-no');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add(yn === 'yes' ? 'selected-yes' : 'selected-no');
      btn.setAttribute('aria-pressed', 'true');
      const grp = btn.closest('.yn-group');
      if (grp) {
        grp.classList.remove('yn-unanswered');
        grp.querySelectorAll('.yn-btn').forEach((b) => b.removeAttribute('aria-invalid'));
      }
    });
  });

  // ── Phone validation ──
  const phoneInput = document.getElementById('applicant_phone');
  phoneInput.addEventListener('input', (e) => {
    const { value } = e.target;
    const sanitized = value.replace(/[^0-9+().\s-]/g, '');
    if (value !== sanitized) e.target.value = sanitized;
  });

  // ── Address field locking ──
  function lockAddressFields(index) {
    const cityEl = document.getElementById(`addr_${index}_city`);
    const stateEl = document.getElementById(`addr_${index}_state`);
    const zipEl = document.getElementById(`addr_${index}_zip`);
    if (cityEl) cityEl.setAttribute('readonly', '');
    if (stateEl) stateEl.disabled = true;
    if (zipEl) zipEl.setAttribute('readonly', '');
  }

  function unlockAddressFields(index) {
    const cityEl = document.getElementById(`addr_${index}_city`);
    const stateEl = document.getElementById(`addr_${index}_state`);
    const zipEl = document.getElementById(`addr_${index}_zip`);
    if (cityEl) cityEl.removeAttribute('readonly');
    if (stateEl) stateEl.disabled = false;
    if (zipEl) zipEl.removeAttribute('readonly');
  }

  // ── Form submission ──
  const form = document.getElementById('specialEventsForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();

    const phone = phoneInput.value;
    if (!/^[0-9+().\s-]+$/.test(phone)) {
      showLightbox('Please enter a valid phone number.');
      return;
    }

    // Validate date/time: if same day, end time must be after start time
    const startDateVal = eventStart.value;
    const endDateVal = eventEnd.value;
    const startTimeVal = document.getElementById('event_start_time').value;
    const endTimeVal = document.getElementById('event_end_time').value;
    if (startDateVal && endDateVal && startTimeVal && endTimeVal && startDateVal === endDateVal) {
      if (timeToMinutes(endTimeVal) <= timeToMinutes(startTimeVal)) {
        showLightbox('End time must be after start time when the event starts and ends on the same day.');
        return;
      }
    }

    // Require explicit Yes/No selection for every question
    const ynGroups = document.querySelectorAll('.yn-group');
    let firstUnanswered = null;
    let unansweredCount = 0;
    ynGroups.forEach((group) => {
      const answered = group.querySelector('.yn-btn.selected-yes, .yn-btn.selected-no');
      if (answered) {
        group.classList.remove('yn-unanswered');
        group.querySelectorAll('.yn-btn').forEach((b) => b.removeAttribute('aria-invalid'));
      } else {
        unansweredCount++;
        group.classList.add('yn-unanswered');
        group.querySelectorAll('.yn-btn').forEach((b) => b.setAttribute('aria-invalid', 'true'));
        if (!firstUnanswered) firstUnanswered = group;
      }
    });
    if (unansweredCount > 0) {
      const plural = unansweredCount === 1 ? '' : 's';
      showLightbox(`Please answer all Yes/No questions before submitting. ${unansweredCount} question${plural} still need${unansweredCount === 1 ? 's' : ''} a Yes or No selection.`);
      if (firstUnanswered) firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Validate zip codes
    const blocks = addressesContainer.querySelectorAll('.address-block');
    for (const block of blocks) {
      const idx = parseInt(block.dataset.index);
      const zipField = document.getElementById(`addr_${idx}_zip`);
      const zipVal = zipField?.value.trim() || '';
      if (!zipVal || !/^[0-9]{5}(-[0-9]{4})?$/.test(zipVal)) {
        showLightbox(`Please enter a valid 5-digit ZIP code for Event Address ${Array.from(blocks).indexOf(block) + 1}.`);
        zipField?.focus();
        return;
      }
    }

    // Verify all addresses
    let allVerified = true;
    let anyNotInClarkCounty = false;
    let failedJurisdiction = '';

    for (const block of blocks) {
      const idx = parseInt(block.dataset.index);
      const result = await verifyAddressBlock(idx, false);
      if (!result) {
        allVerified = false;
        if (addressData[idx] && addressData[idx].jurisdiction && addressData[idx].jurisdiction !== 'Clark County') {
          anyNotInClarkCounty = true;
          failedJurisdiction = addressData[idx].jurisdiction;
        }
      }
    }

    if (!allVerified) {
      if (anyNotInClarkCounty) {
        showLightbox(`It appears that one or more event addresses are not within unincorporated Clark County (detected: ${failedJurisdiction}). Therefore, your event does not fall under this department's jurisdiction. If you feel this is incorrect, please contact the Sports and Special Events Team at <a href="mailto:CCSportsandSpecialEvents@ClarkCountyNV.gov">CCSportsandSpecialEvents@ClarkCountyNV.gov</a> or 702-455-3403.`);
      } else {
        showLightbox('One or more event addresses could not be verified. Please check each address and try again.');
      }
      return;
    }

    const params = new URLSearchParams();

    params.append('clark_county', 'is in');
    params.append('first_name', firstName);
    params.append('last_name', lastName);
    params.append('applicant_name', firstName);
    params.append('applicant_fullname', `${firstName} ${lastName}`);
    params.append('applicant_email', document.getElementById('applicant_email').value);
    params.append('applicant_phone', document.getElementById('applicant_phone').value);
    params.append('event_start', eventStart.value);
    params.append('event_end', eventEnd.value);
    params.append('event_start_time', document.getElementById('event_start_time').value);
    params.append('event_end_time', document.getElementById('event_end_time').value);
    params.append('submission_date', document.getElementById('submission_date').value);

    const eventAddresses = [];
    blocks.forEach((block) => {
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
        if (addr.parcel) params.append(`${prefix}_parcel`, addr.parcel);
      }
    });

    params.append('indoor_attendance', document.getElementById('indoor_attendance').value);
    params.append('outdoor_attendance', document.getElementById('outdoor_attendance').value);

    params.append('event_charge', document.querySelector('input[name="event_charge"]:checked').value);
    params.append('event_resort', document.querySelector('input[name="event_resort"]:checked').value);
    params.append('event_performances', document.querySelector('input[name="event_performances"]:checked').value);
    params.append('event_rides', document.querySelector('input[name="event_rides"]:checked').value);
    params.append('paceadm_streetclosure', document.querySelector('input[name="paceadm_streetclosure"]:checked').value);
    params.append('paceadm_sidewalkclosure', document.querySelector('input[name="paceadm_sidewalkclosure"]:checked').value);
    params.append('event_seasonal', document.querySelector('input[name="event_seasonal"]:checked').value);
    params.append('event_holiday', document.querySelector('input[name="event_holiday"]:checked').value);
    params.append('event_merchandise', document.querySelector('input[name="event_merchandise"]:checked').value);
    params.append('paceadm_servicessold', document.querySelector('input[name="paceadm_servicessold"]:checked').value);
    params.append('event_alcohol', document.querySelector('input[name="event_alcohol"]:checked').value);
    params.append('event_rodeo', document.querySelector('input[name="event_rodeo"]:checked').value);
    params.append('event_auction', document.querySelector('input[name="event_auction"]:checked').value);
    params.append('event_filming', document.querySelector('input[name="event_filming"]:checked').value);
    params.append('event_food', document.querySelector('input[name="event_food"]:checked').value);
    params.append('paceadm_nonalcoholicbeverages', document.querySelector('input[name="paceadm_nonalcoholicbeverages"]:checked').value);
    params.append('event_pyrotechnics', document.querySelector('input[name="event_pyrotechnics"]:checked').value);
    params.append('paceadm_pyrotechfireworks', document.querySelector('input[name="paceadm_pyrotechfireworks"]:checked').value);
    params.append('paceadm_specialeffects', document.querySelector('input[name="paceadm_specialeffects"]:checked').value);
    params.append('event_animals', document.querySelector('input[name="event_animals"]:checked').value);
    params.append('event_tents', document.querySelector('input[name="event_tents"]:checked').value);
    params.append('event_generators', document.querySelector('input[name="event_generators"]:checked').value);

    // Navigate to launcher
    // window.location.href = "clark-county-launcher-v4-prod.html?" + params.toString();
    // temporary for testing
    // window.location.href = `/drafts/jlui/development/issue1667/launcher?${params.toString()}`;
    window.location.href = `/drafts/jlui/development/issue1667/launcher?${params.toString()}`;

    // // find this embed block's container
    // const container = form.closest('.block');

    // // wipe the form UI
    // container.innerHTML = "";

    // // now load the launcher dynamically
    // loadLauncher(container, params);
  });
}

// async function loadLauncher(container, params) {
//   // create the launcher wrapper
//   const launcherDiv = document.createElement('div');
//   launcherDiv.id = "onemind-widget";
//   container.appendChild(launcherDiv);

//   // attach the launcher script
//   const script = document.createElement('script');
//   script.defer = true;
//   script.src = "https://launcher.1mind.com/w67t9x5w2s";

//   // expose params before 1mind loads
//   window.onemindBootstrap = {
//     queryParams: Object.fromEntries(params.entries())
//   };

//   container.appendChild(script);
// }
