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
                        onCardDelete={props.onCardDelete} 
                        />
                    ))}
            </section>
        </main>
    );
}

export default Main;