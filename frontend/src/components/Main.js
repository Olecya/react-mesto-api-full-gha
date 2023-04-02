// import avatarImg from '../image/Avatar.png';
import '../blocks/profile/profile.css'
import { useContext, useEffect, useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Card } from './Card';
import api from '../utils/Api';
import { ImagePopup } from './ImagePopup';

function Main(props) {

    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
    // const currentUser = useContext(CurrentUserContext);

    const { name, about, avatar } = currentUser;

    // const [selectedCard, setSelectedCard] = useState({
    //     card: {
    //         link: null,
    //         name: null
    //     }
    // });

    // function handleCardLike(card, method) {
    //     api.toggleLikeCard(card._id, method)
    //         .then((newCard) => { setCards((state) => state.map((c) => c._id === card._id ? newCard : c)); })
    //         .catch((err) => console.log(err));
    // }

    // function handleCardDelete(card) {
    //     api.deleteCard(card._id)
    //         .then(() => { setCards((cards) => cards.filter((c) => c._id !== card._id)) })
    //         .catch((err) => console.log(err));;
    // }

    return (
        <main>
            <section className="profile">
                <div className="profile__avatar-box">
                    <img onClick={props.onEditAvatar} src={avatar} className="profile__avatar" alt="" />
                    <button className="profile__avatar-button" type="button"></button>
                </div>
                <div className="profile__infor">
                    <div className="profile__name">
                        <h1 className="profile__title">{name}</h1>
                        <button
                            onClick={props.onEditProfile}
                            className="profile__button-open"
                            type="button"
                            aria-label="open profile"></button>
                    </div>
                    <p className="profile__subtitle">{about}</p>
                </div>
                <button
                    onClick={props.onAddPlace}
                    className="profile__button"
                    type="button"
                    aria-label="add profile"></button>
            </section>
            <section className="elements">
                {props.loading ? "" :
                    props.cards.map((card) => (
                        <Card key={card._id} card={card}
                        onCardClick={props.onCardClick}
                        onCardLike={props.onCardLike}
                        onCardDelete={props.onCardDelete} />
                    ))}
            </section>
            {/* <ImagePopup onClose={() => closeAllPopups()} card={selectedCard} /> */}
            {/* {props.children} */}
        </main>
    );
}

export default Main;