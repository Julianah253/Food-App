import CartContext from "../store/CartContext.jsx";
import Modal from "./UI/Modal.jsx";
import { currencyFormatter } from '../util/formatting.js'
import Button from "./UI/Button";
import userProgressContext from "../store/UserProgressContext.jsx";

export default function Cart(){
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(userProgressContext);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price,0
    )

    return(
        <Modal className="cart" open={userProgressCtx.progress === 'cart'}>
            <h2> Your Cart </h2>
            <ul>
                {cartCtx.items.map((item) => (
                    <li key={item.id}> 
                    {item.name} - {item.quantity} 
                    </li>
                ))}
            </ul>
            <p className="cart-total"> {currencyFormatter.format(cartTotal)} </p>
            <p className="modal-actions">
                <Button textOnly> Close </Button>
                <Button> Go to Checkout </Button>
            </p>
        </Modal>
    )
}