import './styles.css';
import { initialCards } from './data/cards.js';

// Темплейт карточки
const cardTemplate = document
    .querySelector("#card-template")
    .content.querySelector(".card");

// DOM узлы
const placesList = document.querySelector(".places__list");
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupTitle = imagePopup.querySelector('.popup__caption');

// Функция создания карточки
function createCard(cardData) {
    const card = cardTemplate.cloneNode(true);
    const cardTitle = card.querySelector(".card__title");
    const cardImage = card.querySelector(".card__image");

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    const deleteButton = card.querySelector(".card__delete-button");
    deleteButton.addEventListener("click", () => {
        deleteCard(card);
    });

    const likeButton = card.querySelector(".card__like-button");
    likeButton.addEventListener("click", () => {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    cardImage.addEventListener("click", () => {
        openImagePopup(cardData.name, cardData.link);
    });

    return card;
}

// Функция удаления карточки
function deleteCard(card) {
    card.remove();
}

// Функция для открытия поп-апа с изображением
function openImagePopup(title, link) {
    imagePopupImage.src = link;
    imagePopupImage.alt = title;
    imagePopupTitle.textContent = title;
    openModal(imagePopup);
}

// Функция для открытия поп-апа
function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEsc);
}

// Функция для закрытия поп-апа
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEsc);
}

// Функция для закрытия поп-апа по нажатию на Esc
function closeByEsc(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}

// Вывести карточки на страницу
function renderCards() {
    initialCards.forEach((card) => {
        const cardElement = createCard(card);
        placesList.appendChild(cardElement);
    });
}

// Обработка кликов на закрывающие кнопки поп-апов
const closeButtons = document.querySelectorAll('.popup__close');
closeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const popup = event.target.closest('.popup');
        closeModal(popup);
    });
});

// Обработка клика на оверлей
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup')) {
        closeModal(event.target);
    }
});

// Инициализация карточек
document.addEventListener('DOMContentLoaded', renderCards);

// Обработчик открытия поп-апа редактирования профиля
const editProfileButton = document.querySelector('#edit-profile-button');
editProfileButton.addEventListener('click', () => {
    const nameInput = profilePopup.querySelector('#name-input');
    const descriptionInput = profilePopup.querySelector('#description-input');
    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;
    openModal(profilePopup);
});

// Обработчик отправки формы редактирования профиля
const profileFormElement = document.querySelector('#profile-form');
profileFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    profileTitle.textContent = evt.target.elements.name.value;
    profileDescription.textContent = evt.target.elements.description.value;
    closeModal(profilePopup);
});

// Обработчик открытия поп-апа добавления карточки
const addCardButton = document.querySelector('#add-card-button');
addCardButton.addEventListener('click', () => {
    const cardNameInput = cardPopup.querySelector('#card-name-input');
    const cardLinkInput = cardPopup.querySelector('#card-link-input');
    cardNameInput.value = '';
    cardLinkInput.value = '';
    openModal(cardPopup);
});

// Обработчик отправки формы добавления карточки
const cardFormElement = document.querySelector('#card-form');
cardFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const newCardData = {
        name: evt.target.elements.name.value,
        link: evt.target.elements.link.value
    };
    const newCard = createCard(newCardData);
    placesList.prepend(newCard);
    closeModal(cardPopup);
});

// Настройки валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Включение валидации
enableValidation(validationSettings);

// Функция для включения валидации формы
function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach(form => {
    setEventListeners(form, settings);
  });
}

// Функция для установки слушателей событий
function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, settings);
  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

// Функция для проверки валидности поля
function checkInputValidity(formElement, inputElement, settings) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

// Функция для показа ошибки
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

// Функция для скрытия ошибки
function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = '';
}

// Функция для переключения состояния кнопки
function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

// Функция для проверки наличия невалидного поля
function hasInvalidInput(inputList) {
  return inputList.some(inputElement => !inputElement.validity.valid);
}
