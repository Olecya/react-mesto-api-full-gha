import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRouteElement from "./ProtectedRoute";

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import api from '../utils/Api';
import PopupWithForm from './PopupWithForm';
import { ImagePopup } from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup ';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import SignSection from './SignSection';
import InfoTooltip from './InfoTooltip';
import { authorize, register, checkToken } from '../utils/auth';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    const [isEditProfilePopupOpen, setIsEditProfileClick] = useState(false);
    const [isAddPlacePopupOpen, setAddPlaceClick] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatarClick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [isInfoTooltipOpenIsOk, setIsInfoTooltipOpenIsOk] = useState(false);

    const [selectedCard, setSelectedCard] = useState({
        card: {
            link: null,
            name: null
        }
    });

    const getUser = useCallback(() => {
        api.getProfile()
            .then((res) => setCurrentUser(res))
            .catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        loggedIn && getUser();
    }, [loggedIn]);

    const getCards = useCallback(async () => {
        try {
            setLoading(true);
            const resposne = await api.getInitialCards();
            setCards(resposne);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loggedIn && getCards();
    }, [loggedIn]);

    function closeAllPopups() {
        setIsInfoTooltipOpen(false);
        setEditAvatarClick(false);
        setIsEditProfileClick(false);
        setAddPlaceClick(false);
        setSelectedCard({
            card: {
                link: null,
                name: null
            }
        });
    }

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            checkToken(jwt)
                .then(() => {
                    setLoggedIn(true);
                })
                .then(() => { navigate("/") })
                .catch((err) => console.log(err));
        }
    }, []);

    function handleCardLike(card, method) {
        api.toggleLikeCard(card._id, method)
            .then((newCard) => { setCards((state) => state.map((c) => c._id === card._id ? newCard : c)); })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => { setCards((cards) => cards.filter((c) => c._id !== card._id)) })
            .catch((err) => console.log(err));;
    }

    function handleAddPlace(card) {
        api.postNewCard(card)
            .then((newCard) => { 
                console.log(newCard);
                setCards([newCard, ...cards]) })
            .then(() => closeAllPopups())
            .catch((err) => console.log(err));
    }

    function handleUpdateUser(dataUser) {
        api.patchProfile(dataUser)
            .then((res) => setCurrentUser(res))
            .then(() => closeAllPopups())
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUrl) {
        api.patchProfileAvatar(avatarUrl)
            .then((res) => setCurrentUser(res))
            .then(() => closeAllPopups())
            .catch((err) => console.log(err));
    }

    function handleUserOut() {
        setLoggedIn(false);
        localStorage.setItem('mail', '');
        localStorage.setItem('jwt', '');
    }

    function handleSignUp({ email, password }) {
        register(email, password)
            .then((r) => {
                setIsInfoTooltipOpenIsOk(r.ok);
                setIsInfoTooltipOpen(true);
            })
            .catch((err) => console.log(err))
    }
    function handleSignIn({ email, password }) {
        authorize(password, email)
            .then((data) => {
                // console.log(data.token);
                if (data.token) {
                    setLoggedIn(true);
                    localStorage.setItem('mail', email);
                    localStorage.setItem('jwt', data.token);
                } else {
                    setIsInfoTooltipOpenIsOk(false);
                    setIsInfoTooltipOpen(true);
                }
            })
            .then(() => navigate("/", { replace: true }))
            .catch((err) => console.log(err))
    }

    return (
        <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
            <div>
                <Header userOut={handleUserOut} />
                <Routes>
                    <Route path="/" element={loggedIn ? <Navigate to="/cards" replace /> : <Navigate to="/sign-in" replace />} />
                    <Route path="/sign-up/*" element={<SignSection nameSignSection="Регистрация" buttonText="Зарегистрировать" onDataUser={handleSignUp} signUp={true} />} />
                    <Route path="/sign-in/*" element={<SignSection nameSignSection="Вход" buttonText="Войти" onDataUser={handleSignIn} />} />

                    <Route path="/cards" element={
                        <ProtectedRouteElement element={
                            <Main
                                onEditAvatar={() => setEditAvatarClick(true)}
                                onEditProfile={() => setIsEditProfileClick(true)}
                                onAddPlace={() => setAddPlaceClick(true)}
                                cards={cards}
                                onCardClick={setSelectedCard}
                                onCardLike={handleCardLike}
                                onCardDelete={handleCardDelete}
                                loading={loading}
                            />}
                            loggedIn={loggedIn}
                        />
                    } />
                </Routes>

                <Footer />
                <InfoTooltip onClose={closeAllPopups} isOpen={isInfoTooltipOpen} isOk={isInfoTooltipOpenIsOk} />
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
                <ImagePopup onClose={closeAllPopups} card={selectedCard} />
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />

                <PopupWithForm name="popup-trash" title="Вы уверены?" buttonText="Да" />
            </div>
        </ CurrentUserContext.Provider>
    );
}

export default App
