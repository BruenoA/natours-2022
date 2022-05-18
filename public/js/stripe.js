/* eslint-disable */
import stripe from 'stripe';
import axios from 'axios';
import {showAlert} from './alerts';

const Stripe = stripe('pk_test_51L02RKDUB6UkDXCURE8lblhNTV4mUNBAfiB3JY27U0vP2hyvBzm7pRMZW3Bsbfd2gDrg8dsSE1DTuE5y97gXWgD000kVujCIgu');
export const bookTour = async tourId =>{
    try{
        const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);
        await Stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    }
    catch(err){
        console.log(err);
        showAlert('error',err)
    }

}
