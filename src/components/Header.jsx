import { useContext, useEffect, useRef, useState } from 'react'
import logoImg from '../assets/logo.jpg'
import Button from './UI/Button.jsx'
import CartContext from '../store/CartContext.jsx';
import userProgressContext from '../store/UserProgressContext.jsx';


export default function Header(){
    const headerRef = useRef(null);
    const [isFixed, setIsFixed] = useState(false);
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(userProgressContext);

    useEffect(() => {
        function handleScroll(){
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const headerHeight = headerRef.current?.offsetHeight ?? 0;
            setIsFixed(isMobile && window.scrollY >= headerHeight);
        }

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    }, 0);

    function handleShowCart(){
        userProgressCtx.showCart();
    }

    return (
        <div className="header-wrapper" style={isFixed ? { height: `${headerRef.current?.offsetHeight ?? 0}px` } : undefined}>
            <header id="main-header" className={isFixed ? 'is-fixed' : undefined} ref={headerRef}>
                <div id="title">
                    <img src={logoImg} alt="Julie's restaurant" />
                    <h1> Deliciaso </h1>
                </div>
                <nav>
                    <Button textOnly onClick={handleShowCart}> Cart ({totalCartItems})</Button>
                </nav>
            </header>
        </div>
    )
}
