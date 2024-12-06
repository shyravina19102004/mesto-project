// src/index.js

import './styles.css';
import { getUserInfo, getCards, updateUserInfo, addCard, deleteCard, likeCard, unlikeCard, updateAvatar } from './data/api.js';

// Темплейт карточки
const cardTemplate = document
    .querySelector("#card-template")
    .content.querySelector(".places__item");

// DOM узлы
const placesList = document.querySelector(".places__list");
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupTitle = imagePopup.querySelector('.popup__caption');

// Функция создания карточки
function createCard(cardData) {
    const card = cardTemplate.cloneNode(true);
    const cardTitle = card.querySelector(".card__title");
    const cardImage = card.querySelector(".card__image");
    const likeCount = card.querySelector(".card__like-count");

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    likeCount.textContent = cardData.likes.length;

    const deleteButton = card.querySelector(".card__delete-button");
    deleteButton.addEventListener("click", () => {
        deleteCard(cardData._id).then(() => {
            card.remove();
        }).catch(error => {
            console.error('Ошибка при удалении карточки:', error);
        });
    });

    const likeButton = card.querySelector(".card__like-button");
    likeButton.addEventListener("click", () => {
        if (likeButton.classList.contains('card__like-button_is-active')) {
            unlikeCard(cardData._id).then(card => {
                likeButton.classList.remove('card__like-button_is-active');
                likeCount.textContent = card.likes.length;
            }).catch(error => {
                console.error('Ошибка при снятии лайка:', error);
            });
        } else {
            likeCard(cardData._id).then(card => {
                likeButton.classList.add('card__like-button_is-active');
                likeCount.textContent = card.likes.length;
            }).catch(error => {
                console.error('Ошибка при постановке лайка:', error);
            });
        }
    });

    cardImage.addEventListener("click", () => {
        openImagePopup(cardData.name, cardData.link);
    });

    return card;
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
function renderCards(cards) {
    cards.forEach((card) => {
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
document.addEventListener('DOMContentLoaded', () => {
    getUserInfo().then(user => {
        profileTitle.textContent = user.name;
        profileDescription.textContent = user.about;
        profileImage.style.backgroundImage = `url(${user.avatar})`;
    }).catch(error => {
        console.error('Ошибка при загрузке информации о пользователе:', error);
    });

    getCards().then(cards => {
        renderCards(cards);
    }).catch(error => {
        console.error('Ошибка при загрузке карточек:', error);
    });
});

// Обработчик открытия поп-апа редактирования профиля
const editProfileButton = document.querySelector('.profile__edit-button');
editProfileButton.addEventListener('click', () => {
    const nameInput = profilePopup.querySelector('.popup__input_type_name');
    const descriptionInput = profilePopup.querySelector('.popup__input_type_description');
    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;
    openModal(profilePopup);
});

// Обработчик отправки формы редактирования профиля
const profileFormElement = profilePopup.querySelector('.popup__form');
const saveButton = profileFormElement.querySelector('.popup__button');

profileFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    saveButton.textContent = 'Сохранение...';
    const name = evt.target.elements.name.value;
    const about = evt.target.elements.description.value;
    updateUserInfo(name, about).then(user => {
        profileTitle.textContent = user.name;
        profileDescription.textContent = user.about;
        closeModal(profilePopup);
    }).catch(error => {
        console.error('Ошибка при обновлении информации о пользователе:', error);
    }).finally(() => {
        saveButton.textContent = 'Сохранить';
    });
});

// Обработчик открытия поп-апа добавления карточки
const addCardButton = document.querySelector('.profile__add-button');
addCardButton.addEventListener('click', () => {
    const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
    const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');
    cardNameInput.value = '';
    cardLinkInput.value = '';
    openModal(cardPopup);
});

// Обработчик отправки формы добавления карточки
const cardFormElement = cardPopup.querySelector('.popup__form');
cardFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    saveButton.textContent = 'Сохранение...';
    const name = evt.target.elements['place-name'].value;
    const link = evt.target.elements.link.value;
    addCard(name, link).then(card => {
        const newCard = createCard(card);
        placesList.prepend(newCard);
        closeModal(cardPopup);
    }).catch(error => {
        console.error('Ошибка при добавлении карточки:', error);
    }).finally(() => {
        saveButton.textContent = 'Сохранить';
    });
});

// Обработчик открытия поп-апа обновления аватара
const avatarEditButton = document.querySelector('.profile__image-edit-button');
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarFormElement.querySelector('.popup__input');
const avatarSaveButton = avatarFormElement.querySelector('.popup__button');

avatarEditButton.addEventListener('click', () => {
    avatarInput.value = '';
    openModal(avatarPopup);
});

// Обработчик отправки формы обновления аватара
avatarFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    avatarSaveButton.textContent = 'Сохранение...';
    const avatar = avatarInput.value;
    updateAvatar(avatar).then(user => {
        profileImage.style.backgroundImage = `url(${user.avatar})`;
        closeModal(avatarPopup);
    }).catch(error => {
        console.error('Ошибка при обновлении аватара:', error);
    }).finally(() => {
        avatarSaveButton.textContent = 'Сохранить';
    });
});
