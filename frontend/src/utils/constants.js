
export const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

export const apiOptions =
{
    baseUrl: 'http://expressOlecyaMesto.nomoredomains.work',
    // baseUrl: 'http://localhost:3001',
    headers:
    {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
}
// {
//     baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-52',
//     headers:
//     {
//         authorization: '71aaadd6-02f4-42c8-bb63-514ed8832d4f',
//         'Content-Type': 'application/json'
//     }
// }