import logoImg from '../assets/logo.jpg'
import Button from './UI/Button.jsx'

export default function Header(){
    return (
        <header id="main-header">
            <div id="title">
                <img src={logoImg} alt="Julie's restaurant" />
                <h1> Jule's Food</h1>
            </div>
            <nav>
                <Button textOnly> Cart (0)</Button>
            </nav>
        </header>
    )
}
