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
}

// Функция для закрытия поп-апа
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
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
