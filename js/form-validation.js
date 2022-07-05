import { sendData } from './api.js';
import { blockSubmitButton, unblockSubmitButton, openMessage, createSuccess, createError, resetForm } from './form.js';

const adFormElement = document.querySelector('.ad-form');
const titleElement = adFormElement.querySelector('#title');
const addressElement = adFormElement.querySelector('#address');
const typeElement = adFormElement.querySelector('#type');
const priceElement = adFormElement.querySelector('#price');
const sliderElement = document.querySelector('.ad-form__slider');
const roomsElement = adFormElement.querySelector('#room_number');
const guestsElement = adFormElement.querySelector('#capacity');
const checkinElement = adFormElement.querySelector('#timein');
const checkoutElement = adFormElement.querySelector('#timeout');

const TITLE_SIZE = {
  min: 30,
  max: 100
};
const TOKYO_DOWNTOWN = {
  lat: 35.6895,
  lng: 139.692
};
const typePrice = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
  maxPrice: 100000
};

const pristine =  new Pristine(adFormElement, {
  classTo: 'ad-form__element',
  successClass: 'ad-form__element--valid',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error-text'
});

const validateTitle =  (value) => value.length >= TITLE_SIZE.min && value.length <= TITLE_SIZE.max;
const getErrorTitleMessage = (value) => {
  if (value.length <= TITLE_SIZE.min) {
    return `Минимальная длина ${TITLE_SIZE.min} символов`;
  } else if (value.length >= TITLE_SIZE.max) {
    return `Максимальная длина ${TITLE_SIZE.max} символов`;
  }
};
pristine.addValidator(titleElement, validateTitle, getErrorTitleMessage);

addressElement.value = `${TOKYO_DOWNTOWN.lat} ${TOKYO_DOWNTOWN.lng}`; // Координаты центра Токио по умолчанию (и чтоб не ругался)

const setForType = () => {
  switch (typeElement.value) {
    case 'bungalow' : {priceElement.placeholder = typePrice.bungalow; break;} // 0
    case 'flat' : {priceElement.placeholder = typePrice.flat; break;} // 1000
    case 'hotel' : {priceElement.placeholder = typePrice.hotel; break;} // 3000
    case 'house' : {priceElement.placeholder = typePrice.house; break;} // 5000
    case 'palace' : {priceElement.placeholder = typePrice.palace;} // 10000
  }
};

setForType();

noUiSlider.create(sliderElement, {
  range: {
    min: typePrice.bungalow,
    max: typePrice.maxPrice,
  },
  start: 0,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

const validatePrice = () => Number(priceElement.value) >= typePrice[typeElement.value] && typePrice.maxPrice >= Number(priceElement.value);
const getErrorPriceMessage = () => {
  if (Number(priceElement.value) < typePrice[typeElement.value]) {
    return `Минимальная цена должна быть больше ${typePrice[typeElement.value]}`;
  } else if (Number(priceElement.value) > typePrice.maxPrice) {
    return `Стоимость не должна превышать ${typePrice.maxPrice}`;
  }
};
pristine.addValidator(priceElement, validatePrice, getErrorPriceMessage);

const onTypeChange = () => {
  setForType();
  pristine.validate(priceElement);
};

const onPriceChange = () => {
  sliderElement.noUiSlider.set(Number(priceElement.value));
};

typeElement.addEventListener('change', onTypeChange);
priceElement.addEventListener('change', onPriceChange);

sliderElement.noUiSlider.on('slide', () => {
  setForType();
  priceElement.value = sliderElement.noUiSlider.get();
  pristine.validate(priceElement);
});

const resetSlider = () => {
  sliderElement.noUiSlider.reset();
};
// ------------------------------------------------------------------------------------------------------------
const validateRoomsAndGuests = () => (Number(guestsElement.value) <= Number(roomsElement.value) && Number(roomsElement.value) !== 100 && Number(guestsElement.value) !== 0) || (Number(roomsElement.value) === 100 && Number(guestsElement.value) === 0);

const getErrorRoomsMessage = () => {
  if (Number(roomsElement.value) < Number(guestsElement.value)) {
    return 'Количество гостей не должно превышать количество комнат';
  }else if(Number(roomsElement.value) !== 100 && Number(guestsElement.value) === 0) {
    return 'не для гостей выбирайте 100 комнат';
  }
};

const getErrorGuestsMessage = () => {
  if (Number(guestsElement.value) > Number(roomsElement.value)) {
    return 'Количество комнат не может быть меньше количества гостей';
  } else if(Number(roomsElement.value) === 100 && Number(guestsElement.value) !== 0) {
    return '100 комнат это не для гостей';
  }
};
pristine.addValidator(guestsElement, validateRoomsAndGuests, getErrorRoomsMessage);
pristine.addValidator(roomsElement, validateRoomsAndGuests, getErrorGuestsMessage);

const onRoomsChange = () => {
  pristine.validate(roomsElement);
  pristine.validate(guestsElement);
};
roomsElement.addEventListener('change',  onRoomsChange);

const onGuestsChange = () => {
  pristine.validate(guestsElement);
  pristine.validate(roomsElement);
};
guestsElement.addEventListener('change', onGuestsChange);
// ------------------------------------------------------------------------------------------------------------
const onCheckinChange = () => {
  if (checkinElement.value !== checkoutElement.value) {
    checkoutElement.value = checkinElement.value;
  }
};
const onCheckoutChange = () => {
  if (checkinElement.value !== checkoutElement.value) {
    checkinElement.value = checkoutElement.value;
  }
};
checkinElement.addEventListener('change', onCheckinChange);
checkoutElement.addEventListener('change', onCheckoutChange);
// ------------------------------------------------------------------------------------------------------------

const setFormSubmit = () => {
  adFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if(pristine.validate()) {
      blockSubmitButton();
      sendData(
        () => {
          unblockSubmitButton();
          resetForm();
          openMessage(createSuccess());
        },
        () => {
          unblockSubmitButton();
          openMessage(createError());
        },
        new FormData(evt.target),
      );
    }
  });
};

export { setFormSubmit, resetSlider };
